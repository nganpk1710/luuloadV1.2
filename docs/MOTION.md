# Lưu Load V2 — Motion & Micro-interaction Spec (v0.4)

> Đọc kèm `docs/IMPLEMENTATION.md`. File này mô tả **hành vi** từng chuyển động, đủ để AI agent dựng mà không phải đoán.
> Nguồn: 6 video tham chiếu chủ dự án gửi (26.11.2026), 3 component Framer Marketplace, ảnh trạng thái card (Default / Flip), ảnh tổng thể trang Community.
> **v0.2 (26.11.2026, sau review của chủ dự án):** CTA chỉ còn 2 biến thể trắng/đen; Projects dùng 4 thumbnail có sẵn, giữ bố cục hiện tại; Community card viền đỏ, làm trước card 01; thêm Page transition (mục 11), Cursor trail ở Hero (mục 12), trang `/community` (mục 13). Hashtag giữ nguyên v0.1.
> **v0.3 (26.11.2026, đã implement):** Page transition: vàng trái · đen viền trắng giữa · đỏ phải, tấm màu trơn. Cursor trail giữ trắng. Hero → Break dùng khung vòm. Nhóm 04 là "Kiến trúc & Cảnh quan" (slug giữ theo Sitemap). Ảnh Community dùng khối màu. Hashtag: mặt sau pill đổi thành **nền ink chữ vàng** (trắng không thấy trên nền section trắng). Projects bỏ snap (xung đột Lenis).
> **v0.4 (26.11.2026, review lần 2):** Hero → Break morph và phóng **tại chỗ** (như acronym.lol), icon khác giữ nguyên, không di chuyển vòm. Header cố định 95px: cuộn xuống ẩn, cuộn lên hiện nền trắng (logo/menu ink, CTA ink chữ vàng). Projects: trụ **lõm vào trong** (nhìn từ trong trụ), 0.6 viewport mỗi ảnh. Hashtag: hover roll 2D như nút Slush, không lật 3D. Lưới nền Hero sáng hơn (screen 100%). Mũi tên Hero dùng ảnh gốc từ Figma.
> Thuật ngữ motion dùng theo glossary của Emil Kowalski (giữ tiếng Anh để tra cứu và prompt cho đúng).
> Giá trị thời gian/easing là **đề xuất** đo từ video (15–60 fps); chỉnh lại khi review trên trình duyệt thật.

---

## 0. Nguyên tắc chung

| Hạng mục | Quy ước |
|---|---|
| Thư viện | `motion` (Framer Motion) cho hover, press, spring, enter/exit. `gsap` + `ScrollTrigger` cho mọi hiệu ứng **scroll-driven** có pin. `lenis` cho smooth scroll toàn trang, đồng bộ với ScrollTrigger qua `lenis.on('scroll', ScrollTrigger.update)` và `gsap.ticker`. |
| Component Framer | Chỉ dùng làm **tham chiếu hành vi**, dựng lại bằng React trong `src/components/motion/*`. Không nhúng runtime Framer. |
| Thuộc tính được animate | Chỉ `transform` và `opacity` (cộng `clip-path` khi cần reveal). Không animate `width/height/top/left` (tránh **layout thrashing**). |
| Easing mặc định | UI phản hồi người dùng: **ease-out** `cubic-bezier(0.22, 1, 0.36, 1)`. Phần tử đã trên màn hình đi A→B: **ease-in-out** `cubic-bezier(0.65, 0, 0.35, 1)`. Scroll-driven: `ease: "none"` (scrub theo scroll). Marquee: **linear**. |
| Spring mặc định | `{ type: "spring", stiffness: 420, damping: 28, mass: 0.8 }` (snappy, bounce nhẹ). |
| Reduced motion | `prefers-reduced-motion: reduce` → tắt pin/scrub, marquee dừng, flip/roll thay bằng **crossfade** 150ms, nội dung ẩn sau hover hiển thị sẵn. |
| Thiết bị cảm ứng | Mọi hiệu ứng chỉ có ở hover phải có lối vào khác: `@media (hover: none)` → tap để toggle (USP, Community) hoặc hiển thị sẵn trạng thái hover. |
| Hiệu năng | `will-change: transform` chỉ bật trong lúc animate. Target 60 fps ở 1920; kiểm tra bằng Performance panel trước khi merge. |
| Interruptible | Mọi hover phải **interruptible**: rời chuột giữa chừng thì đảo chiều từ vị trí hiện tại, không chờ chạy xong. |

Cấu trúc đề xuất:

