# LƯU LOAD V2 — Implementation Guide

Phiên bản 0.2 · 26.11.2026 · Ra mắt **28.12.2026**
Thay đổi so với 0.1: bảng màu mới (6 màu), font sẽ được đưa lên GitHub, grid giữ như đề xuất, không dark mode, chốt Git LFS và tên repo.
Đối tượng đọc: **AI agent (vibe-code)** và dev. Viết theo kiểu quy tắc: đọc là làm được.

Quy ước đánh dấu:
- **[chờ chốt]**: đề xuất, cần chủ dự án duyệt trước khi coi là chuẩn.
- **[ước lượng]**: giá trị đo từ ảnh Figma, không phải token gốc. Thay bằng giá trị chính xác khi có.
- **[Figma]**: lấy trực tiếp từ file Figma.

---

## 0. Nguồn sự thật (đọc theo thứ tự ưu tiên)

1. **Figma** `LuuLoad_V1.2`: https://www.figma.com/design/I71sGioA9j1HHrIwpe2e5V/ALL-IN?node-id=2727-1314 (visual, màu, font, layout).
2. **File này** (quy tắc kỹ thuật và token đã chuẩn hóa).
3. Tài liệu trong Project "LƯU LOAD": Sitemap v2 và quyết định đã duyệt, Brand Copywriting Guideline (chỉ lấy **copy, voice, route**), About Brand.pdf.

> **Xung đột đã chốt:** Brand Copywriting Guideline mô tả bảng màu "Kem Vỉa Hè / Đen Than / Xanh Sương". **Bảng màu ở mục 2.1 là chuẩn** (đen than, vàng, đỏ, xanh dương, xanh lơ, cam vàng). Bỏ qua phần màu trong Copywriting Guideline, và cập nhật lại tên màu ở đó cho khớp mục 2.1.

Khi Figma và file này mâu thuẫn: về **layout, kích thước, nội dung** thì Figma thắng; về **màu** thì file này thắng (mục 2.1). Luôn báo lại chỗ lệch để cập nhật.

---

## 1. Overview

### 1.1 Dự án
Lưu Load là cộng đồng sáng tạo chuyên về **chất liệu văn hóa Việt Nam**. Tiến hóa từ đồ án tốt nghiệp (Hoa Sen University) thành sản phẩm thật, ra mắt **28.12.2026**, phục vụ Creatives và doanh nghiệp, đồng thời thi đấu trên các nền tảng thiết kế quốc tế (Awwwards-grade).

- Tagline: **Một nơi để lưu – Nạp lại.**
- Hero hiện tại: "DÀNH CHO CREATIVE [icon] VIET NAM", subtitle "Từ những bản phác thảo đầu tiên đến các dự án thực chiến / hệ sinh thái dành cho các Designer, Artist, và những người làm sáng tạo".
- Break section: "WHERE CREATIVITY MEETS CULTURE", nhãn "CURATED SHOWCASE", "CREATIVE MATCHMAKING".

### 1.2 Mục tiêu sản phẩm
- Khám phá chất liệu văn hóa (Gallery, Project Detail).
- Cộng đồng theo 4 nhóm chất liệu (Community).
- Kết nối cơ hội nghề nghiệp (Connect: Creatives gửi project, doanh nghiệp gửi brief).

**Bốn nhóm chất liệu** (slug dùng trong route và database):
| Nhóm | Slug |
|---|---|
| Nghệ thuật & Chế tác | `nghe-thuat-che-tac` |
| Đời sống & Phong vị | `doi-song-phong-vi` |
| Dòng chảy & Cõi thiêng | `dong-chay-coi-thieng` |
| Di sản kiến trúc & Cảnh quan | `di-san-kien-truc-canh-quan` |

### 1.3 Người dùng
- **Creatives** 0–3 năm kinh nghiệm: freelancer, junior/mid, sinh viên thiết kế (18–50 tuổi).
- **Doanh nghiệp / Client**: studio, agency nhỏ (0–50 người), local brand, startup.

