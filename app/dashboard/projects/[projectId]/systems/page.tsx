"use client";

import {
  ArrowRight,
  Box,
  Check,
  FileArchive,
  Loader2,
  Sparkles,
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
  }[];
};

export default function SystemsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const router = useRouter();

  const [projectId, setProjectId] =
    useState("");

  const [project, setProject] =
    useState<Project | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [analyzing, setAnalyzing] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    params.then(({ projectId }) => {
      setProjectId(projectId);

      fetch(`/api/projects/${projectId}`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.error) {
            setProject(data);
          } else {
            setError(data.error);
          }
        })
        .catch(() => {
          setError("Unable to load project.");
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, [params]);

  async function analyze() {
    if (!projectId) return;

    try {
      setAnalyzing(true);
      setError("");

      const response = await fetch(
        `/api/projects/${projectId}/analyze`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Analysis failed"
        );
      }

      router.push(
        `/dashboard/projects/${projectId}/architecture`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Analysis failed"
      );

      setAnalyzing(false);
    }
  }

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
        {error || "Project not found."}
      </div>
    );
  }

  const version = project.versions[0];

  return (
    <>
      <div className="mb-9">
        <div className="mb-4 flex items-center gap-2 text-[#523d90]">
          <Box size={17} />

          <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
            Step 01
          </span>
        </div>

        <h1 className="text-[42px] font-semibold tracking-[-0.05em]">
          Systems
        </h1>

        <p className="mt-3 max-w-[680px] text-sm leading-6 text-black/45">
          Inspect your Salesforce project and prepare
          the metadata foundation for DePSA's
          architecture and impact analysis.
        </p>
      </div>

      <div className="rounded-[22px] border border-black/[0.07] bg-[#fffaf4]/70 p-7">
        <div className="flex items-start justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#523d90]/10 text-[#523d90]">
              <FileArchive size={19} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.16em] text-black/30">
                Imported project
              </p>

              <h2 className="mt-1 truncate text-lg font-semibold">
                {project.name}
              </h2>

              <p className="mt-1 truncate text-xs text-black/35">
                {version?.fileName}
              </p>
            </div>
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-emerald-500/10 text-emerald-700">
            <Check size={16} />
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <Metric
            label="Version"
            value={`v${version?.version ?? 1}`}
          />

          <Metric
            label="Size"
            value={`${(
              (version?.fileSize ?? 0) /
              1024 /
              1024
            ).toFixed(2)} MB`}
          />

          <Metric
            label="Status"
            value={version?.status ?? "Uploaded"}
          />
        </div>
      </div>

      <div className="mt-5 rounded-[22px] border border-black/[0.07] bg-[#fffaf4]/60 p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-[#523d90]/10 text-[#523d90]">
            <Sparkles size={17} />
          </div>

          <div>
            <h2 className="text-sm font-semibold">
              Analyze this Salesforce project
            </h2>

            <p className="mt-1 max-w-[650px] text-xs leading-5 text-black/40">
              DePSA will inspect the SFDX structure,
              discover components and build the first
              dependency map.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-3">
          <Stage
            number="01"
            title="Inspect"
            text="Read Salesforce metadata"
          />

          <Stage
            number="02"
            title="Map"
            text="Discover components"
          />

          <Stage
            number="03"
            title="Connect"
            text="Build dependencies"
          />
        </div>

        {error && (
          <div className="mt-5 rounded-[11px] bg-red-500/[0.06] px-4 py-3 text-xs text-red-600">
            {error}
          </div>
        )}

        <div className="mt-7 flex justify-end">
          <button
            onClick={analyze}
            disabled={analyzing}
            className="flex items-center gap-2 rounded-[11px] bg-[#523d90] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#433174] disabled:cursor-wait disabled:opacity-60"
          >
            {analyzing ? (
              <>
                <Loader2
                  size={15}
                  className="animate-spin"
                />
                Analyzing...
              </>
            ) : (
              <>
                Analyze project
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[13px] border border-black/[0.06] bg-white/45 p-4">
      <p className="text-[9px] uppercase tracking-[0.16em] text-black/30">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}

function Stage({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[14px] border border-black/[0.06] bg-white/45 p-4">
      <span className="text-[9px] font-semibold text-[#523d90]">
        {number}
      </span>

      <p className="mt-3 text-xs font-semibold">
        {title}
      </p>

      <p className="mt-1 text-[10px] text-black/35">
        {text}
      </p>
    </div>
  );
}