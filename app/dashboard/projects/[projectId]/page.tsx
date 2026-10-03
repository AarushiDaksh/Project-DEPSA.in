"use client";

import {
  ArrowRight,
  Boxes,
  GitBranch,
  Loader2,
  Network,
  Upload,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  name: string;
  versions: {
    id: string;
    version: number;
    fileName: string;
    fileSize: number;
    status: string;
    createdAt: string;
  }[];
};

export default function ProjectOverview({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const router = useRouter();

  const [projectId, setProjectId] =
    useState<string>("");

  const [project, setProject] =
    useState<Project | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ projectId }) => {
      setProjectId(projectId);

      fetch(`/api/projects/${projectId}`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.error) {
            setProject(data);
          }
        })
        .finally(() => setLoading(false));
    });
  }, [params]);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Loader2
          size={20}
          className="animate-spin text-[#523d90]"
        />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="rounded-[22px] border border-black/[0.07] bg-white/50 p-10">
        Project not found.
      </div>
    );
  }

  const version = project.versions[0];

  return (
    <>
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#523d90]">
            DePSA project
          </p>

          <h1 className="mt-2 text-[40px] font-semibold tracking-[-0.05em]">
            {project.name}
          </h1>

          <p className="mt-2 text-sm text-black/40">
            Salesforce intelligence workspace
          </p>
        </div>

        <button
          onClick={() =>
            router.push(
              `/dashboard/projects/${projectId}/systems`
            )
          }
          className="flex items-center gap-2 rounded-[11px] bg-[#523d90] px-5 py-3 text-sm font-medium text-white"
        >
          Continue analysis
          <ArrowRight size={15} />
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={Network}
          label="Version"
          value={`v${version?.version ?? 1}`}
        />

        <Stat
          icon={Boxes}
          label="Components"
          value="—"
        />

        <Stat
          icon={GitBranch}
          label="Relationships"
          value="—"
        />

        <Stat
          icon={Zap}
          label="Status"
          value={version?.status ?? "Uploaded"}
        />
      </div>

      <div className="mt-5 rounded-[22px] border border-black/[0.07] bg-[#fffaf4]/65 p-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-black/30">
              Current version
            </p>

            <h2 className="mt-2 text-lg font-semibold">
              {version?.fileName}
            </h2>

            <p className="mt-1 text-xs text-black/35">
              {version
                ? `${(
                    version.fileSize /
                    1024 /
                    1024
                  ).toFixed(2)} MB`
                : ""}
            </p>
          </div>

          <Upload
            size={18}
            className="text-[#523d90]"
          />
        </div>
      </div>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Network;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[18px] border border-black/[0.07] bg-[#fffaf4]/65 p-5">
      <Icon
        size={17}
        className="text-[#523d90]"
      />

      <p className="mt-5 text-[10px] uppercase tracking-[0.16em] text-black/30">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold">
        {value}
      </p>
    </div>
  );
}