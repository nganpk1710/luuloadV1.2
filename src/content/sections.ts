/**
 * Copy và dữ liệu tĩnh của các section sau Break Section (Projects → Footer).
 * Chỉnh nội dung ở đây, không sửa trong JSX. Copy lấy từ Figma V1.2 (một số đoạn vẫn là placeholder).
 */

const placeholder =
  "We solve for physics, budgets, timelines, and the curveballs. Every project reaches a moment where someone says";

export const projects = {
  index: "(01)",
  eyebrowTitle: "Lock in",
  title: "thành quả sáng tạo",
  subtitle: "Từ những bản phác thảo đầu tiên đến các dự án thực chiến",
  body: "We solve for physics, budgets, timelines, and the curveballs. Every project reaches a moment where someone says, “That’s impossible.” That’s usually when we start having fun. Our job is to make sure it not only works, but works flawlessly, repeatedly, and invisibly.",
  cta: { label: "Xem tất cả", href: "/gallery" },
  image: { src: "/assets/images/projects/project-showcase.png", alt: "Hậu trường dự án sân khấu ánh sáng" },
} as const;

export const usp = {
  title: "Chúng tôi đặc biệt",
  body: placeholder,
  cta: { label: "Button", href: "/about" },
  pillars: [
    { id: "vision", index: "(01)", label: "tầm nhìn", head: "bg-blue text-yellow", body: "bg-[#E9E8F0]", outer: "bg-blue", inner: "bg-yellow" },
    { id: "mission", index: "(02)", label: "Sứ mệnh", head: "bg-yellow text-blue", body: "bg-[#E8E8E8]", outer: "bg-red", inner: "bg-blue" },
    { id: "values", index: "(03)", label: "giá trị cốt lõi", head: "bg-red text-yellow", body: "bg-[#E8E8E8]", outer: "bg-yellow", inner: "bg-blue" },
  ],
  visionCenter: "Creatives",
} as const;

export const hashtag = {
  text: "#TIENLENVIETNAM",
  /** Toạ độ pill trong canvas 1920 (Figma 2718:594). Hai hàng pill ngoài canvas (trái) sẽ dùng cho marquee sau. */
  pills: [
    { left: 32, top: 159, tone: "yellow" },
    { left: 976, top: 159, tone: "red" },
    { left: -424, top: 329, tone: "yellow" },
    { left: 520, top: 329, tone: "red" },
    { left: 1464, top: 329, tone: "yellow" },
  ],
} as const;

export const community = {
  title: "Creatives",
  paragraphLeft: "We solve for physics, budgets, timelines, and the curveballs. Every project reaches  where someone",
  paragraphRight: placeholder,
  cta: { label: "Kết nối ngay", href: "/connect" },
  cards: [
    { index: "(01)", title: "nghệ thuật & chế tác", border: "border-red", left: 32, top: 560, titleTop: 326, size: "text-[60px] leading-[68.387px]" },
    { index: "(02)", title: "Đời sống & phong vị", border: "border-yellow", left: 504, top: 564, titleTop: 326, size: "text-[60px] leading-[68.387px]" },
    { index: "(03)", title: "Dòng chảy & Cõi thiêng", border: "border-blue", left: 976, top: 564, titleTop: 313, size: "text-[64px] leading-[70px]" },
    { index: "(04)", title: "kiến trúc & cảnh quan", border: "border-amber", left: 1448, top: 564, titleTop: 313, size: "text-[64px] leading-[70px]" },
  ],
} as const;

export const lastCta = {
  line1: "Kết nối",
  line2: "cùng chúng tôi",
  body: placeholder,
  cta: { label: "Kết nối ngay", href: "/connect" },
} as const;

export const footer = {
  body: "We solve for physics, budgets, timelines, and the curveballs. Every project reaches a moment where someone says",
  copyright: "© 2026 LưuLoad · hello.luuload.com.vn",
  legal: [
    { label: "Privacy Policy", href: "/privacy", left: 1133 },
    { label: "Term Of Use", href: "/terms", left: 1293 },
    { label: "Cookie Policy", href: "/cookies", left: 1428 },
  ],
  columns: [
    { heading: "Explore", left: 1133, gap: 37, links: [{ label: "về tụi mình", href: "/about" }, { label: "các dự án", href: "/gallery" }, { label: "cộng đồng", href: "/community" }] },
    { heading: "Explore", left: 1322, gap: 37, links: [{ label: "kết nối ngay", href: "/connect" }, { label: "promote your bran", href: "/connect" }] },
    { heading: "Explore", left: 1533, gap: 32, links: [{ label: "facebook", href: "#" }, { label: "instagram", href: "#" }, { label: "behance", href: "#" }] },
  ],
} as const;