```
src/components/motion/
  RollText.tsx          // Menu item, footer wordmark (mục 1, 9)
  RollPill.tsx          // CTA button kiểu slush.app, dùng lại cho Hashtag (mục 2, 7)
  HeroToBreak.tsx       // Morph + zoom reveal (mục 3)
  ProjectsCylinder.tsx  // 3D vertical carousel pin (mục 4)
  RevealCard.tsx        // USP Tầm nhìn (mục 5)
  Marquee.tsx           // Hashtag (mục 6)
  FlipCard.tsx          // Community (mục 8)
  UnderlineLink.tsx     // Footer legal (mục 10)
  PageTransition.tsx    // TransitionProvider + overlay dải tấm màu (mục 11)
  CursorTrail.tsx       // Hero, Community hero (mục 12)
src/lib/motion.ts       // easing, spring, duration tokens + hook useReducedMotion
```

---

## 1. Menu item — Vertical roll text

**Tham chiếu:** Framer *Vertical Roll Text*: hover → từng chữ cái cuộn dọc theo kiểu slot machine, có **stagger** giữa các chữ.

**Thuật ngữ:** **Hover effect** + **Stagger** của **Translate** Y trong mask (gần với **Text morph**, nhưng chữ không đổi giá trị).

**Hành vi (áp cho `CÁC DỰ ÁN`, `CỘNG ĐỒNG`, `VỀ CHÚNG TÔI` ở Header):**
- Mỗi ký tự nằm trong một khung `overflow: hidden` cao đúng 1 dòng (line-height 20px theo Figma). Bên trong xếp **2 bản sao** của ký tự theo chiều dọc.
- Hover vào: mọi ký tự `translateY(0 → -100%)`, bản sao thứ hai trượt lên thay chỗ. Stagger **18ms/ký tự** từ trái sang phải. Mỗi ký tự **260ms**, ease-out.
- Rời chuột: đảo chiều (ký tự quay về), stagger đảo từ phải sang trái để tạo cảm giác "cuộn về".
- **Không loop liên tục** như bản Framer (bản gốc lặp khi còn hover); với nav chỉ chạy **một lần mỗi lần hover**, vì nav dùng nhiều (**frequency of use**).
- Khoảng trắng giữ nguyên chiều rộng (`white-space: pre`), không tách thành ô riêng.

**Accessibility:** thẻ `<a>` giữ `aria-label` bằng text gốc; các span ký tự `aria-hidden`. Focus bàn phím chạy cùng hiệu ứng như hover.

---

## 2. CTA button — Roll pill (theo slush.app)

**Tham chiếu:** video `2026-11-26_21-14-26` (nav slush.app/get-started).

**Quan sát từ video (15 fps):**
1. Frame 0: pill viền đen, nền trắng.
2. Frame +1 (~66ms): pill mặc định bị **ép dẹt và đẩy lên** phía trên (scaleY giảm, translateY âm); một pill **màu mới** trồi lên từ dưới, cũng đang dẹt.
3. Frame +2 (~133ms): pill màu đã thay chỗ, **hơi to hơn** kích thước gốc và chữ lệch nhẹ (overshoot).
4. Frame +3…+8: pill màu nhún nhẹ rồi đứng yên (**spring settle**).
5. Rời chuột: chạy ngược — pill màu bị ép xuống dưới, pill trắng rơi về từ trên. Có nhún nhẹ cuối.
6. Mỗi nút có **màu hover riêng** (Card → xanh, DeFi → cam, Security → xanh lá, Guides → tím, Download → xanh dương, Launch App → xanh dương).

**Thuật ngữ:** đây là **3D tilt / Flip** theo trục X kiểu "cuộn băng" (một mặt lăn đi, mặt kia lăn tới), cộng **Squash & stretch** và **Bounce** ở cuối. Gọi tắt trong code: **roll pill**.

**Dựng:**
- Nút là một khung `overflow: hidden; border-radius: 999px`, bên trong 2 lớp xếp dọc: `front` (trạng thái mặc định) và `back` (màu hover), cùng kích thước pill.
- Hover: `front` → `translateY(-100%) scaleY(0.6)`; `back` từ `translateY(100%) scaleY(0.6)` → `translateY(0) scaleY(1)`. Dùng spring `{ stiffness: 520, damping: 22 }` để có overshoot ~4%.
- Toàn bộ nút `scale(1 → 1.04)` khi hover, spring cùng tham số, để có cảm giác pill "phồng lên" như video.
- **Press feedback:** `:active` → `scale(0.96)`, 100ms.
- **Chỉ 2 biến thể** (chốt 26.11):

| Biến thể | Mặc định | Hover (`back`) | Dùng ở |
|---|---|---|---|
| `light` | nền white, chữ ink | **nền yellow, chữ ink** | Header, Last CTA |
| `dark` | nền ink, chữ white | **nền white, viền 2px ink, chữ ink** | Projects, USP, Community |