### 1.4 Quyết định sản phẩm đã duyệt (không tự đổi)
- Xem tự do: Gallery, Community, About, Legal. **Chỉ cần tài khoản khi tương tác trong Community** (like, share, đăng bài, comment, lưu, follow).
- Sign in / Sign up là **trang riêng**.
- Responsive **4 breakpoint: 1920, 1440, 768, 390 px**.
- **Message cắt khỏi bản 28/12.** Chỉ giữ link mạng xã hội ở nút "Kết nối ngay".
- Trang Legal: dựng cấu trúc và nội dung nháp, cần luật sư duyệt trước khi đăng. Tuổi tối thiểu 16 là đề xuất, chờ luật sư.
- Project Detail: chủ dự án tự dựng demo.

### 1.5 Sitemap v2 và route
```
/                         Homepage
/gallery                  Tất cả Projects (lọc, tìm kiếm)
/gallery/[slug]           Project Detail
/community                Tổng quan 4 nhóm
/community/[group]        Feed nhóm (slug ở 1.2)
/community/[group]/[post] Post Detail
/profile/[username]       Creative Profile (xem)
/me                       Profile của mình: chỉnh sửa, Đã lưu, Cài đặt
/about                    About
/connect                  Chọn lối vào
/connect/creatives        Form gửi project
/connect/clients          Form gửi brief
/sign-in  /sign-up  /forgot-password  /otp
/legal/terms  /legal/privacy  /legal/community-guidelines
/legal/copyright  /legal/cookies  /legal/data-rights
```
Menu chính (Figma): **CÁC DỰ ÁN · CỘNG ĐỒNG · VỀ CHÚNG TÔI** + CTA **KẾT NỐI NGAY**.

---

## 2. Brand guideline

### 2.1 Color

**Đã chốt (26.11.2026).** Sáu màu brand dưới đây **thay thế** mọi hex đo từ Figma V1.2 (`#000000`, `#FFEF00`, `#FFF11C`, `#0800B2`, `#BA2016`). Nếu Figma còn hiển thị màu cũ, **theo bảng này**, không theo Figma. Tailwind v4 token khai báo ở mục 5.3.

| Token | Hex | Dùng cho |
|---|---|---|
| `--color-ink` | `#0F1010` | Đen than: nền Hero, chữ trên nền vàng, text CTA |
| `--color-yellow` | `#F9EE16` | Vàng chủ đạo: chữ display trên nền ink, nền Break Section, icon vàng |
| `--color-red` | `#BA2025` | Hình khối/icon đỏ |
| `--color-blue` | `#1964B0` | Hình khối/icon xanh dương |
| `--color-sky` | `#4FC8EC` | Xanh lơ: hình khối/icon, điểm nhấn |
| `--color-amber` | `#FEBA17` | Cam vàng: hình khối/icon, điểm nhấn |

Màu phụ trợ (không thuộc 6 màu brand, **[chờ chốt]** có giữ không):

| Token | Hex | Dùng cho |
|---|---|---|
| `--color-white` | `#FFFFFF` | Chữ menu, subtitle trên nền ink, nền CTA pill. Figma hiện dùng, danh sách màu mới không nhắc tới |
| `--color-grid-line` | `#FFFFFF` ở ~6–8% | Lưới ô vuông trên nền ink của Hero **[ước lượng]** |

Quy tắc:
- Hai "mặt phẳng" chính: **nền ink + chữ vàng** và **nền vàng + chữ ink**. Trắng chỉ cho text nhỏ và CTA.
- Đỏ, xanh dương, xanh lơ, cam vàng **chỉ dùng cho hình khối/icon và điểm nhấn nhỏ**, không dùng làm nền section hay màu chữ dài.
- `#F9EE16` (vàng) và `#FEBA17` (cam vàng) khá gần nhau về sắc độ: không đặt cạnh nhau ở diện tích lớn và không dùng chữ vàng trên nền cam vàng.
- Không dùng gradient. Không thêm màu ngoài bảng này khi chưa được duyệt.
- Cần ≥ 4.5:1 cho text thường. Ink/vàng và vàng/ink đạt. Mọi tổ hợp chữ khác (đặc biệt chữ trên nền xanh lơ, cam vàng, đỏ, xanh dương) **phải đo lại** trước khi dùng. Kiểm tra cả text đặt trên ảnh.
- **Không có dark mode.** Chỉ một theme, không dựng chế độ Light/Dark. Không dùng `prefers-color-scheme` để đổi màu.
- **[chờ chốt]** vai trò cụ thể của xanh lơ và cam vàng (chưa thấy trong Figma V1.2). Cho tới khi có, chỉ dùng cho icon/hình khối.

