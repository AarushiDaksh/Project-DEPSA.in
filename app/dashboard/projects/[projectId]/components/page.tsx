"use client";

import { Boxes } from "lucide-react";

export default function ComponentsPage() {
  return (
    <>
      <Header
        step="03"
        icon={<Boxes size={17} />}
        title="Components"
        description="Explore every Salesforce component discovered inside your project."
      />

      <div className="mt-8 rounded-[22px] border border-black/[0.07] bg-[#fffaf4]/65 p-10 text-center">
        <Boxes
          size={28}
          className="mx-auto text-[#523d90]"
        />

        <h2 className="mt-4 text-sm font-semibold">
          Component explorer
        </h2>

        <p className="mx-auto mt-2 max-w-[420px] text-xs leading-5 text-black/40">
          This view will be populated directly from
          the components discovered by the DePSA analyzer.
        </p>
      </div>
    </>
  );
}

function Header({
  step,
  icon,
  title,
  description,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[#523d90]">
        {icon}

        <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
          Step {step}
        </span>
      </div>

      <h1 className="mt-4 text-[42px] font-semibold tracking-[-0.05em]">
        {title}
      </h1>

      <p className="mt-3 max-w-[650px] text-sm leading-6 text-black/45">
        {description}
      </p>
    </div>
  );
}