- Biến thể `dark` để sẵn `border: 2px solid` màu ink ở cả mặt trước để khi đổi sang mặt trắng không bị nhảy kích thước (viền trùng màu nền nên không thấy).
- Chữ trên pill **không** roll riêng (khác Menu item) để hai hiệu ứng không chồng nhau.
- Thay `PillLink` hiện tại bằng `RollPill` nhưng giữ nguyên API (`variant`, `href`, `className`) (không cần prop màu riêng).

---

## 3. Hero → Break Section — Morph + Scroll zoom reveal

**Tham chiếu:** Framer *Scroll Zoom Reveal* (ảnh/shape phóng to theo scroll, chữ mờ dần). Chủ dự án mô tả: shape rỗng ở giữa → morph thành khối vuông fill vàng → zoom ra.

**Thuật ngữ:** **Scroll-driven animation** có pin, gồm 2 pha: **Morph** rồi **Scale** (zoom) lấp đầy viewport, kết thúc bằng **Continuity transition** sang nền vàng của Break Section.

**Shape:** khung vòm viền vàng 20px ở giữa hàng icon cuối Hero (Figma `2727:1131`, 281 × 230.77, `left 820, top 1328`). Bên trong rỗng nên nhìn thấy nền ink (= "shape rỗng màu đen").

**Timeline (scrub theo scroll, pin Hero ở cuối section):**

| Tiến độ scroll | Diễn biến |
|---|---|
| 0 → 0.15 | Shape tách khỏi hàng icon: các icon còn lại **fade out** + trượt nhẹ ra hai bên (`x: ±80px`), shape dịch về tâm viewport. Chữ `SCROLL TO EXPLORE` và mũi tên mờ dần. |
| 0.15 → 0.45 | **Morph**: bo góc vòm (`border-radius` trên 999px, dưới 0) → hình vuông bo nhẹ 20px; lòng shape **fill vàng** từ 0 → 100% (dùng `clip-path: inset()` của một lớp vàng bên trong, không đổi `background` liên tục). Viền và fill hợp thành một khối vàng đặc. |
| 0.45 → 1.0 | **Scale** khối vàng từ kích thước shape lên phủ kín viewport (scale ≈ max(vw/281, vh/231) × 1.1). Transform origin ở tâm khối. Cuối pha, khối vàng trùng với nền vàng Break Section → bỏ pin, Break Section cuộn tiếp như bình thường. |
| 0.7 → 1.0 | Nội dung Break (3 dòng chữ, icon) **fade in + translateY(40 → 0)** với **stagger** 80ms/dòng, để chữ không xuất hiện trước khi nền vàng phủ xong. |

**Kỹ thuật:**
- Morph bo góc bằng `border-radius` trên một phần tử cố định kích thước, rồi zoom bằng `transform: scale()` (không đổi width/height). Hoặc dùng SVG `<path>` và tween thuộc tính `d` nếu cần morph chính xác hơn (GSAP MorphSVG là plugin trả phí, nên ưu tiên `clip-path: path()`/border-radius).
- Độ dài pin: **+150vh**.
- Reduced motion: không pin, Break Section hiện bình thường; shape giữ nguyên.

**Cần xác nhận:** shape dùng là khung vòm `2727:1131` (khung viền vàng đang có trong Hero). Nếu ý bạn là glyph khác, gửi node Figma.

---

## 4. Projects section — 3D vertical cylinder carousel

**Tham chiếu chính:** video `Feature_projects.mp4`. Tham chiếu phụ: Framer *Scroll 3D Slider* (chỉ mượn ý snap; **không** dùng Three.js).

**Chốt 26.11:** giữ **bố cục section hiện tại** (tiêu đề + subtitle + nút bên trái, `(01)` + tên + mô tả bên phải). Chỉ thay khung ảnh giữa bằng carousel 3D gồm **4 thumbnail** có sẵn trong repo. Không thêm tiêu đề/nhãn lên ảnh. Không thêm danh sách bước bên trái như video.

**Quan sát từ video:**
- Section được **pin**. Ảnh nằm trên một **hình trụ nằm ngang** (quay quanh trục X).
- Ảnh active ở giữa: phẳng, to nhất. Ảnh phía trên: hình thang **trên rộng – dưới hẹp**; ảnh phía dưới ngược lại. **Perspective** mạnh.
- Scroll xuống → trụ xoay, ảnh dưới lăn lên thành active.
- Tiêu đề bên phải đổi theo ảnh active, chữ mới hiện xám rồi đậm dần (**crossfade**), mô tả mờ vào sau.

**Thuật ngữ:** **Scroll-driven animation** + **Pin** + **3D tilt / Flip** (`rotateX`) trên **Perspective**, nội dung đổi bằng **Crossfade**, có **snap**.

**Dữ liệu (`src/content/sections.ts → projects.items`), nội dung đề xuất:**

