import { NextResponse } from "next/server";
import JSZip from "jszip";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

type DetectedComponent = {
  name: string;
  type: string;
  apiName: string | null;
  path: string;
  content?: string;
};

function getComponentFromPath(path: string) {
  const normalized = path.replace(/\\/g, "/");

  const parts = normalized.split("/");

  const mainDefaultIndex = parts.indexOf("main");

  if (
    mainDefaultIndex === -1 ||
    parts[mainDefaultIndex - 1] !== "default"
  ) {
    return null;
  }

  const metadataStart = mainDefaultIndex + 1;
  const relativeParts = parts.slice(metadataStart);

  if (!relativeParts.length) {
    return null;
  }

  const typeFolder = relativeParts[0];

  // Apex Classes
  if (typeFolder === "classes") {
    const file = relativeParts[1];

    if (!file || !file.endsWith(".cls")) return null;

    return {
      name: file.replace(".cls", ""),
      type: "ApexClass",
      apiName: file.replace(".cls", ""),
      path: normalized,
    };
  }

  // Apex Triggers
  if (typeFolder === "triggers") {
    const file = relativeParts[1];

    if (!file || !file.endsWith(".trigger")) return null;

    return {
      name: file.replace(".trigger", ""),
      type: "ApexTrigger",
      apiName: file.replace(".trigger", ""),
      path: normalized,
    };
  }

  // LWC bundles
  if (typeFolder === "lwc") {
    const folder = relativeParts[1];

    if (!folder) return null;

    return {
      name: folder,
      type: "LWC",
      apiName: folder,
      path: normalized,
    };
  }

  // Flows
  if (typeFolder === "flows") {
    const file = relativeParts[1];

    if (!file || !file.endsWith(".flow-meta.xml")) {
      return null;
    }

    return {
      name: file.replace(".flow-meta.xml", ""),
      type: "Flow",
      apiName: file.replace(".flow-meta.xml", ""),
      path: normalized,
    };
  }

  // Objects
  if (typeFolder === "objects") {
    const folder = relativeParts[1];

    if (!folder) return null;

    const objectMeta = relativeParts[2];

    if (
      objectMeta &&
      objectMeta.endsWith(".object-meta.xml")
    ) {
      return {
        name: folder,
        type: "CustomObject",
        apiName: folder,
        path: normalized,
      };
    }

    return null;
  }

  // Layouts
  if (typeFolder === "layouts") {
    const file = relativeParts[1];

    if (!file || !file.endsWith(".layout-meta.xml")) {
      return null;
    }

    return {
      name: file.replace(".layout-meta.xml", ""),
      type: "Layout",
      apiName: file.replace(".layout-meta.xml", ""),
      path: normalized,
    };
  }

  // Permission Sets
  if (typeFolder === "permissionsets") {
    const file = relativeParts[1];

    if (!file || !file.endsWith(".permissionset-meta.xml")) {
      return null;
    }

    return {
      name: file.replace(".permissionset-meta.xml", ""),
      type: "PermissionSet",
      apiName: file.replace(".permissionset-meta.xml", ""),
      path: normalized,
    };
  }

  // Profiles
  if (typeFolder === "profiles") {
    const file = relativeParts[1];

    if (!file || !file.endsWith(".profile-meta.xml")) {
      return null;
    }

    return {
      name: file.replace(".profile-meta.xml", ""),
      type: "Profile",
      apiName: file.replace(".profile-meta.xml", ""),
      path: normalized,
    };
  }

  return null;
}

function extractRelationships(
  components: Array<DetectedComponent & { id: string }>
) {
  const relationships: {
    sourceId: string;
    targetId: string;
    type: string;
  }[] = [];

  const apiComponents = components.filter(
    (component) => component.apiName
  );

  for (const source of components) {
    if (!source.content) continue;

    for (const target of apiComponents) {
      if (source.id === target.id) continue;
      if (!target.apiName) continue;

      const escapedName = target.apiName.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const referenceRegex = new RegExp(
        `\\b${escapedName}\\b`,
        "m"
      );

      if (!referenceRegex.test(source.content)) {
        continue;
      }

      let type = "REFERENCES";

      if (
        source.type === "ApexTrigger" &&
        target.type === "CustomObject"
      ) {
        type = "TRIGGERS";
      } else if (
        source.type === "Flow" &&
        target.type === "CustomObject"
      ) {
        type = "USES";
      } else if (
        source.type === "ApexClass" &&
        target.type === "ApexClass"
      ) {
        type = "DEPENDS_ON";
      } else if (
        source.type === "LWC" &&
        target.type === "ApexClass"
      ) {
        type = "CALLS";
      }

      relationships.push({
        sourceId: source.id,
        targetId: target.id,
        type,
      });
    }
  }

  return relationships;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { projectId } = await params;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const version = await prisma.projectVersion.findFirst({
      where: {
        projectId: project.id,
      },
      orderBy: {
        version: "desc",
      },
    });

    if (!version) {
      return NextResponse.json(
        { error: "No project version found" },
        { status: 404 }
      );
    }

    await prisma.projectVersion.update({
      where: {
        id: version.id,
      },
      data: {
        status: "ANALYZING",
      },
    });

    const zip = await JSZip.loadAsync(version.fileData);

    const detected: DetectedComponent[] = [];

    for (const [path, entry] of Object.entries(zip.files)) {
      if (entry.dir) continue;

      const component = getComponentFromPath(path);

      if (!component) continue;

      let content: string | undefined;

      const isTextFile =
        path.endsWith(".cls") ||
        path.endsWith(".trigger") ||
        path.endsWith(".xml") ||
        path.endsWith(".js") ||
        path.endsWith(".html");

      if (isTextFile) {
        content = await entry.async("text");
      }

      detected.push({
        ...component,
        content,
      });
    }

    // Remove duplicate component records.
    const unique = new Map<string, DetectedComponent>();

    for (const component of detected) {
      const key = `${component.type}:${component.apiName}:${component.path}`;

      if (!unique.has(key)) {
        unique.set(key, component);
      }
    }

    const components = Array.from(unique.values());

    // Remove previous analysis for this version.
    await prisma.relationship.deleteMany({
      where: {
        versionId: version.id,
      },
    });

    await prisma.component.deleteMany({
      where: {
        versionId: version.id,
      },
    });

    const createdComponents = [];

    for (const component of components) {
      const created = await prisma.component.create({
        data: {
          versionId: version.id,
          name: component.name,
          type: component.type,
          apiName: component.apiName,
          path: component.path,
        },
      });

      createdComponents.push({
        ...created,
        content: component.content,
      });
    }

    const relationships = extractRelationships(
      createdComponents
    );

    if (relationships.length) {
      await prisma.relationship.createMany({
        data: relationships.map((relationship) => ({
          versionId: version.id,
          sourceId: relationship.sourceId,
          targetId: relationship.targetId,
          type: relationship.type,
        })),
        skipDuplicates: true,
      });
    }

    await prisma.projectVersion.update({
      where: {
        id: version.id,
      },
      data: {
        status: "READY",
      },
    });

    return NextResponse.json({
      success: true,
      projectId: project.id,
      versionId: version.id,
      componentCount: createdComponents.length,
      relationshipCount: relationships.length,
    });
  } catch (error) {
    console.error("DePSA analysis error:", error);

    return NextResponse.json(
      {
        error: "Failed to analyze Salesforce project",
      },
      {
        status: 500,
      }
    );
  }
}