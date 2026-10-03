"use client";

import {
  ArrowRight,
  Boxes,
  GitBranch,
  Loader2,
  Network,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Component = {
  id: string;
  name: string;
  type: string;
  apiName: string | null;
  path: string;
};

type Relationship = {
  id: string;
  type: string;
  source: Component;
  target: Component;
};

type Architecture = {
  id: string;
  name: string;
  version: number;
  status: string;
  components: Component[];
  relationships: Relationship[];
};

export default function ArchitecturePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const router = useRouter();

  const [projectId, setProjectId] = useState("");
  const [data, setData] =
    useState<Architecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadArchitecture(id: string) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/projects/${id}/architecture`,
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to load architecture"
        );
      }

      setData(result);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load architecture"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    params.then(({ projectId }) => {
      setProjectId(projectId);
      loadArchitecture(projectId);
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

  if (error || !data) {
    return (
      <div className="rounded-[22px] border border-black/[0.07] bg-[#fffaf4]/70 p-10 text-center">
        <Network
          size={28}
          className="mx-auto text-[#523d90]"
        />

        <h2 className="mt-4 text-lg font-semibold">
          Architecture unavailable
        </h2>

        <p className="mt-2 text-sm text-black/40">
          {error ||
            "Run the project analysis first."}
        </p>

        <button
          onClick={() =>
            router.push(
              `/dashboard/projects/${projectId}/systems`
            )
          }
          className="mt-6 inline-flex items-center gap-2 rounded-[11px] bg-[#523d90] px-5 py-3 text-sm font-medium text-white"
        >
          Go to Systems
          <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  const counts = data.components.reduce(
    (result, component) => {
      result[component.type] =
        (result[component.type] ?? 0) + 1;

      return result;
    },
    {} as Record<string, number>
  );

  return (
    <>
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-4 flex items-center gap-2 text-[#523d90]">
            <Network size={17} />

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
              Step 02
            </span>
          </div>

          <h1 className="text-[42px] font-semibold tracking-[-0.05em]">
            Architecture
          </h1>

          <p className="mt-3 max-w-[650px] text-sm leading-6 text-black/45">
            A structural view of your Salesforce
            system and its detected dependencies.
          </p>
        </div>

        <button
          onClick={() =>
            loadArchitecture(projectId)
          }
          className="flex items-center gap-2 rounded-[11px] border border-black/[0.07] bg-white/50 px-4 py-2.5 text-xs text-black/50 transition hover:bg-white"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Stat
          label="Components"
          value={data.components.length}
          icon={Boxes}
        />

        <Stat
          label="Relationships"
          value={data.relationships.length}
          icon={GitBranch}
        />

        <Stat
          label="Apex"
          value={
            (counts.ApexClass ?? 0) +
            (counts.ApexTrigger ?? 0)
          }
        />

        <Stat
          label="Flows"
          value={counts.Flow ?? 0}
        />

        <Stat
          label="LWC"
          value={counts.LWC ?? 0}
        />
      </div>

      {/* Architecture */}
      <div className="mt-5 rounded-[22px] border border-black/[0.07] bg-[#fffaf4]/65 p-6">
        <div className="flex items-center justify-between border-b border-black/[0.06] pb-5">
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-black/30">
              System map
            </p>

            <h2 className="mt-1 text-base font-semibold">
              Detected relationships
            </h2>
          </div>

          <span className="text-xs text-black/35">
            {data.name} · v{data.version}
          </span>
        </div>

        {data.relationships.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
            <Network
              size={25}
              className="text-[#523d90]"
            />

            <h3 className="mt-4 text-sm font-semibold">
              No relationships detected
            </h3>

            <p className="mt-2 max-w-[400px] text-xs leading-5 text-black/40">
              Components were discovered, but no
              dependency edges have been detected yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 py-5 md:grid-cols-2 xl:grid-cols-3">
            {data.relationships
              .slice(0, 50)
              .map((relationship) => (
                <div
                  key={relationship.id}
                  className="rounded-[15px] border border-black/[0.06] bg-white/45 p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="truncate text-xs font-semibold">
                      {relationship.source.name}
                    </span>

                    <ArrowRight
                      size={13}
                      className="shrink-0 text-[#523d90]"
                    />

                    <span className="truncate text-xs font-semibold">
                      {relationship.target.name}
                    </span>
                  </div>

                  <span className="mt-3 inline-block rounded-full bg-[#523d90]/10 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.1em] text-[#523d90]">
                    {relationship.type}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Continue */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={() =>
            router.push(
              `/dashboard/projects/${projectId}/components`
            )
          }
          className="flex items-center gap-2 rounded-[11px] bg-[#523d90] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#433174]"
        >
          Explore components
          <ArrowRight size={15} />
        </button>
      </div>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon?: typeof Boxes;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[16px] border border-black/[0.07] bg-[#fffaf4]/60 p-4">
      {Icon && (
        <Icon
          size={15}
          className="text-[#523d90]"
        />
      )}

      <p className="mt-4 text-[9px] uppercase tracking-[0.16em] text-black/30">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold">
        {value}
      </p>
    </div>
  );
}