| # | Ảnh | Tên (cột phải) | Mô tả (cột phải) |
|---|---|---|---|
| (01) | `images/features/project-feature-01.png` | BaoBao | Bộ nhận diện cho thương hiệu gốm ăn uống, lấy dáng chén bát quen thuộc làm hình khối chính. Mỗi bữa cơm là một khoảnh khắc đáng giữ lại. |
| (02) | `images/features/project-feature-02.png` | Nhịp bước | Minh họa nhân vật từ những sắc màu lễ hội đường phố. Đường nét bo tròn, màu phẳng, chuyển động vui như một buổi chợ phiên. |
| (03) | `images/features/project-feature-03.png` | Vietnam Culture Week 2025 | Hệ thống hình ảnh cho tuần lễ văn hóa: chữ ghép từ họa tiết cổ, đặt cạnh điêu khắc đá truyền thống. |
| (04) | `images/features/project-feature-04.png` | Kéo co | Bộ minh họa "Nghi lễ và Trò chơi" kể lại trò kéo co qua nét vẽ dân gian và màu tranh Đông Hồ. |

Tên và mô tả là **nội dung tạm** do Claude đặt, chỉnh trong file content khi có thông tin dự án thật.

**Dựng:**
- Khung giữa giữ vị trí Figma (`left 580`, rộng 760, cao 793.67). Mỗi ảnh hiển thị **760 × 475** (tỉ lệ gốc 736 × 460 ≈ 16:10), `border-radius: 0`, `object-fit: cover`.
- `perspective: 1400px`, `transform-style: preserve-3d`. Góc giữa 2 ảnh `θ = 38°`, bán kính `r ≈ 560px`. Ảnh i: `rotateX(-i·θ) translateZ(r)`.
- Scroll xoay cả trụ `rotateX: 0 → 3·θ`. Pin dài **4 × 100vh**. Snap `1/3`, 0.4s ease-in-out.
- Ảnh không active: `opacity 0.85`.
- Cột phải đổi khi `activeIndex` đổi: số thứ tự + tên **fade out, translateY(-12px)** → mới **fade in từ translateY(12px)**, 300ms ease-out, mô tả trễ 60ms. Cột trái giữ nguyên trong suốt thời gian pin.
- Ảnh gốc chỉ rộng 736px, hiển thị 760px sẽ hơi mềm. Nên có bản ≥1520px (2×) cho màn retina.

## 5. USP — Card Tầm nhìn: reveal khi hover

**Tham chiếu:** ảnh `Default_card.png` (chỉ có 2 vòng tròn xanh/vàng, nền `#E9E8F0`, không icon, không chữ).

**Thuật ngữ:** **Scroll reveal** cho lần đầu vào viewport, rồi **Hover effect** gồm **Scale in** + **Fade in** cho icon và chữ (có **stagger**).

**Hành vi:**
- **Enter (scroll tới):** 3 cột lần lượt **slide in** từ dưới (`y: 60 → 0`, opacity 0 → 1), stagger 120ms, 600ms ease-out. Vòng tròn trong mỗi cột **scale in** từ 0.85 → 1 trễ 100ms so với cột. Chỉ chạy một lần (`once: true`).
- **Default:** card Tầm nhìn chỉ có nền + họa tiết sọc + 2 vòng tròn (đúng ảnh Default).
- **Hover card:**
  - Vòng trong (vàng) `scale(1 → 1.04)`, spring.
  - Icon cọ: `opacity 0 → 1`, `scale(0.6 → 1)`, `rotate(-20° → 0)`, spring có **bounce** nhẹ (**Pop in**).
  - Chữ `CREATIVES`: **reveal** từ dưới lên trong mask (`translateY(100% → 0)`), trễ 60ms sau icon, 320ms ease-out.
  - Họa tiết sọc nền: **parallax** nhẹ theo vị trí chuột (±12px), tuỳ chọn.
- **Rời chuột:** đảo chiều, nhanh hơn (200ms), chữ đi trước icon.
- Thiết bị cảm ứng: tap để bật/tắt.
- Áp dụng trước cho card Tầm nhìn; Sứ mệnh và Giá trị cốt lõi dùng cùng component khi có icon + chữ.

---

## 6. Hashtag — Smooth slider (marquee)

**Tham chiếu:** video `2026-11-26_20-58-56` (dải "GET SLUSH" trên slush.app).

**Quan sát:** dải pill + vòng tròn logo chạy ngang liên tục, tốc độ đều, không giật khi lặp.

**Thuật ngữ:** **Marquee** (**Loop**, easing **linear**).