### 2.2 Typography

> **Font sẽ được chủ dự án đưa lên GitHub** (`public/assets/fonts/`). **Dùng đúng file font có trong repo**, không tải font khác và không đoán. Bảng dưới là tên font và weight đọc từ Figma V1.2, dùng để đối chiếu. Nếu file trong repo khác tên/weight so với bảng, theo repo rồi báo lại. Chừng nào font chưa có trong repo, dùng fallback hệ thống và **không commit font tạm**.

| Vai trò | Font (theo Figma) | Weight | Ghi chú |
|---|---|---|---|
| Display (tiêu đề lớn) | **Smooch Sans** | ExtraBold 800 | "CREATIVE", "VIET NAM", "WHERE CREATIVITY MEETS CULTURE" |
| Display phụ | **Smooch Sans** | Medium 500 | "DÀNH CHO" |
| UI / nav / CTA | **Smooch Sans** | Bold 700 | Menu, nút |
| Body / subtitle / label | **SVN-Gilroy** | Medium 500 | Subtitle, "CURATED SHOWCASE", đoạn mô tả |

Giá trị đo từ Figma (canvas 1920):

| Style | Size | Line-height | Ghi chú |
|---|---|---|---|
| Display XL (Hero "CREATIVE", "VIET NAM") | 240px | ≈ 0.53 (128px, theo Break Section) | Xem quy tắc text-box-trim; line-height 371–455px trong code Figma là artefact, bỏ qua |
| Display L ("DÀNH CHO") | 225px | ≈ 0.53 | Weight Medium |
| Break Display ("WHERE CREATIVITY"…) | 240px | 128px | ExtraBold, đen |
| Nav / CTA | 24px | 30px | Smooch Sans Bold, uppercase |
| Body / subtitle | 24px | normal | SVN-Gilroy Medium, uppercase |

Quy tắc:
- **Toàn bộ chữ UI và display là UPPERCASE** (dùng `text-transform: uppercase`, không gõ hoa thủ công trong data, để giữ copy gốc đúng dấu).
- Figma dùng `text-box-trim: trim-both` và `text-box-edge: cap alphabetic`. Dùng CSS `text-box: trim-both cap alphabetic` (có fallback bằng line-height cố định khi trình duyệt chưa hỗ trợ). Đừng copy line-height khổng lồ (379px, 455px) từ code Figma.
- Tiếng Việt có dấu chồng (ví dụ "DÀNH", "CHÚNG"): đặt `line-height` đủ để dấu không bị cắt, kiểm tra trên mọi breakpoint.
- **Fluid type**: dùng `clamp()` giữa các breakpoint. Mốc đề xuất **[chờ chốt]**:

| Token | 390 | 768 | 1440 | 1920 |
|---|---|---|---|---|
| `--text-display-xl` | 72px | 140px | 180px | 240px |
| `--text-display-l` | 68px | 132px | 170px | 225px |
| `--text-ui` | 18px | 20px | 22px | 24px |
| `--text-body` | 16px | 18px | 20px | 24px |

- **Cách nạp font:** self-host từ `public/assets/fonts/` bằng `next/font/local`, `display: swap`, chỉ nạp weight đã dùng. Ưu tiên `.woff2`. Khai báo `variable` để gán vào `--font-display` và `--font-body`.
- **Kiểm tra khi font về repo:** bộ glyph tiếng Việt đủ ở mọi weight đã dùng (dấu chồng như "Ầ", "Ữ", "Ệ"). Font có license riêng (SVN-Gilroy, © Radomir Tinkov: font thương mại, không commit vào repo public) cần kèm file `LICENSE` trong cùng thư mục, chủ dự án chịu trách nhiệm xác nhận license web.

### 2.3 Grid & spacing

