"use client";

import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative z-10">

      {/* EYEBROW */}
      <div className="mb-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-black mt-10">
        <span className="h-2 w-2 rounded-full bg-[#523d90] "/>
        Salesforce System intelligence
        <span className="text-black">→</span>
      </div>

      {/* MAIN HEADING */}
      <h1
        className="
          max-w-[900px]
          text-[58px]
          font-black
          uppercase
          leading-[0.88]
          tracking-[-0.055em]
          text-black
          sm:text-[68px]
          md:text-[78px]
          lg:text-[92px]
        "
        style={{
          fontFamily:
            "Arial Black, Helvetica Neue, Arial, sans-serif",
        }}
      >
        Understand Your
        <br />
        Salesforce
        <br />
        <span className="text-[#523d90dc]">Codebase.</span>
      </h1>

      {/* STATEMENT */}
      <div
        className="
          mt-10
          text-[38px]
          leading-[0.95]
          tracking-[-0.045em]
          text-black
          italic
          sm:text-[44px]
          md:text-[50px]
        "
        style={{
          fontFamily:
            "Georgia, Times New Roman, serif",
        }}
      >
        Ask <span className="text-[#523d90]">DePSA.</span>
      </div>

      {/* TAGLINE */}
      <div
        className="
          mt-3
          text-[17px]
          tracking-[0.01em]
          text-black/50
          sm:text-[19px]
        "
        style={{
          fontFamily:
            "Georgia, Times New Roman, serif",
        }}
      >
        mapped by structure.
      </div>

      {/* DESCRIPTION */}
      <p
        className="
          mt-8
          max-w-[610px]
          text-[16px]
          leading-7
          text-black
          sm:text-[18px]
        "
      >
        DePSA turns your Salesforce code, metadata,
        dependencies and architecture into one connected
        system model.
      </p>

      {/* ACTIONS */}
      <div className="mt-9 flex flex-wrap gap-3">

        <a
          href="/signup"
          className="
            group
            flex
            items-center
            gap-3
            rounded-full
            bg-[#17151d]
            px-6
            py-3.5
            text-[14px]
            font-medium
            text-white
            transition
            duration-300
            hover:-translate-y-1
          "
        >
          Explore your codebase

          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </a>

        <a
          href="#how-it-works"
          className="
            rounded-full
            border
            border-black/15
            bg-white/20
            px-6
            py-3.5
            text-[14px]
            font-medium
            text-black
            backdrop-blur-sm
            transition
            duration-300
            hover:bg-white/40
          "
        >
          See how it works
        </a>

      </div>

      {/* MICRO TRUST LINE */}
      <div
        className="
          mt-10
          flex
          flex-wrap
          gap-x-7
          gap-y-2
          font-mono
          text-[9px]
          uppercase
          tracking-[0.16em]
          text-black/40
        "
      >
       
      </div>

    </div>
  );
}