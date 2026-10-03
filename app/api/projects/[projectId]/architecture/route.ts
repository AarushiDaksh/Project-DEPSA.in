import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ projectId: string }>;
  }
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

      select: {
        id: true,
        name: true,

        versions: {
          orderBy: {
            version: "desc",
          },

          take: 1,

          select: {
            id: true,
            version: true,
            status: true,

            components: {
              select: {
                id: true,
                name: true,
                type: true,
                apiName: true,
                path: true,
              },
            },

            relationships: {
              select: {
                id: true,
                type: true,

                source: {
                  select: {
                    id: true,
                    name: true,
                    type: true,
                    apiName: true,
                    path: true,
                  },
                },

                target: {
                  select: {
                    id: true,
                    name: true,
                    type: true,
                    apiName: true,
                    path: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!project || !project.versions[0]) {
      return NextResponse.json(
        { error: "Project analysis not found" },
        { status: 404 }
      );
    }

    const version = project.versions[0];

    return NextResponse.json({
      id: project.id,
      name: project.name,
      version: version.version,
      status: version.status,
      components: version.components,
      relationships: version.relationships,
    });
  } catch (error) {
    console.error(
      "Architecture API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load project architecture",
      },
      { status: 500 }
    );
  }
}