Figma cho thấy: canvas **1920**, header container **1854** (lề ~33px), nội dung Hero **1856** (lề 32px), Header cao **80px**. Nền Hero có lưới ô vuông mảnh.

**Đã chốt: giữ nguyên bộ grid dưới đây** (đề xuất ban đầu, được duyệt):

| Breakpoint | Cột | Gutter | Margin | Container |
|---|---|---|---|---|
| 1920 | 12 | 24px | 32px | full-bleed, max-width 1920 |
| 1440 | 12 | 24px | 32px | full-bleed |
| 768 | 8 | 20px | 24px | full-bleed |
| 390 | 4 | 16px | 16px | full-bleed |

- Layout **full-bleed**: chữ display chạy sát lề, hình khối/ảnh có thể tràn cạnh (xem "image 62" 1920 × 1097 trong Hero).
- Spacing dùng thang 4: `4 8 12 16 24 32 48 64 96 128`.
- Header: 80px, logo trái (179 × 46), menu + CTA phải.
- CTA: nút pill (`border-radius: 999px`), cao 40px, padding 12 × 24, nền trắng, chữ đen.
- Hình khối: bo lớn kiểu pill (`999px`) kết hợp góc nhọn (ví dụ thanh đen bo `tl 80px, tr/br 999px`), khung chữ nhật viền đen **10px**.
- **Pixel-perfect:** khi dựng theo Figma, đo ở đúng 4 breakpoint, không dùng giá trị "gần đúng".

### 2.4 Graphic elements
- **Bộ icon hình khối** (tên layer trong Figma): `01_Yellow`, `01_Blue`, `01_Red`, `03_Yellow`, `03_Blue`, và hình chữ "XA" cách điệu trong tiêu đề. Chúng là hệ ký hiệu họa tiết văn hóa dạng hình học, dùng như "chữ" xen kẽ trong tiêu đề.
- **Marquee icon** ở cuối Hero (hàng 7–8 icon kích thước 244–281px).
- **Lưới ô vuông** nền Hero.
- **Ảnh** dùng với `mix-blend-multiply`, opacity ~10% làm texture trên nền vàng.
- Dùng tiết chế: hình khối kể chuyện, không che nội dung.

### 2.5 Voice (tóm tắt, chi tiết xem Brand Copywriting Guideline)
Playful · Open-minded · Connected. Xưng "mình – bạn" ở cộng đồng, "chúng tôi – quý đối tác" ở B2B. Từ vựng chuẩn: Creatives, Project, chất liệu văn hóa, Challenge theo mùa, Brief, Cộng đồng. Mọi microcopy lấy từ Guideline mục 5.4, **không tự bịa copy**.

---

## 3. Assets (lưu trên GitHub)

### 3.1 Repo
- Repo: https://github.com/nganpk1710/luuloadV1.2.git (hiện **trống**). Dùng cho V2. **Đã chốt: giữ tên repo `luuloadV1.2`**, không đổi.
- **Một repo duy nhất**, asset nằm trong `public/assets`, file nặng đi qua **Git LFS**.
- Nhánh: `main` (production, deploy Vercel) và `dev`. Làm việc qua nhánh `feat/*` và pull request.

### 3.2 Cấu trúc thư mục
```
public/
└─ assets/
   ├─ brand/        logo (svg), favicon, og-image
   ├─ icons/        01-yellow.svg, 01-blue.svg, 01-red.svg, 03-yellow.svg ...
   ├─ patterns/     grid, texture
   ├─ images/
   │  ├─ hero/
   │  ├─ gallery/       (ảnh project, đặt theo slug)
   │  └─ community/
   ├─ video/        mp4/webm
   ├─ 3d/           (glb nếu có)
   └─ fonts/        (chỉ font self-host, kèm file LICENSE)
```

