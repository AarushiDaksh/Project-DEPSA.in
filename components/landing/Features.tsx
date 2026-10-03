export default function Features() {
  return (
    <section
      id="explore"
      className="px-6 py-28"
    >
      <div className="mx-auto grid max-w-[1200px] gap-14 md:grid-cols-3">

        <Feature
          number="01"
          title="Map"
          text="Build a connected model of Apex, metadata, components and relationships."
        />

        <Feature
          number="02"
          title="Understand"
          text="Trace dependencies and reveal the structure underneath your Salesforce system."
        />

        <Feature
          number="03"
          title="Change"
          text="Understand potential impact before modifying your Salesforce environment."
        />

      </div>
    </section>
  );
}

function Feature({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="border-t border-black/15 pt-5">

      <div className="font-mono text-[9px] tracking-[0.18em] text-black/40">
        {number}
      </div>

      <h3
        className="mt-5 text-[34px] italic tracking-[-0.04em]"
        style={{ fontFamily: "DEPSA, sans-serif" }}
      >
        {title}
      </h3>

      <p
        className="mt-4 text-[14px] leading-6 text-black/50"
        style={{ fontFamily: "DEPSA, sans-serif" }}
      >
        {text}
      </p>

    </div>
  );
}