/**
 * Copy trang /community (MOTION mục 13). Nội dung theo ảnh Overall_Community.png (đã duyệt 26.11),
 * nhóm 04 đổi thành "Kiến trúc & Cảnh quan". Ảnh chưa có: dùng khối màu palette (`tone`).
 */
export const communityHero = {
  eyebrow: "Lưu Load Community",
  title: ["Make it", "together."],
  body: "A gathering place for the works, questions, and people of a more creative Việt Nam.",
  /** 5 "ảnh" dọc nghiêng quanh tiêu đề. Toạ độ theo canvas 1920, tỉ lệ từ ảnh mẫu (894px → ×2.148). */
  photos: [
    { left: 105, top: 300, w: 380, h: 520, rotate: -8, tone: "bg-red", speed: 0.12 },
    { left: 1425, top: 315, w: 395, h: 420, rotate: 6, tone: "bg-blue", speed: -0.08 },
    { left: 15, top: 1075, w: 230, h: 340, rotate: 10, tone: "bg-amber", speed: 0.18 },
    { left: 300, top: 900, w: 285, h: 485, rotate: 4, tone: "bg-sky", speed: -0.14 },
    { left: 1380, top: 880, w: 300, h: 525, rotate: -4, tone: "bg-yellow", speed: 0.1 },
  ],
} as const;

export const communityIntro = {
  eyebrow: "Title for placeholder text",
  title: ["Build a practice", "with room to grow."],
} as const;

export const communityGroups = [
  {
    no: "01",
    name: "Nghệ thuật & Chế tác",
    body: "Art, craft, materials, and the pleasure of making.",
    slug: "nghe-thuat-che-tac",
    tone: "red",
  },
  {
    no: "02",
    name: "Đời sống & Phong vị",
    body: "Everyday rituals, food, fashion, and the details that make a place feel lived in.",
    slug: "doi-song-phong-vi",
    tone: "yellow",
  },
  {
    no: "03",
    name: "Dòng chảy & Cõi thiêng",
    body: "Stories, beliefs, music, and the living currents that connect us.",
    slug: "dong-chay-coi-thieng",
    tone: "blue",
  },
  {
    no: "04",
    name: "Kiến trúc & Cảnh quan",
    body: "Architecture, landscape, and the spaces that hold memory.",
    slug: "di-san-kien-truc-canh-quan",
    tone: "amber",
  },
] as const;

export const communityGroupsLink = "Explore the stories";

export const communityBanner = {
  lines: ["We shape space", "into purpose."],
} as const;