### 3.3 Git LFS
`.gitattributes`:
```
*.mp4  filter=lfs diff=lfs merge=lfs -text
*.webm filter=lfs diff=lfs merge=lfs -text
*.mov  filter=lfs diff=lfs merge=lfs -text
*.glb  filter=lfs diff=lfs merge=lfs -text
*.gltf filter=lfs diff=lfs merge=lfs -text
*.psd  filter=lfs diff=lfs merge=lfs -text
*.woff2 -text
```
- GitHub chặn file **> 100MB**. Giữ repo tổng **dưới ~1GB** và băng thông LFS có hạn, nên **nén trước khi commit**.
- **Đã chốt: dùng Git LFS trên Vercel.** Bật **Project Settings → Git → Git LFS** trong dự án Vercel ngay khi kết nối repo, rồi deploy thử một file LFS để xác nhận build kéo được file thật (không phải file con trỏ vài trăm byte). Chỉ `git lfs track` đúng các đuôi file trong `.gitattributes`, không track ảnh/SVG nhẹ.

### 3.4 Quy tắc đặt tên và tối ưu
- Tên file: `kebab-case`, không dấu, không khoảng trắng, ví dụ `hero-bg-01.webp`.
- Ảnh: **WebP/AVIF**, tối đa 2560px cạnh dài, cung cấp bản `@2x` khi cần. Hiển thị bằng `next/image`.
- Icon/logo/hình khối: **SVG đã làm sạch** (SVGO), một file mỗi biến thể màu, hoặc một file dùng `currentColor`.
- Video: H.264 MP4 + WebM, có `poster`, tắt tiếng mặc định, không autoplay có tiếng.
- Mọi ảnh có `alt` ghi trong file dữ liệu, không để trống (trừ ảnh trang trí: `alt=""`).
- **Asset từ Figma:** URL do Figma MCP trả về **hết hạn sau 7 ngày**. Luôn `curl -L` về `public/assets/...` rồi tham chiếu đường dẫn nội bộ. **Không bao giờ** để URL `figma.com/api/mcp/asset/...` trong code.
- Ghi nguồn và license cho ảnh/hoa văn bên thứ ba trong `public/assets/CREDITS.md`.

---

## 4. Techstack

### 4.1 Lựa chọn đã duyệt
| Lớp | Công nghệ |
|---|---|
| Framework | **Next.js** (App Router), bản stable mới nhất, đọc docs đi kèm trong `node_modules/next/dist/docs/` trước khi viết code |
| Ngôn ngữ | **TypeScript** (strict) |
| Styling | **Tailwind CSS v4** (token trong `@theme`) |
| Component | **Code component Framer** đã port sang React thuần |
| Motion | **Framer Motion** (package `motion`, import từ `motion/react`) |
| Scroll-driven | **GSAP + ScrollTrigger** |
| Smooth scroll | **Lenis** |
| Backend / Auth / DB / Storage | **Supabase** |
| Deploy | **Vercel** |
| Node | 22 hoặc mới hơn |

Chưa duyệt, **đừng thêm** nếu chưa hỏi: shadcn/ui, Three.js/R3F/Spline.
Form, dialog, toast: tự dựng theo brand bằng Tailwind (có thể dùng primitive không style như Radix nếu cần a11y, **[chờ chốt]**).

### 4.2 Dùng component Framer trong Next.js
Mục tiêu: lấy lại **layout và hành vi** từ Framer, không phụ thuộc vào runtime Framer.

1. Component đặt trong `src/components/framer/`, mỗi component một thư mục (`Marquee/`, `Ticker/`...) kèm ghi chú nguồn.
2. Port code component Framer (TSX):
   - Bỏ `addPropertyControls` và `RenderTarget`. Biến property thành **props TypeScript** có giá trị mặc định.
   - Thay `import { motion } from "framer-motion"` bằng `from "motion/react"`.
   - Bỏ style inline phụ thuộc Framer, chuyển thành class Tailwind và token.
   - Thêm `"use client"` chỉ ở file thật sự cần tương tác. Giữ phần tĩnh ở Server Component.
   - Khi tham chiếu `window`/`document`, bọc trong `useEffect` để không lỗi SSR.
3. Mỗi component phải: có `className` truyền xuống, hỗ trợ `prefers-reduced-motion`, có kiểu props xuất ra.
4. Không copy nguyên code từ Framer export nếu có `@framer` runtime lớn. Chỉ lấy phần logic cần.
5. Thư viện sẵn trong repo: `components/ui/` (nút, input, card), `components/sections/` (Hero, Break…), `components/framer/` (component port).

