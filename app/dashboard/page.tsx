"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  FileArchive,
  FolderOpen,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";

type Project = {
  id: string;
  name: string;
  currentVersionId: string | null;
  createdAt: string;
  updatedAt: string;

  versions: {
    id: string;
    version: number;
    fileName: string;
    fileSize: number;
    status: string;
    createdAt: string;
  }[];
};

export default function DashboardPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showUploader, setShowUploader] = useState(false);

  async function loadProjects() {
    try {
      const response = await fetch("/api/projects", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load projects");
      }

      const data = await response.json();

      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function deleteProject(projectId: string) {
    const confirmed = window.confirm(
      "Delete this project and all its versions?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/projects/${projectId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      setProjects((current) =>
        current.filter(
          (project) => project.id !== projectId
        )
      );
    } catch (error) {
      console.error(error);
      alert("Could not delete project.");
    }
  }

  const filteredProjects = projects.filter((project) =>
    project.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f5eee5] text-[#11100f]">
    

    <main className="min-h-screen bg-[#f5eee5] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1380px]">

        {/* Header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#523d90]">
              DePSA workspace
            </p>

            <h1 className="mt-2 text-[38px] font-semibold tracking-[-0.05em] sm:text-[46px]">
              Projects
            </h1>

            <p className="mt-2 max-w-[600px] text-sm leading-6 text-black/45">
              Salesforce projects indexed by DePSA.
              Open a project to explore its architecture,
              components, automations and collisions.
            </p>
          </div>

          <button
            onClick={() => setShowUploader(true)}
            className="flex items-center justify-center gap-2 rounded-[12px] bg-[#523d90] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#433174]"
          >
            <Plus size={16} />
            New project
          </button>
        </div>

        {/* Search */}
        <div className="mt-8 flex items-center gap-3 rounded-[14px] border border-black/[0.07] bg-[#fffaf4]/70 px-4">
          <Search
            size={17}
            className="text-black/30"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search your Salesforce projects..."
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-black/30"
          />

          <span className="text-xs text-black/30">
            {filteredProjects.length} project
            {filteredProjects.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Projects */}
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2
              size={20}
              className="animate-spin text-[#523d90]"
            />
          </div>
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            onCreate={() => setShowUploader(true)}
          />
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => {
              const version = project.versions[0];

              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  version={version}
                  onOpen={() =>
                    router.push(
                      `/dashboard/projects/${project.id}`
                    )
                  }
                  onDelete={() =>
                    deleteProject(project.id)
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      {showUploader && (
        <ProjectUploader
          onClose={() => setShowUploader(false)}
          onUploaded={(projectId) => {
            router.push(
              `/dashboard/projects/${projectId}`
            );
          }}
        />
      )}
    </main>
    </div>
  );
}

function ProjectCard({
  project,
  version,
  onOpen,
  onDelete,
}: {
  project: Project;
  version?: Project["versions"][number];
  onOpen: () => void;
  onDelete: () => void;
}) {
  const size = version
    ? `${(version.fileSize / 1024 / 1024).toFixed(2)} MB`
    : "—";

  return (
    <article className="group rounded-[22px] border border-black/[0.07] bg-[#fffaf4]/75 p-5 shadow-[0_12px_50px_rgba(35,22,20,.04)] transition duration-300 hover:-translate-y-1 hover:bg-[#fffaf4] hover:shadow-[0_20px_70px_rgba(35,22,20,.08)]">

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-[#523d90]/10 text-[#523d90]">
            <FileArchive size={18} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">
              {project.name}
            </h2>

            <p className="mt-1 truncate text-[11px] text-black/35">
              {version?.fileName ?? "No version"}
            </p>
          </div>
        </div>

        <button
          onClick={onDelete}
          title="Delete project"
          className="rounded-[9px] p-2 text-black/25 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="mt-7 flex items-center gap-3 text-xs text-black/45">
        <span className="rounded-full bg-black/[0.04] px-2.5 py-1">
          Salesforce
        </span>

        <span>v{version?.version ?? 1}</span>

        <span>•</span>

        <span>{size}</span>
      </div>

      <div className="mt-5 border-t border-black/[0.06] pt-4">
        <div className="flex items-center justify-between">
          <span
            className={[
              "rounded-full px-2.5 py-1 text-[10px] font-medium",
              version?.status === "READY"
                ? "bg-emerald-500/10 text-emerald-700"
                : "bg-[#523d90]/10 text-[#523d90]",
            ].join(" ")}
          >
            {version?.status ?? "Uploaded"}
          </span>

          <button
            onClick={onOpen}
            className="flex items-center gap-1.5 text-xs font-medium text-[#523d90] transition hover:gap-2.5"
          >
            Open project
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

function EmptyState({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <div className="mt-5 flex min-h-[400px] flex-col items-center justify-center rounded-[22px] border border-dashed border-black/[0.12] bg-[#fffaf4]/40 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#523d90]/10 text-[#523d90]">
        <FolderOpen size={23} />
      </div>

      <h2 className="mt-5 text-lg font-semibold">
        No Salesforce projects yet
      </h2>

      <p className="mt-2 max-w-[400px] text-sm leading-6 text-black/40">
        Upload an SFDX project and DePSA will create
        a persistent workspace for it.
      </p>

      <button
        onClick={onCreate}
        className="mt-6 flex items-center gap-2 rounded-[11px] bg-[#523d90] px-4 py-2.5 text-sm font-medium text-white"
      >
        <Plus size={15} />
        Add project
      </button>
    </div>
  );
}

function ProjectUploader({
  onClose,
  onUploaded,
}: {
  onClose: () => void;
  onUploaded: (projectId: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload() {
    if (!file) return;

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "/api/projects",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Upload failed"
        );
      }

      onUploaded(data.project.id);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Upload failed"
      );
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 p-5 backdrop-blur-sm">
      <div className="w-full max-w-[520px] rounded-[24px] border border-black/[0.08] bg-[#fffaf4] p-7 shadow-[0_30px_100px_rgba(0,0,0,.15)]">

        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#523d90]">
              New project
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              Upload Salesforce project
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-sm text-black/30 hover:text-black"
          >
            Close
          </button>
        </div>

        <label className="mt-7 flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-[#523d90]/25 bg-[#523d90]/[0.025] p-6 text-center transition hover:bg-[#523d90]/[0.05]">
          <FileArchive
            size={26}
            className="text-[#523d90]"
          />

          <p className="mt-4 text-sm font-medium">
            {file
              ? file.name
              : "Choose an SFDX ZIP"}
          </p>

          <p className="mt-1 text-xs text-black/35">
            Upload your Salesforce project package
          </p>

          <input
            type="file"
            accept=".zip,application/zip"
            className="hidden"
            onChange={(event) =>
              setFile(
                event.target.files?.[0] ?? null
              )
            }
          />
        </label>

        {error && (
          <p className="mt-3 text-xs text-red-500">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-[11px] px-4 py-2.5 text-sm text-black/50 hover:bg-black/[0.04]"
          >
            Cancel
          </button>

          <button
            onClick={upload}
            disabled={!file || uploading}
            className="flex items-center gap-2 rounded-[11px] bg-[#523d90] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            {uploading && (
              <Loader2
                size={14}
                className="animate-spin"
              />
            )}

            {uploading
              ? "Uploading..."
              : "Upload project"}
          </button>
        </div>
      </div>
    </div>
  );
}