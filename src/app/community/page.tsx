import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { CommunityBanner } from "@/components/community/CommunityBanner";
import { CommunityGroups } from "@/components/community/CommunityGroups";
import { CommunityHero } from "@/components/community/CommunityHero";
import { Reveal } from "@/components/motion/Reveal";
import { Footer } from "@/components/sections/Footer";
import { communityIntro } from "@/content/community";

export const metadata: Metadata = {
  title: "Cộng đồng | Lưu Load",
  description: "Make it together. Một nơi tụ họp cho tác phẩm, câu hỏi và những người làm sáng tạo Việt Nam.",
};

/** /community: tổng quan bốn nhóm (MOTION mục 13). Dựng ở 1920 trước. */
export default function CommunityPage() {
  return (
    <main className="relative mx-auto w-[1920px]">
      <Header active="/community" />
      <CommunityHero />

      <Reveal as="section" amount={0.3} aria-labelledby="community-intro" className="relative h-[698px] w-[1920px] bg-white text-ink">
        <p data-reveal className="absolute top-[240px] left-[155px] text-[16px] leading-none font-bold tracking-[0.18em] uppercase">
          {communityIntro.eyebrow}
        </p>
        <h2 id="community-intro" className="absolute top-[300px] left-[150px] font-display text-[140px] leading-[128px] font-extrabold uppercase">
          {communityIntro.title.map((l, i) => (
            <span key={l} className="block overflow-hidden py-[0.12em] -my-[0.12em]">
              <span data-reveal className="block" style={{ "--d": 100 + i * 100, "--reveal-y": "110%" } as CSSProperties}>
                {l}
              </span>
            </span>
          ))}
        </h2>
      </Reveal>

      <CommunityGroups />
      <CommunityBanner />
      <Footer />
    </main>
  );
}