### 4.3 Motion & scroll
- **Lenis** là nguồn duy nhất điều khiển scroll. Đồng bộ với ScrollTrigger:
```ts
// lib/scroll.ts (client)
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
export function initScroll() {
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}
```
- **Phân vai:** Framer Motion cho vào/ra, hover, layout, gesture ở cấp component. GSAP+ScrollTrigger cho pin, scrub, timeline dài theo scroll. Không để hai thư viện cùng animate một thuộc tính của cùng một phần tử.
- Chỉ animate `transform` và `opacity`. Tránh animate `width/height/top/left`, tránh blur nặng. Dùng `will-change` có chọn lọc.
- Luôn `ScrollTrigger.kill()` / `ctx.revert()` khi unmount (dùng `gsap.context` trong `useEffect`).
- Tôn trọng `prefers-reduced-motion`: tắt smooth scroll và animation lớn, giữ nội dung đọc được.
- Điện thoại 390px: giảm độ phức tạp, không pin dài, đo FPS trên thiết bị thật.

### 4.4 Cấu trúc code
```
src/
├─ app/                    routes (mục 1.5), layout.tsx, globals.css
│  ├─ (marketing)/         /, /about, /connect/*
│  ├─ (app)/               /gallery, /community, /profile, /me
│  ├─ (auth)/              /sign-in ...
│  └─ legal/
├─ components/
│  ├─ ui/  sections/  framer/  layout/ (Header, Footer)
├─ content/                nội dung tĩnh: copy.ts, groups.ts, legal/*.mdx
├─ lib/                    supabase/, scroll.ts, utils.ts
├─ styles/                 tokens.css (nếu tách khỏi globals)
└─ types/
```
- **Copy và dữ liệu tĩnh tách khỏi component** (`content/`) để chỉnh nội dung sau ra mắt mà không đụng JSX.
- Component nhỏ, một trách nhiệm, props rõ ràng. Không logic nghiệp vụ trong component hiển thị.
- Alias import: `@/*` → `src/*`.

### 4.5 Supabase
- **Auth:** email + mật khẩu, Google, Facebook, OTP qua email (khớp User Flow). Trang riêng cho từng bước. Ô đồng ý Điều khoản/Quyền riêng tư ở Sign up. Xác thực số điện thoại: chừa chỗ, chưa bật.
- **Quy tắc truy cập:** đọc công khai Gallery/Community/About/Legal. Ghi (like, comment, đăng bài, lưu, follow) **bắt buộc đăng nhập** và bảo vệ bằng **Row Level Security**. Khách bấm tương tác → hiện hộp "Đăng nhập để tham gia thảo luận."
- Bảng dự kiến **[chờ chốt]**: `profiles`, `projects`, `posts` (có `group` theo 4 slug), `comments`, `likes`, `saves`, `follows`, `client_briefs`, `project_submissions`.
- Ảnh người dùng tải lên → Supabase Storage (khác với asset brand trong repo). Giới hạn dung lượng, báo lỗi theo copy "Ảnh vượt quá dung lượng cho phép…".
- Khóa bí mật chỉ ở biến môi trường, **không commit**. `NEXT_PUBLIC_*` chỉ chứa khóa công khai (anon). Service role key chỉ dùng trên server.
- Hồ sơ tạm cho creator chưa có tài khoản (nhận lại sau) đã được chấp thuận ở mặc định Sitemap v2.

### 4.6 Vercel
- Kết nối repo GitHub, mỗi PR có Preview Deployment. `main` → Production.
- Biến môi trường qua `vercel env`. Không đặt khóa trong repo.
- Mục tiêu hiệu năng: **LCP < 2.5s** (4G, mobile), **CLS < 0.1**, **INP < 200ms**, Lighthouse Performance ≥ 90 trên Home. Hero nặng chữ + hình nên ưu tiên preload font và ảnh LCP.

---

## 5. Quy tắc triển khai cho AI agent

