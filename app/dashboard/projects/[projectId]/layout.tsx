"use client";

import { ReactNode } from "react";
import ProjectSidebar from "@/components/dashboard/Sidebar";

export default function ProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  return (
    <ProjectLayoutClient params={params}>
      {children}
    </ProjectLayoutClient>
  );
}

async function ProjectLayoutClient({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <div className="flex min-h-screen bg-[#f5eee5] text-[#11100f]">
      <ProjectSidebar projectId={projectId} />

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1450px] px-5 py-8 sm:px-8 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}