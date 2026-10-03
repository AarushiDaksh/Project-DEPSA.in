"use client";

import { useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  GitBranch,
  Lock,
  Package,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react";

type Position = {
  x: number;
  y: number;
};

type CardId =
  | "production"
  | "dependency"
  | "core"
  | "sandbox1"
  | "sandbox2"
  | "impact";

const initialPositions: Record<CardId, Position> = {
  production: { x: 25, y: 220 },
  dependency: { x: 170, y: 80 },
  core: { x: 330, y: 220 },
  sandbox1: { x: 500, y: 130 },
  sandbox2: { x: 500, y: 330 },
  impact: { x: 55, y: 390 },
};

export default function GraphPreview() {
  const canvasRef = useRef<HTMLDivElement>(null);

  const [positions, setPositions] =
    useState<Record<CardId, Position>>(initialPositions);

  const [dragging, setDragging] =
    useState<CardId | null>(null);

  const dragOffset = useRef({
    x: 0,
    y: 0,
  });

  function startDrag(
    e: React.PointerEvent<HTMLDivElement>,
    id: CardId
  ) {
    e.preventDefault();

    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    dragOffset.current = {
      x:
        e.clientX -
        rect.left -
        positions[id].x,

      y:
        e.clientY -
        rect.top -
        positions[id].y,
    };

    setDragging(id);

    e.currentTarget.setPointerCapture(
      e.pointerId
    );
  }

  function moveDrag(
    e: React.PointerEvent<HTMLDivElement>
  ) {
    if (!dragging) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    const cardSize = getCardSize(dragging);

    let x =
      e.clientX -
      rect.left -
      dragOffset.current.x;

    let y =
      e.clientY -
      rect.top -
      dragOffset.current.y;

    const padding = 12;

    x = Math.max(
      padding,
      Math.min(
        x,
        rect.width -
          cardSize.width -
          padding
      )
    );

    y = Math.max(
      65,
      Math.min(
        y,
        rect.height -
          cardSize.height -
          padding
      )
    );

    setPositions((current) => ({
      ...current,
      [dragging]: {
        x,
        y,
      },
    }));
  }

  function stopDrag() {
    setDragging(null);
  }

  return (
    <div className="relative h-[570px] w-full lg:h-[650px]">

      <div
        ref={canvasRef}
        className="
          absolute
          inset-[2%]
          overflow-hidden
          rounded-[34px]
          border
          border-white/35
          bg-white/[0.07]
          shadow-[0_35px_90px_rgba(82,61,144,0.08)]
          backdrop-blur-[3px]
        "
      >

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.25]
          "
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(82,61,144,0.30) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(82,61,144,0.30) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "32px 32px",

            maskImage:
              "radial-gradient(circle at center, black 18%, transparent 88%)",

            WebkitMaskImage:
              "radial-gradient(circle at center, black 18%, transparent 88%)",
          }}
        />

      
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            rounded-[34px]
            bg-[#523d90]/[0.035]
            backdrop-blur-[1px]
          "
        />

       
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[300px]
            w-[300px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#523d90]/[0.10]
            blur-[100px]
          "
        />
 

        <div
          className="
            pointer-events-none
            absolute
            left-7
            right-7
            top-6
            z-50
            flex
            items-center
            justify-between
          "
        >

          <div className="flex items-center gap-3">

            <span
              className="
                font-mono
                text-[8px]
                
                tracking-[0.22em]
                text-black
              "
            >
              DePSA / SYSTEM GRAPH
            </span>

            <span className="h-px w-8 bg-black" />

            <span
              className="
                font-mono
                text-[7px]
                uppercase
                tracking-[0.18em]
                text-black
              "
            >
              REAL-TIME
            </span>

          </div>

          <div
            className="
              flex
              items-center
              gap-2
              font-mono
              text-[7px]
              uppercase
              tracking-[0.15em]
              text-black
            "
          >

            <span className="relative flex h-2 w-2">

              <span
                className="
                  absolute
                  inline-flex
                  h-full
                  w-full
                  animate-ping
                  rounded-full
                  bg-[#523d90]
                  opacity-30
                "
              />

              <span
                className="
                  relative
                  inline-flex
                  h-2
                  w-2
                  rounded-full
                  bg-[#523d90]
                "
              />

            </span>

            Mapped

          </div>

        </div>


      
        <Connection
          from={positions.production}
          to={positions.core}
        />

        <Connection
          from={positions.core}
          to={positions.sandbox1}
        />

        <Connection
          from={positions.core}
          to={positions.sandbox2}
        />


     
        <Draggable
          id="production"
          position={positions.production}
          dragging={dragging === "production"}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
        >
          <ProductionCard />
        </Draggable>

        <Draggable
          id="dependency"
          position={positions.dependency}
          dragging={dragging === "dependency"}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
        >
          <DependencyCard />
        </Draggable>


       
        <Draggable
          id="core"
          position={positions.core}
          dragging={dragging === "core"}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
        >
          <CoreCard />
        </Draggable>


      
        <Draggable
          id="sandbox1"
          position={positions.sandbox1}
          dragging={dragging === "sandbox1"}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
        >
          <SandboxCard
            number="01"
            name="Dev Sandbox"
            status="SYNCED"
            components="186"
            accent
          />
        </Draggable>


      
        <Draggable
          id="sandbox2"
          position={positions.sandbox2}
          dragging={dragging === "sandbox2"}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
        >
          <SandboxCard
            number="02"
            name="QA Sandbox"
            status="ANALYZED"
            components="143"
          />
        </Draggable>


        <Draggable
          id="impact"
          position={positions.impact}
          dragging={dragging === "impact"}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
        >
          <ImpactCard />
        </Draggable>


        <div
          className="
            pointer-events-none
            absolute
            bottom-7
            right-7
            z-50
            text-right
          "
        >

          <div className="flex items-center justify-end gap-2">

            <Zap
              size={9}
              className="text-black"
            />

            <span
              className="
                font-mono
                text-[7px]
                uppercase
                tracking-[0.17em]
                text-black
              "
            >
              472 relationships resolved
            </span>

          </div>

          <div
            className="
              mt-1
              font-mono
              text-[6px]
              uppercase
              tracking-[0.15em]
              text-black
            "
          >
            02 environments connected
          </div>

        </div>

      </div>
    </div>
  );
}


function Draggable({
  id,
  position,
  dragging,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  children,
}: {
  id: CardId;
  position: Position;
  dragging: boolean;
  onPointerDown: (
    e: React.PointerEvent<HTMLDivElement>,
    id: CardId
  ) => void;
  onPointerMove: (
    e: React.PointerEvent<HTMLDivElement>
  ) => void;
  onPointerUp: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      onPointerDown={(e) =>
        onPointerDown(e, id)
      }
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={`
        absolute
        select-none
        touch-none
        transition-[filter,transform]
        duration-150
        ${
          dragging
            ? "z-50 cursor-grabbing scale-[1.02] brightness-[1.03]"
            : "z-20 cursor-grab"
        }
      `}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {children}
    </div>
  );
}



function Connection({
  from,
  to,
}: {
  from: Position;
  to: Position;
}) {
  const x1 = from.x + 95;
  const y1 = from.y + 70;

  const x2 = to.x + 65;
  const y2 = to.y + 65;

  const dx = x2 - x1;

  const path = `
    M ${x1} ${y1}
    C ${x1 + dx * 0.35} ${y1},
      ${x2 - dx * 0.35} ${y2},
      ${x2} ${y2}
  `;

  return (
    <svg
      className="
        pointer-events-none
        absolute
        inset-0
        z-10
        h-full
        w-full
        overflow-visible
      "
    >
      <path
        d={path}
        fill="none"
        stroke="rgba(82,61,144,0.28)"
        strokeWidth="1"
        strokeDasharray="5 5"
      />

      <circle
        cx={x2}
        cy={y2}
        r="3"
        fill="#523d90"
        opacity="0.75"
      />
    </svg>
  );
}



function ProductionCard() {
  return (
    <div
      className="
        w-[190px]
        rounded-[20px]
        border
        border-white/50
        bg-white/55
        p-4
        shadow-[0_24px_55px_rgba(40,20,70,0.12)]
        backdrop-blur-2xl
      "
    >

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2.5">

          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-[10px]
              bg-[#17151d]
              text-white
            "
          >
            <Boxes size={14} />
          </div>

          <div>

            <div className="text-[12px] font-semibold">
              Production
            </div>

            <div
              className="
                mt-0.5
                font-mono
                text-[6px]
                uppercase
                tracking-[0.16em]
                text-black/35
              "
            >
              Salesforce Org
            </div>

          </div>

        </div>

        <span className="h-1.5 w-1.5 rounded-full bg-[#523d90]" />

      </div>


      <div className="mt-5 grid grid-cols-3 gap-1.5">

        <MiniStat
          value="42"
          label="APEX"
        />

        <MiniStat
          value="18"
          label="LWC"
        />

        <MiniStat
          value="126"
          label="META"
        />

      </div>


      <div
        className="
          mt-4
          flex
          items-center
          gap-2
          border-t
          border-black/[0.08]
          pt-3
        "
      >

        <Lock
          size={9}
          className="text-black/35"
        />

        <span
          className="
            font-mono
            text-[6px]
            uppercase
            tracking-[0.12em]
            text-black/35
          "
        >
          Protected environment
        </span>

      </div>

    </div>
  );
}



function DependencyCard() {
  return (
    <div
      className="
        w-[190px]
        rotate-[-3deg]
        rounded-[18px]
        border
        border-white/50
        bg-[#fffaf4]/65
        p-4
        shadow-[0_28px_60px_rgba(40,20,70,0.14)]
        backdrop-blur-2xl
      "
    >

      <div className="flex items-center justify-between">

        <span
          className="
            font-mono
            text-[7px]
            uppercase
            tracking-[0.18em]
            text-black/35
          "
        >
          Dependency
        </span>

        <GitBranch
          size={11}
          className="text-black/30"
        />

      </div>


      <div
        className="
          mt-3
          flex
          items-center
          gap-2
          text-[10px]
          font-semibold
        "
      >

        <span>OrderService</span>

        <ArrowUpRight
          size={10}
          className="text-[#523d90]/60"
        />

        <span>
          NotificationService
        </span>

      </div>


      <div
        className="
          mt-3
          flex
          items-center
          justify-between
          border-t
          border-black/[0.08]
          pt-2
        "
      >

        <span
          className="
            font-mono
            text-[6px]
            uppercase
            tracking-[0.13em]
            text-[#523d90]/70
          "
        >
          CALLS
        </span>

        <span
          className="
            font-mono
            text-[6px]
            text-black/30
          "
        >
          98% CONFIDENCE
        </span>

      </div>

    </div>
  );
}




function CoreCard() {
  return (
    <div className="relative">

      <div
        className="
          absolute
          -inset-5
          rounded-full
          bg-[#523d90]/10
          blur-[18px]
        "
      />

      <div
        className="
          absolute
          -inset-3
          rounded-full
          border
          border-[#523d90]/20
        "
      />

      <div
        className="
          absolute
          -inset-6
          rounded-full
          border
          border-dashed
          border-[#523d90]/15
        "
      />

      <div
        className="
          relative
          flex
          h-[130px]
          w-[130px]
          items-center
          justify-center
          rounded-full
          border
          border-white/10
          bg-[#17151d]
          text-white
          shadow-[0_30px_70px_rgba(40,20,70,0.28)]
        "
      >

        <div
          className="
            absolute
            inset-[10px]
            rounded-full
            border
            border-white/[0.08]
          "
        />

        <div className="relative text-center">

          <div
            className="
              font-mono
              text-[6px]
              uppercase
              tracking-[0.22em]
              text-white/30
            "
          >
            Intelligence
          </div>

          <div
            className="
              mt-2
              text-[20px]
              font-semibold
              tracking-[-0.05em]
            "
          >
            DePSA
          </div>

          <div
            className="
              mt-2
              font-mono
              text-[6px]
              uppercase
              tracking-[0.14em]
              text-white/30
            "
          >
            dependency engine
          </div>

        </div>

        <div
          className="
            absolute
            right-[-3px]
            top-[25px]
            h-2
            w-2
            rounded-full
            bg-[#523d90]
            shadow-[0_0_18px_rgba(82,61,144,.9)]
          "
        />

      </div>

    </div>
  );
}


function SandboxCard({
  number,
  name,
  status,
  components,
  accent = false,
}: {
  number: string;
  name: string;
  status: string;
  components: string;
  accent?: boolean;
}) {
  return (
    <div
      className="
        w-[205px]
        rounded-[19px]
        border
        border-white/50
        bg-white/55
        p-4
        shadow-[0_22px_55px_rgba(40,20,70,0.12)]
        backdrop-blur-2xl
      "
    >

      <div className="flex items-center justify-between">

        <span
          className="
            font-mono
            text-[7px]
            tracking-[0.17em]
            text-black/30
          "
        >
          SBX / {number}
        </span>

        <span
          className="
            flex
            items-center
            gap-1.5
            font-mono
            text-[6px]
            uppercase
            tracking-[0.12em]
            text-black/35
          "
        >

          <span
            className={`
              h-1.5
              w-1.5
              rounded-full
              ${
                accent
                  ? "bg-[#523d90]"
                  : "bg-black/30"
              }
            `}
          />

          {status}

        </span>

      </div>


      <div
        className="
          mt-3
          text-[13px]
          font-semibold
          tracking-[-0.02em]
        "
      >
        {name}
      </div>


      <div
        className="
          mt-4
          flex
          items-end
          justify-between
          border-t
          border-black/[0.08]
          pt-3
        "
      >

        <div>

          <div
            className="
              font-mono
              text-[6px]
              uppercase
              tracking-[0.14em]
              text-black/30
            "
          >
            Components
          </div>

          <div
            className="
              mt-1
              text-[19px]
              font-semibold
              tracking-[-0.04em]
            "
          >
            {components}
          </div>

        </div>


        <div
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-lg
            border
            border-black/10
            bg-white/20
          "
        >
          <GitBranch size={10} />
        </div>

      </div>

    </div>
  );
}


function ImpactCard() {
  return (
    <div
      className="
        w-[220px]
        rounded-[19px]
        bg-[#17151d]
        p-5
        text-white
        shadow-[0_30px_70px_rgba(40,20,70,0.24)]
      "
    >

      <div className="flex items-center justify-between">

        <div
          className="
            font-mono
            text-[7px]
            uppercase
            tracking-[0.18em]
            text-white/30
          "
        >
          Impact analysis
        </div>

        <Search
          size={11}
          className="text-white/30"
        />

      </div>


      <div className="mt-2 flex items-end gap-2">

        <span
          className="
            text-[39px]
            font-semibold
            leading-none
            tracking-[-0.07em]
          "
        >
          14
        </span>

        <span
          className="
            pb-1
            font-mono
            text-[6px]
            uppercase
            text-white/30
          "
        >
          affected
        </span>

      </div>


      <div className="mt-4 space-y-2.5">

        <ImpactRow
          icon={<ArrowDownRight size={9} />}
          label="Apex classes"
          value="06"
        />

        <ImpactRow
          icon={<Package size={9} />}
          label="Metadata"
          value="05"
        />

        <ImpactRow
          icon={<ShieldCheck size={9} />}
          label="Permissions"
          value="03"
        />

      </div>

    </div>
  );
}


/* ==========================================================
   MINI STAT
========================================================== */

function MiniStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div
      className="
        rounded-[9px]
        border
        border-black/[0.08]
        bg-white/20
        px-2
        py-2
      "
    >

      <div
        className="
          font-mono
          text-[6px]
          uppercase
          tracking-[0.12em]
          text-black/30
        "
      >
        {label}
      </div>

      <div className="mt-1 text-[11px] font-semibold">
        {value}
      </div>

    </div>
  );
}



function ImpactRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        border-t
        border-white/[0.08]
        pt-2.5
      "
    >

      <div className="flex items-center gap-2 text-white/50">

        <div
          className="
            flex
            h-5
            w-5
            items-center
            justify-center
            rounded-md
            border
            border-white/[0.08]
          "
        >
          {icon}
        </div>

        <span className="text-[8px]">
          {label}
        </span>

      </div>

      <span
        className="
          font-mono
          text-[7px]
          text-white/30
        "
      >
        {value}
      </span>

    </div>
  );
}

function getCardSize(id: CardId) {
  switch (id) {
    case "production":
      return {
        width: 190,
        height: 145,
      };

    case "dependency":
      return {
        width: 190,
        height: 105,
      };

    case "core":
      return {
        width: 130,
        height: 130,
      };

    case "sandbox1":
    case "sandbox2":
      return {
        width: 205,
        height: 130,
      };

    case "impact":
      return {
        width: 220,
        height: 205,
      };

    default:
      return {
        width: 180,
        height: 120,
      };
  }
}