
"use client";

import { useEffect, useRef } from "react";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const track = trackRef.current;

    if (!footer || !track) return;

    const handleScroll = () => {
      const rect = footer.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, (window.innerHeight - rect.top) / window.innerHeight)
      );

      track.style.transform = `translateX(${-progress * 12}%)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden  bg-[#fffaf4]/65 px-6 pb-6 pt-32 text-black"
    >
      <div className="mx-auto max-w-[1380px]">

        <div className="mb-6 flex items-center justify-between border-t border-black/10 pt-4">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/45">
              System online
            </span>
          </div>

          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/30">
            DePSA / 2026
          </span>
        </div>

        <div className="relative overflow-hidden py-10">
          <div
            ref={trackRef}
            className="flex w-max whitespace-nowrap transition-transform duration-300 ease-out"
          >
            <span className="text-[clamp(6rem,18vw,17rem)] font-semibold leading-[0.72] tracking-[-0.09em]">
              DePSA&nbsp;&nbsp; DePSA&nbsp;&nbsp; DePSA
            </span>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 border-t border-black/10 pt-5 md:grid-cols-3">

          <div>
            <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.18em] text-black/30">
              About
            </p>

            <p className="max-w-[260px] text-sm leading-6 text-black/55">
              A Salesforce system intelligence interface designed to
              understand, monitor and simplify enterprise workflows.
            </p>
          </div>

          <div>
            <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.18em] text-black/30">
              System
            </p>

            <div className="space-y-2 font-mono text-[10px] uppercase tracking-[0.12em]">
              <p>Salesforce</p>
              <p>Data Intelligence</p>
              <p>Workflow Analysis</p>
              <p>Enterprise Systems</p>
            </div>
          </div>

          <div className="md:text-right">
            <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.18em] text-black/30">
              Status
            </p>

            <p className="font-mono text-[10px] uppercase tracking-[0.14em]">
              All systems operational
            </p>

            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-black/30">
              Last sync — 2026
            </p>
          </div>

        </div>

        <div className="mt-28 flex items-end justify-between border-t border-black/10 pt-5">

          <div>
            <span className="text-sm font-semibold tracking-[-0.04em]">
              DePSA
            </span>

            <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-black/25">
              Salesforce system intelligence
            </p>
          </div>

          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-black/25">
            End of system
          </span>

        </div>

      </div>
    </footer>
  );
}

