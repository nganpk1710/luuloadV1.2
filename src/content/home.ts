/**
 * Copy và dữ liệu tĩnh của trang chủ (Hero, Break Section, Header).
 * Chỉnh nội dung ở đây, không sửa trong JSX. Copy lấy từ Figma V1.2.
 */

export const navItems = [
  { label: "Các dự án", href: "/gallery" },
  { label: "Cộng đồng", href: "/community" },
  { label: "Về chúng tôi", href: "/about" },
] as const;

export const headerCta = { label: "Kết nối ngay", href: "/connect" } as const;

export const hero = {
  lead: "Dành cho",
  left: "Creative",
  right: "Viet Nam",
  subtitleLeft: "Từ những bản phác thảo đầu tiên đến các dự án thực chiến",
  subtitleRight:
    "hệ sinh thái dành cho các Designer, Artist, và những người làm sáng tạo",
  scrollHint: "Scroll to explore",
} as const;

/**
 * Hàng icon cuối Hero. Toạ độ theo canvas 1920 (Figma node 2727:1237…2727:1268).
 * Mọi SVG trong /assets/slider có viewBox 280 × 280; `size` là cạnh hiển thị.
 */
export const heroMarquee = [
  { id: "lotus-yellow", src: "/assets/slider/01-yellow.svg", size: 280, left: -102, top: 1309 },
  { id: "arches-blue", src: "/assets/slider/02-blue.svg", size: 280, left: 192, top: 1309 },
  { id: "star-yellow", src: "/assets/slider/03-yellow.svg", size: 244, left: 525, top: 1315 },
  { id: "arches-red", src: "/assets/slider/03-red.svg", size: 280, left: 1141, top: 1315 },
  { id: "xa-yellow", src: "/assets/slider/04-yellow.svg", size: 280, left: 1454, top: 1309 },
  { id: "star-blue", src: "/assets/slider/03-blue.svg", size: 243, left: 1771, top: 1334 },
] as const;

export const breakSection = {
  line1: "Where Creativity",
  line2: "meets",
  line3: "culture",
  labelTop: "Curated Showcase",
  labelBottom: "Creative Matchmaking",
  caption: "Không gian lưu trữ, kết nối và nâng tầm thế hệ Creatives trẻ.",
} as const;
