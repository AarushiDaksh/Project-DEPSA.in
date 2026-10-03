"use client";

import {
  AlertTriangle,
  Boxes,
  FolderKanban,
  GitBranch,
  Home,
  Network,
  Settings,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Project = {
  id: string;
  name: string;
  versions: {
    version: number;
    status: string;
  }[];
};

const navigation = [
  {
    label: "Overview",
    path: "",
    icon: Home,
  },
  {
    label: "Systems",
    path: "/systems",
    icon: Network,
  },
  {
    label: "Architecture",
    path: "/architecture",
    icon: GitBranch,
  },
  {
    label: "Components",
    path: "/components",
    icon: Boxes,
  },
  {
    label: "Automations",
    path: "/automations",
    icon: Zap,
  },
  {
    label: "Collisions",
    path: "/collisions",
    icon: AlertTriangle,
  },
];

export default function ProjectSidebar({
  projectId,
}: {
  projectId: string;
}) {
  const pathname = usePathname();

  const [project, setProject] =
    useState<Project | null>(null);

  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          setProject(data);
        }
      })
      .catch(console.error);
  }, [projectId]);

  const version = project?.versions?.[0];

  return (
    <aside className="hidden w-[250px] shrink-0 border-r border-black/[0.07] bg-[#f7efe6] lg:flex lg:flex-col">

      {/* Brand */}
      <div className="flex h-[88px] items-center border-b border-black/[0.06] px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-white shadow-sm">
            <Network
              size={18}
              className="text-[#523d90]"
            />
          </div>

          <span className="text-base font-semibold tracking-[-0.03em]">
            DePSA
          </span>
        </Link>
      </div>

      {/* Project */}
      <div className="border-b border-black/[0.06] p-5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-black/30">
          Project
        </p>

        <div className="mt-3 rounded-[14px] bg-white/55 p-3">
          <p className="truncate text-xs font-semibold">
            {project?.name ?? "Loading project..."}
          </p>

          {version && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-black/35">
                v{version.version}
              </span>

              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] text-emerald-700">
                {version.status}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-black/30">
          Workspace
        </p>

        <div className="space-y-1">
          {navigation.map((item) => {
            const href =
              `/dashboard/projects/${projectId}` +
              item.path;

            const active =
              pathname === href ||
              (item.path &&
                pathname.startsWith(href));

            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={href}
                className={[
                  "flex items-center gap-3 rounded-[11px] px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-[#523d90]/10 font-medium text-[#523d90]"
                    : "text-black/45 hover:bg-white/50 hover:text-black",
                ].join(" ")}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-black/[0.06] p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-[11px] px-3 py-2.5 text-sm text-black/40 transition hover:bg-white/50 hover:text-black"
        >
          <FolderKanban size={16} />
          All projects
        </Link>

        <button className="mt-1 flex w-full items-center gap-3 rounded-[11px] px-3 py-2.5 text-sm text-black/35 transition hover:bg-white/50 hover:text-black">
          <Settings size={16} />
          Project settings
        </button>
      </div>
    </aside>
  );
}