**Dựng:**
- 2 hàng pill của Figma thành **2 marquee chạy ngược chiều**: hàng trên sang trái, hàng dưới sang phải (giữ thế so le như Figma). Các pill ngoài canvas trong Figma (`2718:630`, `2718:634`) là phần lặp của dải.
- Nhân đôi nội dung, animate `translateX(0 → -50%)` vô hạn. Tốc độ ~80px/s (hàng 912px ≈ 11.4s/pill).
- **Scroll velocity:** cuộn trang nhanh thì marquee tăng tốc tạm thời (tối đa ×3) rồi trả về, đổi chiều theo hướng scroll (cảm giác "smooth" như ref). Dùng `useVelocity` của motion hoặc Lenis velocity.
- **Hover dải:** marquee **chậm lại** về 20% tốc độ (tween 400ms), không dừng hẳn.
- Reduced motion: dừng marquee, hiển thị tĩnh như Figma.

---

## 7. Hashtag — Hover từng pill (theo GET SLUSH)

**Quan sát từ video (2 fps, nhiều frame):**
- Pill được hover **đổi màu** (cam → trắng, xanh → trắng) và **nghiêng nhẹ** (`rotate` vài độ), có lúc bị **nghiêng 3D** như đang lật (frame thấy rõ pill trắng bị kéo xiên thành hình thang).
- Chữ trên pill vẫn đọc được trong suốt quá trình.
- Rời chuột: pill trở lại màu và góc ban đầu, có nhún nhẹ.

**Thuật ngữ:** **Hover effect** gồm **3D tilt / Flip** (`rotateX`) đổi màu giống **roll pill** ở mục 2, cộng **Rotate** nhẹ và **Bounce**.

**Dựng:** tái dùng `RollPill` với kích thước lớn (912 × 140, bo 20px):
- `back` là pill màu trắng, chữ ink (đồng bộ ref: mọi pill hover về trắng).
- Thêm `rotate: -3°` (pill hàng trên) / `+3°` (hàng dưới) khi hover, spring `{ stiffness: 300, damping: 14 }` để có wobble rõ hơn nút nhỏ.
- Pill đang hover được nâng `z-index` để góc nghiêng không bị pill bên cạnh che.

---

## 8. Community — Flip card + micro text pattern

**Tham chiếu:** video `2026-11-26_21-03-45` (therechabite.com.au, khu "Eat and Drink") và ảnh `Flip_card.png`.

**Quan sát từ video:**
- Hover card: ảnh nền biến mất, thay bằng **nền màu** phủ kín card với **chữ lớn lặp lại thành nhiều hàng** (tên địa điểm, ví dụ "HELLO ROOFTOP"), màu nhạt hơn nền một tông.
- Các hàng chữ **chạy ngang, hàng liền kề ngược chiều nhau**, chậm và đều.
- Ảnh gốc thu lại vào một **shape hình học** (tam giác, hình thoi) ở giữa, nằm trên lớp chữ.
- Rời chuột: trở về ảnh gốc.

