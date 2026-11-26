import Image from "next/image";
import { PillLink } from "@/components/ui/PillLink";
import { projects } from "@/content/sections";

/** Projects 1920 × 1144, nền trắng (Figma node 2718:429). */
export function Projects() {
  return (
    <section aria-labelledby="projects-title" className="relative h-[1144px] w-[1920px] overflow-hidden bg-white text-ink">
      <h2
        id="projects-title"
        className="text-trim absolute top-[200px] left-8 w-[472px] font-display text-[120px] leading-[107.273px] font-extrabold uppercase"
      >
        {projects.title}
      </h2>
      <p className="text-trim absolute top-[464px] left-8 w-[440px] text-[24px] leading-[39px] font-medium uppercase">
        {projects.subtitle}
      </p>
      <PillLink variant="dark" href={projects.cta.href} className="absolute top-[761px] left-8 w-[164px]">
        {projects.cta.label}
      </PillLink>

      <div className="absolute top-[215.67px] left-[580px] h-[793.67px] w-[760px] overflow-hidden">
        <Image src={projects.image.src} alt={projects.image.alt} width={760} height={794} sizes="760px" className="max-w-none" />
      </div>

      <p className="text-trim absolute top-[200px] left-[1448px] font-display text-[20px] leading-[107.273px] font-bold uppercase">
        {projects.index}
      </p>
      <p className="text-trim absolute top-[239px] left-[1448px] font-display text-[60px] leading-[107.273px] font-extrabold whitespace-nowrap uppercase">
        {projects.eyebrowTitle}
      </p>
      <p className="text-trim absolute top-[346px] left-[1448px] w-[440px] text-[20px] leading-[30px] font-normal">
        {projects.body}
      </p>
    </section>
  );
}
