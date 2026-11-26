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
    // Giai đoạn 1: chỉ dựng ở 1920. Dưới 1920px trang cuộn ngang cho tới khi có thiết kế 1440/768/390.
    <div className="overflow-x-auto">
      <main className="relative mx-auto w-[1920px]">
        <Header />
        <Hero />
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