**Ảnh `Flip_card.png` (mặt sau mong muốn):** viền vàng 20px, nền ink, chữ `NGHE THUAT & CHE TAC` xám đậm (~#333) uppercase Smooch Sans ExtraBold xếp 5 hàng lặp, icon con mắt (nửa trên xanh dương, nửa dưới vàng, tròng ink) ở giữa.

**Thuật ngữ:** **3D tilt / Flip** (`rotateY 180°`) có **Perspective**, mặt sau có **Marquee** nhiều hàng chạy so le (micro text pattern) và icon **Pop in**.

**Dựng:**
- Card 442 × 525: khung `perspective: 1200px`; bên trong `inner` có `transform-style: preserve-3d`, 2 mặt `front` / `back` với `backface-visibility: hidden`, `back` sẵn `rotateY(180deg)`.
- Hover: `inner rotateY(0 → 180°)`, 700ms ease-in-out `cubic-bezier(0.65, 0, 0.35, 1)`. Thêm `scale 1 → 0.96 → 1` giữa chừng để lật có trọng lượng (**anticipation** nhẹ).
- **Mặt trước:** như hiện tại (số thứ tự + tên).
- **Mặt sau:**
  - Viền cùng màu với mặt trước của card đó (đỏ / vàng / xanh / amber), nền ink.
  - Pattern: tên card **viết không dấu, uppercase**, cỡ ~96px, màu `white/18%` (gần #333 trên nền ink), 5 hàng. Hàng chẵn chạy sang trái, hàng lẻ sang phải, ~30px/s, linear, chỉ chạy khi card đang lật.
  - Icon ở giữa: **pop in** (`scale 0.6 → 1`, spring bounce) trễ 250ms sau khi lật qua 90°.
- Rời chuột: lật về `0°`, pattern dừng sau khi mặt trước đã hiện.
- Bàn phím / cảm ứng: card là `button` có `aria-pressed`, focus/tap để lật.

**Chốt 26.11:** card `(01) Nghệ thuật & chế tác` dùng **viền đỏ** ở cả 2 mặt. **Làm card này trước**; 3 card còn lại giữ tĩnh cho tới khi có icon riêng.

**Asset:** icon con mắt chưa có file SVG. Claude vẽ lại theo ảnh mẫu (`assets/community/eye.svg`: nửa trên blue, nửa dưới yellow, tròng ink), chủ dự án thay bằng file gốc nếu có.

---

## 9. Footer — Wordmark rolling khi vào viewport

**Thuật ngữ:** **Scroll reveal** dạng **Stagger** của **Translate** Y trong mask, cùng cơ chế mục 1 (roll text), chạy một lần. Cảm giác loading → gần với **Perceived performance**.

**Hành vi:**
- Wordmark `LƯU LOAD` (SVG 1856 × 300, 11 path) được tách thành **8 nhóm ký tự** (L, Ư, U, L, O, A, D + dấu móc), mỗi nhóm trong một mask riêng cao 300px.
- Khi footer vào viewport 30% (`IntersectionObserver` hoặc ScrollTrigger `start: "top 70%"`): mỗi nhóm **roll** từ `translateY(100%)` → `0`, có thể qua một vòng trung gian (bản sao thứ hai) để ra cảm giác slot-machine.
- Tổng thời gian **0.5s**: mỗi nhóm 320ms ease-out, stagger 25ms (8 nhóm → 320 + 7×25 ≈ 495ms).
- Chạy **một lần mỗi lần tải trang**.
- Reduced motion: hiện ngay, không roll.

---

## 10. Footer — Legal links: underline hover

**Áp dụng cho:** `Privacy Policy`, `Term Of Use`, `Cookie Policy`.

**Thuật ngữ:** **Hover effect** dạng **Reveal** gạch chân bằng **Scale** X với **Transform origin** đổi theo hướng (**Direction-aware transition**).

**Hành vi:**
- Gạch chân 1px màu white, cách baseline 3px, dựng bằng `::after` (`transform: scaleX(0)`).
- Hover vào: `scaleX(0 → 1)` với `transform-origin: left`, 240ms ease-out.
- Rời chuột: `transform-origin: right`, `scaleX(1 → 0)`, 200ms → gạch "chạy tiếp" sang phải rồi biến mất, không thu về chỗ cũ.
- Focus bàn phím hiện gạch chân ngay (không cần hover).
- Có thể dùng chung cho các link cột `EXPLORE` của footer nếu muốn đồng bộ (chưa yêu cầu).

---

## 11. Page transition — Shape transform (theo slush.app)

**Tham chiếu:** video `2026-11-26_21-35-27` (slush.app: từ Download sang User Guides).

**Quan sát từ video (10 fps):**
1. Bấm link nav → trang hiện tại **thu nhỏ** thành một tấm card giữa màn hình (~1/3 bề rộng), nền phía sau chuyển đen.
2. Hai bên card xuất hiện các **tấm màu phẳng** (vàng, xanh, tím) xếp thành một dải ngang, các tấm ở rìa **nghiêng 3D** như nằm trên mặt trong của một hình trụ đứng (hình thang mở rộng ra mép màn hình).
3. Cả dải **trượt ngang** sang trái; tấm của trang mới (trắng, trống) trượt vào giữa. Khoảng 600–700ms.
4. Tấm mới **phóng to** phủ kín viewport (~300ms), nav giữ nguyên trên cùng suốt quá trình.
5. Nội dung trang mới hiện theo thứ tự: tiêu đề **reveal** từ trái sang phải (chữ xám → đen như bị quét mask), rồi icon **pop in**, rồi nút **fade in** lần lượt (**stagger**).

**Thuật ngữ:** **Page transition** gồm **Scale** (out) → **Translate** trên **Perspective** (dải tấm 3D, gần **Carousel/Coverflow**) → **Scale** (in) theo kiểu **Shared element transition**, kết thúc bằng **Stagger** các **Reveal / Pop in**. Toàn bộ là một **Orchestration**.

**Áp dụng cho Lưu Load:**
- Tấm màu dùng palette: yellow, red, blue, amber, sky; trên mỗi tấm đặt **một shape thương hiệu** (icon trong `assets/slider/*`) màu ink, cỡ ~40% tấm, để "shape transform" mang dấu Lưu Load thay vì tấm trơn.
- Thứ tự tấm cố định theo route để có **direction-aware**: đi sang route đứng sau trong nav (Home → Các dự án → Cộng đồng → Về chúng tôi) thì dải trượt sang trái, đi lùi thì trượt sang phải.
- Thời lượng: thu nhỏ 350ms (ease-in-out) → trượt 600ms (ease-in-out) → phóng to 350ms (ease-out). Tổng ≈ 1.3s, nội dung mới bắt đầu stagger từ 1.1s.
- Header (logo + nav) **không** tham gia transition, luôn nằm trên cùng.

**Kỹ thuật (Next.js 16 App Router):**
- `TransitionProvider` (client) bọc layout, chặn click vào `<Link>` nội bộ: chụp trang hiện tại thành lớp `fixed` (dùng chính DOM hiện tại, không screenshot), chạy pha out, gọi `router.push`, khi trang mới mount thì chạy pha in.
- Trước khi viết, đọc `node_modules/next/dist/docs/` mục View Transitions: nếu bản 16.4 hỗ trợ ổn định `viewTransition` thì dùng cho pha scale, còn dải tấm màu vẫn là overlay riêng.
- Back/forward của trình duyệt: chạy bản rút gọn (chỉ crossfade 250ms) để không chặn điều hướng.
- Reduced motion: crossfade 200ms, không có dải tấm.

---

## 12. Hero — Cursor trail icon (theo acronym.lol/process)

**Tham chiếu:** video `2026-11-26_21-33-27` (acronym.lol/process, khối "PROCESS" nền vàng).

**Quan sát:**
- Di chuột trong khối → một **vệt icon nhỏ** sinh ra dọc theo đường đi của chuột, cách đều nhau.
- Icon lặp theo một chuỗi cố định (mặt trời, tam giác, chữ…), cùng màu (xanh đậm trên nền vàng), cỡ nhỏ (~20–24px ở màn 1920).
- Icon cũ **mờ dần và thu nhỏ** rồi biến mất sau khoảng nửa giây; đứng yên chuột thì vệt tự tan hết.
- Có hiện tượng icon xuất hiện hơi nhấp nháy (**stepped**), không trượt mượt theo chuột: mỗi icon đứng yên tại chỗ nó được sinh ra.

**Thuật ngữ:** cursor trail = chuỗi **Enter / Exit** sinh theo vị trí chuột: mỗi icon **Pop in** rồi **Fade out + Scale** về 0. Không có thuật ngữ riêng trong glossary; gần nhất là **Stagger** theo không gian thay vì thời gian.

**Áp dụng cho Lưu Load:**
- Phạm vi: **chỉ trong Hero** (1920 × 1680). Ra khỏi Hero thì dừng sinh icon.
- Icon: 8 file `assets/cursor-trail/icon-*.svg` (viewBox 48, fill trắng). Sinh lần lượt theo thứ tự file, hết thì lặp lại.
- Màu: đổi fill sang **yellow** (`#F9EE16`) cho đồng bộ tiêu đề Hero trên nền ink. Phương án khác: xoay vòng palette (yellow, red, blue, sky, amber) mỗi icon.
- Cỡ hiển thị **32px**. Sinh 1 icon mỗi khi chuột đi được **≥ 56px** (tính theo khoảng cách, không theo thời gian, để chuột chậm không dồn icon).
- Mỗi icon: `scale 0.4 → 1` trong 120ms (ease-out), giữ 280ms, rồi `opacity 1 → 0`, `scale 1 → 0.6` trong 300ms. Tối đa 16 icon cùng lúc (pool tái sử dụng phần tử, không tạo DOM mới liên tục).
- Icon xoay ngẫu nhiên nhẹ ±12° để vệt bớt cứng.
- Không sinh khi chuột đang ở trên nút/link (nav, CTA) để không che chữ.
- Tắt trên thiết bị cảm ứng (`hover: none`) và khi reduced motion.
- Dựng bằng `requestAnimationFrame` + `transform` trên lớp `pointer-events: none`, không dùng state React cho từng icon.

---

## 13. Trang `/community` — Tổng quan bốn nhóm

**Nguồn:** ảnh `Overall_Community.png` (nội dung, thứ tự section). **Hình thức** theo hệ thống thương hiệu trong `docs/IMPLEMENTATION.md` mục 2 (màu palette, Smooch Sans cho display, SVN-Gilroy cho body, grid 12 cột 1920), không theo font serif/màu be của ảnh mẫu. Dựng ở 1920 trước, giống trang chủ.

**Cấu trúc (từ trên xuống):**

| # | Section | Nội dung (theo ảnh) | Hình thức Lưu Load | Motion |
|---|---|---|---|---|
| 0 | Header | Dùng chung Header trang chủ, mục "Cộng đồng" ở trạng thái active (gạch chân đỏ như ảnh). | Như trang chủ. | Roll text (mục 1). |
| 1 | Hero | Eyebrow `LƯU LOAD COMMUNITY`, tiêu đề "Make it together.", câu phụ "A gathering place for the works, questions, and people of a more creative Việt Nam." Xung quanh là **6 ảnh dọc nghiêng** (−8° đến +10°) rải tự do. | Nền **yellow**, tiêu đề Smooch Sans ExtraBold ink cỡ ~240px uppercase, eyebrow + câu phụ Gilroy 24px. Ảnh có viền trắng 12px như ảnh in. | Ảnh **float** nhẹ (±8px, 6s, alternate) và **parallax** theo scroll (mỗi ảnh tốc độ khác). Vào trang: ảnh **pop in** stagger 80ms, tiêu đề reveal từ dưới lên trong mask. Cursor trail (mục 12) có thể bật lại ở đây. |
| 2 | Intro | Eyebrow nhỏ + tiêu đề 2 dòng "Build a practice / with room to grow." | Nền white, tiêu đề Smooch Sans 120px, cột trái 5/12. | Scroll reveal: từng dòng trượt lên trong mask, stagger 100ms. |
| 3 | Danh sách 4 nhóm | 4 hàng: số `01`–`04` cỡ lớn bên trái, tên nhóm + mô tả ngắn + link "Explore the stories" ở giữa, mũi tên → bên phải. Các hàng ngăn bằng đường kẻ mảnh. Hàng 02 trong ảnh có thumbnail. | Số và tên nhóm Smooch Sans, mô tả Gilroy. Mỗi hàng mang màu nhóm như trang chủ: 01 red, 02 yellow, 03 blue, 04 amber (dùng cho số và nền hover). Đường kẻ 1px ink/15%. Link tới `/community/:nhom`. | Hover hàng: nền hàng **fill màu nhóm từ dưới lên** (`scaleY` của lớp nền, 350ms ease-out), **thumbnail của nhóm reveal** (clip-path mở từ giữa) cạnh tên, mũi tên **translateX(+12px)** và xoay −45°. Đúng như hàng 02 trong ảnh là trạng thái hover. |
| 4 | Banner | Ảnh full-width (tay dệt thổ cẩm), câu lớn ở giữa "We shape space into purpose." | Ảnh cao ~900px, phủ lớp ink 30% để chữ đọc được, chữ Smooch Sans 160px yellow. | **Scroll-driven**: ảnh `scale 1.15 → 1` khi cuộn qua (parallax zoom), chữ reveal từng dòng. |
| 5 | Footer | Dùng chung Footer trang chủ. | Như trang chủ. | Wordmark roll + underline links (mục 9, 10). |

**Bốn nhóm (copy theo ảnh, slug theo Sitemap):**

| # | Tên | Mô tả | Slug |
|---|---|---|---|
| 01 | Nghệ thuật & Chế tác | Art, craft, materials, and the pleasure of making. | `nghe-thuat-che-tac` |
| 02 | Đời sống & Phong vị | Everyday rituals, food, fashion, and the details that make a place feel lived in. | `doi-song-phong-vi` |
| 03 | Dòng chảy & Cõi thiêng | Stories, beliefs, music, and the living currents that connect us. | `dong-chay-coi-thieng` |
| 04 | Dấu ấn Không gian | Architecture, landscape, and the spaces that hold memory. | `di-san-kien-truc-canh-quan` |

**Điểm lệch cần chốt:**
- Nhóm 04: ảnh ghi "Dấu ấn Không gian", trang chủ ghi "Kiến trúc & cảnh quan", Sitemap ghi slug `di-san-kien-truc-canh-quan`.
- Ngôn ngữ: ảnh dùng tiếng Anh cho tiêu đề và mô tả; Brand Copywriting Guideline đề xuất tiêu đề `/community` là "Chọn một nhóm để bắt đầu". Spec đang giữ đúng copy của ảnh.
- Ảnh: cần 6 ảnh cho Hero, 4 thumbnail nhóm, 1 ảnh banner, độ phân giải ≥ 2× khung hiển thị. Trong lúc chờ, dùng khối màu palette làm placeholder.

---

## 14. Thứ tự triển khai đề xuất

| Bước | Hạng mục | Lý do |
|---|---|---|
| 1 | `src/lib/motion.ts`, Lenis + ScrollTrigger setup, reduced-motion hook | Nền tảng cho mọi mục sau |
| 2 | RollText (1, 9), UnderlineLink (10), RollPill 2 biến thể (2) | Nhỏ, dùng lại nhiều nơi |
| 3 | Cursor trail (12), Marquee + pill hover (6, 7), USP reveal (5), FlipCard card 01 (8) | Độc lập từng section |
| 4 | ProjectsCylinder với 4 thumbnail (4) | Đã đủ asset |
| 5 | HeroToBreak (3) | Pin + morph, cần chỉnh nhiều trên trình duyệt |
| 6 | Trang `/community` tĩnh (13), rồi motion của trang | Cần chốt copy và ảnh |
| 7 | Page transition (11) | Cần ít nhất 2 trang thật để kiểm tra |

## 15. Câu hỏi mở

1. Mục 3: shape giữa Hero có đúng là khung vòm viền vàng `2727:1131` không?
2. Mục 12: icon cursor trail màu yellow cố định, hay xoay vòng palette?
3. Mục 13: tên nhóm 04, ngôn ngữ copy (Anh như ảnh hay Việt), và nguồn ảnh cho trang Community.
