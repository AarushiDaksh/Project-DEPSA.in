"use client";

import {
  ArrowRight,
  
  Search,
} from "lucide-react";

export default function AnalyzeBar() {
  return (
    <section className="border-y border-black/10  bg-[#fffaf4]/65 px-6 py-24">

      <div className="mx-auto max-w-[950px] text-center">

        <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-black/40">
          START WITH A REPOSITORY
        </div>

        <h2
          className="mt-5 text-[42px] font-semibold leading-none tracking-[-0.04em] sm:text-[56px]"
          style={{ fontFamily: "DEPSA, sans-serif" }}
        >
          See what your Salesforce
          <br />
          actually depends on.
        </h2>

        <p
          className="mx-auto mt-6 max-w-[600px] text-[15px] leading-6 text-black/55"
          style={{ fontFamily: "DEPSA, sans-serif" }}
        >
          Connect a GitHub repository, upload an SFDX project,
          or connect your Salesforce org.
        </p>

        <div className="mx-auto mt-10 max-w-[850px]">

          <div className="flex flex-col gap-2 rounded-[22px] border border-black/10 bg-[#fff8f0]/75 p-2 shadow-[0_25px_70px_rgba(70,30,0,0.1)] backdrop-blur-xl sm:flex-row">

            <div className="flex flex-1 items-center gap-3 px-5">

              <Search
                size={18}
                className="shrink-0 text-black/35"
              />

              <input
                type="text"
                placeholder="Paste a GitHub repository URL"
                className="h-12 w-full bg-transparent text-[14px] text-black outline-none placeholder:text-black/35"
              />

            </div>

            <button className="group flex h-12 items-center justify-center gap-2 rounded-[15px] bg-[#17151d] px-7 text-[13px] font-medium text-white transition hover:bg-black">

              Analyze repository

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />

            </button>

          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-black/40">
            
            GitHub · SFDX ZIP · Salesforce Org
          </div>

        </div>

      </div>

    </section>
  );
}