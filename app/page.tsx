import Navbar from "@/components/layout/Navbr";
import Hero from "@/components/landing/Hero";
import GraphPreview from "@/components/landing/GraphPreview";
import AnalyzeBar from "@/components/landing/AnalyzeBar";
import Features from "@/components/landing/Features";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden text-[#17151d]">
      <Navbar />

      <section>
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid min-h-[760px] items-center gap-2 py-20 lg:grid-cols-[0.92fr_1.08fr]">
  <Hero />

  <div className="relative lg:translate-x-[5%]">
    <GraphPreview />
  </div>
</div>
        </div>
      </section>

      <AnalyzeBar />


      <Footer />
    </main>
  );
}


  