### 5.1 Luôn làm
1. Đọc Figma trước (`get_design_context` + `get_screenshot`), sau đó mới viết code. Output của Figma là **tham chiếu**, không phải code cuối cùng.
2. Dùng token trong `@theme`. **Không hardcode** hex, px font, spacing trong component.
3. Kiểm tra mọi section ở **1920 / 1440 / 768 / 390**.
4. Dùng HTML ngữ nghĩa (`header`, `nav`, `main`, `section`, `h1`…). Mỗi trang một `h1`.
5. Điều hướng và nút bàn phím được, focus rõ (viền vàng/đen theo nền), vùng chạm ≥ 44px trên mobile.
6. Tách copy ra `content/`. Lấy copy từ Brand Copywriting Guideline.
7. Commit nhỏ, thông điệp rõ (`feat(hero): ...`, `fix(grid): ...`).
8. Trước khi báo xong: chạy `typecheck`, `lint`, `build`, kiểm tra trực quan.

### 5.2 Không bao giờ
- Không dùng URL tạm của Figma trong code.
- Không thêm màu, font, thư viện ngoài danh sách ở 4.1 khi chưa hỏi.
- Không lấy bảng màu "Kem/Đen Than/Xanh Sương" (đã bị thay thế).
- Không commit `.env*`, khóa Supabase service role, file font thương mại chưa có license.
- Không animate thuộc tính gây layout shift. Không autoplay video có tiếng.
- Không làm tính năng Message cho bản 28/12.
- Không đổi quyết định ở mục 1.4. Nếu thấy mâu thuẫn, hỏi.

### 5.3 Tailwind v4 token (khởi điểm, đặt trong `globals.css`)
```css
@import "tailwindcss";

@theme {
  /* Color */
  --color-ink: #0f1010;
  --color-yellow: #f9ee16;
  --color-red: #ba2025;
  --color-blue: #1964b0;
  --color-sky: #4fc8ec;
  --color-amber: #feba17;
  --color-white: #ffffff;   /* phụ trợ [chờ chốt] */

  /* Font: tên thật lấy từ file trong public/assets/fonts */
  --font-display: "Smooch Sans", ui-sans-serif, system-ui, sans-serif;
  --font-body: "SVN-Gilroy", ui-sans-serif, system-ui, sans-serif;

  /* Breakpoint (mobile-first: base = 390) */
  --breakpoint-md: 768px;
  --breakpoint-xl: 1440px;
  --breakpoint-2xl: 1920px;

  /* Fluid type [chờ chốt] */
  --text-display-xl: clamp(72px, 12.5vw, 240px);
  --text-display-l:  clamp(68px, 11.7vw, 225px);
  --text-ui:         clamp(18px, 1.25vw, 24px);
  --text-body:       clamp(16px, 1.25vw, 24px);

  /* Layout */
  --grid-margin: 16px;       /* 390 */
  --grid-gutter: 16px;
}
@media (min-width: 768px)  { :root { --grid-margin: 24px; --grid-gutter: 20px; } }
@media (min-width: 1440px) { :root { --grid-margin: 32px; --grid-gutter: 24px; } }
```

### 5.4 Quy trình một trang
1. Lấy `nodeId` trang từ bảng 6.
2. Đọc Figma → liệt kê section, token, asset cần.
3. Tải asset về `public/assets/...` (mục 3).
4. Dựng section tĩnh đúng pixel ở 1920, rồi các breakpoint còn lại.
5. Thêm motion (4.3) sau khi layout đã đúng.
6. Kiểm tra: pixel diff với Figma, a11y, hiệu năng, `prefers-reduced-motion`.
7. PR kèm ảnh chụp 4 breakpoint.

### 5.5 Tiêu chí "xong" (Awwwards-grade)
- Khớp Figma ở 4 breakpoint, không lệch quá 1–2px.
- Chuyển động mượt 60fps trên máy trung bình, có phương án giảm chuyển động.
- Không lỗi console, không layout shift khi tải font.
- Đạt các mục tiêu ở 4.6 và WCAG 2.1 AA.
- Copy đúng Brand voice, đúng dấu tiếng Việt, không mất dấu khi uppercase.

---

## 6. Design sources (Figma)

File: `ALL-IN` (key `I71sGioA9j1HHrIwpe2e5V`). Frame gốc: `LuuLoad_V1.2` (1920 × 2530).

