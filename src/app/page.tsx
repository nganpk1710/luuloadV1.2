import { Header } from "@/components/layout/Header";
import { BreakSection } from "@/components/sections/BreakSection";
import { Community } from "@/components/sections/Community";
import { Footer } from "@/components/sections/Footer";
import { Hashtag } from "@/components/sections/Hashtag";
import { Hero } from "@/components/sections/Hero";
import { LastCta } from "@/components/sections/LastCta";
import { Projects } from "@/components/sections/Projects";
import { Usp } from "@/components/sections/Usp";

export default function Home() {
  return (
    // Giai đoạn 1: chỉ dựng ở 1920 (cắt ngang dưới 1920px, PageTransition bọc overflow-x-clip).
    <div>
      <main className="relative mx-auto w-[1920px]">
        <Header />
        {/* Khung cho Hero → Break: Hero dính đáy viewport trong 1.5 viewport cuộn (MOTION mục 3) */}
        <div style={{ height: "calc(1680px + 1.5 * var(--vhp, 1080px))" }}>
          <div className="sticky" style={{ top: "min(0px, calc(var(--vhp, 1080px) - 1680px))" }}>
            <Hero />
          </div>
        </div>
        <BreakSection />
        <Projects />
        <Usp />
        <Hashtag />
        <Community />
        <LastCta />
        <Footer />
      </main>
    </div>
  );
}
