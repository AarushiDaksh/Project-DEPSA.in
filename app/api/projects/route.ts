import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * GET
 * Return lightweight project metadata.
 * NEVER return fileData here.
 */
export async function GET(request: Request) {
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

    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
      },

      select: {
        id: true,
        name: true,
        currentVersionId: true,
        createdAt: true,
        updatedAt: true,

        versions: {
          orderBy: {
            version: "desc",
          },

          take: 1,

          select: {
            id: true,
            version: true,
            fileName: true,
            fileSize: true,
            status: true,
            createdAt: true,
          },
        },
      },

      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects:", error);

    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    );
  }
}

/**
 * POST
 * Upload a new Salesforce ZIP.
 *
 * This endpoint ONLY stores the project/version.
 * Analysis happens separately.
 */
export async function POST(request: Request) {
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

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "ZIP file is required" },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith(".zip")) {
      return NextResponse.json(
        { error: "Only ZIP files are supported" },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: "The ZIP file is empty" },
        { status: 400 }
      );
    }

    const projectIdValue = formData.get("projectId");

    const projectId =
      typeof projectIdValue === "string" &&
      projectIdValue.length > 0
        ? projectIdValue
        : null;

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    /**
     * Existing project → create next version.
     */
    if (projectId) {
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

      const latestVersion =
        await prisma.projectVersion.findFirst({
          where: {
            projectId: project.id,
          },
          orderBy: {
            version: "desc",
          },
          select: {
            version: true,
          },
        });

      const nextVersion =
        (latestVersion?.version ?? 0) + 1;

      const version =
        await prisma.projectVersion.create({
          data: {
            projectId: project.id,
            version: nextVersion,
            fileName: file.name,
            fileSize: file.size,
            fileData: buffer,
            status: "UPLOADED",
          },

          select: {
            id: true,
            version: true,
            fileName: true,
            fileSize: true,
            status: true,
          },
        });

      await prisma.project.update({
        where: {
          id: project.id,
        },
        data: {
          currentVersionId: version.id,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        project: {
          id: project.id,
          name: project.name,
        },
        version,
      });
    }

    /**
     * New project.
     *
     * Project name is derived from the ZIP filename.
     */
    const projectName = file.name
      .replace(/\.zip$/i, "")
      .replace(/[_-]+/g, " ")
      .trim();

    const project = await prisma.project.create({
      data: {
        userId: session.user.id,
        name: projectName || "Salesforce Project",
      },
    });

    const version =
      await prisma.projectVersion.create({
        data: {
          projectId: project.id,
          version: 1,
          fileName: file.name,
          fileSize: file.size,
          fileData: buffer,
          status: "UPLOADED",
        },

        select: {
          id: true,
          version: true,
          fileName: true,
          fileSize: true,
          status: true,
        },
      });

    await prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        currentVersionId: version.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        project: {
          id: project.id,
          name: project.name,
        },
        version,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/projects:", error);

    return NextResponse.json(
      { error: "Failed to upload project" },
      { status: 500 }
    );
  }
}