| Trang / section | Node ID | Trạng thái |
|---|---|---|
| Frame tổng `LuuLoad_V1.2` | `2727:1314` | Có |
| Hero | `2721:1000` | Có (đã đọc: Header `2727:1364`, Big Title `2727:1365`, Subtitle `2727:1366`, Under info `2727:1037`, icon marquee) |
| Break Section | `2718:383` | Có |
| Gallery | | Chưa dựng, **thêm sau** |
| Project Detail | | Chủ dự án tự dựng |
| Community (tổng quan, feed, post) | | Chưa dựng, **thêm sau** |
| About | | Chưa dựng, **thêm sau** |
| Connect (Creatives, Clients) | | Chưa dựng, **thêm sau** |
| Auth, Profile | | Chưa dựng, **thêm sau** |
| Legal | | Cấu trúc theo wireframe đợt 1, chưa có visual |
| Mobile 768 / 390 (Hero, Break Section) | | Chưa có. **Chờ lệnh mới của chủ dự án**, chưa thực hiện |

Wireframe cấu trúc (đợt 1, đã duyệt): https://claude.ai/artifact/8JxyDs3Ke7V4JGtbgCTqwn. Chỉ dùng để tham khảo **cấu trúc và luồng**, **không** theo màu/visual của nó.

---

## 7. Việc còn chờ chốt

- [ ] Đưa file font lên `public/assets/fonts/` (kèm LICENSE), sau đó kiểm tra glyph tiếng Việt và cập nhật tên font/weight trong mục 2.2.
- [ ] Vai trò của xanh lơ `#4FC8EC` và cam vàng `#FEBA17`. Có giữ màu trắng `#FFFFFF` không. Màu lưới Hero.
- [ ] Cập nhật Figma V1.2 sang 6 màu mới để Figma và file này không lệch nhau.
- [ ] Thang font fluid (mục 2.2).
- [ ] Bật Git LFS trong Vercel và deploy thử file LFS.
- [ ] **Thiết kế mobile 768/390 cho Hero và Break Section: chờ lệnh mới của chủ dự án.** Agent không tự dựng hay đoán layout mobile cho tới khi có lệnh.
- [ ] Danh sách bảng Supabase và chính sách RLS chi tiết.
- [ ] Thư viện primitive cho form/dialog (Radix hay tự dựng).
- [ ] Nội dung Legal do luật sư duyệt (pháp nhân, địa chỉ, email, tuổi, chuyển dữ liệu, quyền nội dung).
- [ ] Chốt bộ từ Mission (3 hay 4 từ) trong Brand Copywriting Guideline.


---

## Changelog v0.3

- Body font là **SVN-Gilroy Medium** (không phải Aeonik); file font thương mại, thêm thủ công vào `public/assets/fonts/gilroy/` (đã `.gitignore`).
- `public/assets/` đã sắp lại theo nhóm (brand, backgrounds, slider, break, ui, fonts); màu cũ trong Logo/SliderGraphics đã chuẩn hóa về palette.
- `Vision.svg` còn dùng màu ngoài palette, cần quyết định.
- Đã implement Hero + Break Section ở 1920px (lệch tối đa 1–2px so với Figma). Mobile 768/390 chờ lệnh mới.
- Lưới nền Hero: 2 lớp PNG tile theo chiều dọc (cao 1097.5px, lớp 2 bắt đầu y=1098), blend screen 50% trên nền đen 10%.

## Changelog v0.4

- Đã implement 6 section còn lại ở 1920px: Projects, USP, Hashtag, Community, Last CTA, Footer (`src/components/sections/*`, copy trong `src/content/sections.ts`). Tổng canvas 8357px khớp Figma.
- Font body dùng thêm SVN-Gilroy Regular (400) và Bold (700) ngoài Medium (500).
- `PillLink` có `variant`: `light` (nền trắng, header và Last CTA) và `dark` (nền ink, các section nền trắng).
- Figma các section này vẫn dùng màu cũ (#0800B2, #FFEF00, #BA1616, đen #000); code đã map về token mới (blue, yellow, red, ink).
- Hashtag: 2 pill ngoài canvas (trái) chưa dựng, dành cho marquee sau.
