# Lưu Load V2 — Motion & Micro-interaction Spec (v0.1)

> Đọc kèm `docs/IMPLEMENTATION.md`. File này mô tả **hành vi** từng chuyển động, đủ để AI agent dựng mà không phải đoán.
> Nguồn: 4 video tham chiếu chủ dự án gửi (26.11.2026), 3 component Framer Marketplace, 2 ảnh trạng thái card (Default / Flip).
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
- Màu hover theo palette Lưu Load, xoay vòng theo vị trí nút:

| Nút | Mặc định | Hover (`back`) |
|---|---|---|
| Header `KẾT NỐI NGAY` | nền white, chữ ink | nền yellow, chữ ink |
| `XEM TẤT CẢ` (Projects) | nền ink, chữ white | nền red, chữ white |
| `BUTTON` (USP) | nền ink, chữ white | nền blue, chữ white |
| `KẾT NỐI NGAY` (Community) | nền ink, chữ white | nền amber, chữ ink |
| `KẾT NỐI NGAY` (Last CTA) | nền white, chữ ink | nền yellow, chữ ink |

- Chữ trên pill **không** roll riêng (khác Menu item) để hai hiệu ứng không chồng nhau.
- Thay `PillLink` hiện tại bằng `RollPill` nhưng giữ nguyên API (`variant`, `href`, `className`) + thêm prop `hoverTone`.

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

**Tham chiếu chính:** video `Feature_projects.mp4`. Tham chiếu phụ: Framer *Scroll 3D Slider* (preset carousel/coverflow, chạy Three.js; chỉ mượn ý snap và counter, **không** dùng Three.js).

**Quan sát từ video:**
- Section được **pin**. Một cột ảnh dự án nằm trên một **hình trụ nằm ngang** (quay quanh trục X).
- Ảnh đang active ở giữa: phẳng, to nhất.
- Ảnh phía trên: nghiêng ra sau, nhìn như hình thang **trên rộng – dưới hẹp**; ảnh phía dưới ngược lại (**trên hẹp – dưới rộng**). Có **perspective** mạnh.
- Scroll xuống → toàn bộ hình trụ xoay, ảnh dưới lăn lên thành active, ảnh active lăn lên trên và nghiêng đi.
- Cột phải: số thứ tự `001/002/003/004` + tiêu đề (`DISCOVER → PROTOTYPE → LOCK IN → PERFECT IT`) + đoạn mô tả, đổi theo ảnh active. Tiêu đề mới hiện màu xám nhạt rồi đậm dần (**crossfade**), đoạn mô tả mờ vào.
- Cột trái: danh sách 4 bước, bước active đậm, các bước khác xám.

**Thuật ngữ:** **Scroll-driven animation** + **Pin** + **3D tilt / Flip** (`rotateX`) trên **Perspective**, chuyển nội dung bằng **Crossfade**; tuỳ chọn **snap** vào từng ảnh.

**Dựng:**
- Khung ảnh 760 × ~460 mỗi ảnh (theo Figma, cột giữa rộng 760). `perspective: 1400px` trên khung chứa, `transform-style: preserve-3d`.
- Đặt N ảnh trên trụ: góc mỗi ảnh `θ = 360/N` (hoặc cố định 38° khi chỉ có 4–6 ảnh, để trụ không khép kín), bán kính `r ≈ 520px`. Mỗi ảnh: `rotateX(-i·θ) translateZ(r)`.
- Scroll điều khiển `rotateX` của cả trụ: `0 → (N-1)·θ`. Pin dài `N × 100vh`.
- Ảnh không active: `opacity 0.9`, có thể thêm `filter: brightness(0.85)`; ảnh active `1`.
- Snap: `ScrollTrigger snap: 1/(N-1)`, duration 0.4, ease-in-out.
- Cột phải và trái đổi nội dung khi `activeIndex` đổi: tiêu đề cũ **fade out + translateY(-12px)**, tiêu đề mới **fade in từ translateY(12px)**, 300ms ease-out, mô tả trễ 60ms.
- Nút `XEM TẤT CẢ` giữ cố định ở cột trái suốt thời gian pin.

**Thiếu nội dung (cần chủ dự án gửi):**
- Ảnh từng dự án riêng lẻ (hiện chỉ có 1 ảnh chụp ghép từ Figma). Đề xuất 4–6 ảnh tỉ lệ ~16:10, ≥1600px.
- Tiêu đề + mô tả cho từng mục (Figma mới có `(01) LOCK IN`).

---

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

**Mâu thuẫn cần xác nhận:** ảnh `Flip_card.png` có viền **vàng** nhưng chữ là "NGHỆ THUẬT & CHẾ TÁC", trong khi trên Figma card 01 viền **đỏ**, card viền vàng là "Đời sống & phong vị". Spec đang theo quy tắc **mặt sau giữ viền của mặt trước**.

**Thiếu asset:** icon mặt sau cho từng card (hiện chỉ thấy con mắt trong ảnh mẫu). Cần 4 SVG, hoặc 1 icon dùng chung.

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

## 11. Thứ tự triển khai đề xuất

| Bước | Hạng mục | Lý do |
|---|---|---|
| 1 | `src/lib/motion.ts`, Lenis + ScrollTrigger setup, reduced-motion hook | Nền tảng cho mọi mục sau |
| 2 | RollText (mục 1, 9), UnderlineLink (10), RollPill (2) | Nhỏ, dùng lại nhiều nơi |
| 3 | Marquee + pill hover (6, 7), USP reveal (5), FlipCard (8) | Độc lập từng section |
| 4 | HeroToBreak (3) | Pin + morph, cần chỉnh nhiều trên trình duyệt |
| 5 | ProjectsCylinder (4) | Phụ thuộc ảnh và copy từ chủ dự án |

## 12. Câu hỏi mở

1. Mục 3: shape giữa Hero có đúng là khung vòm viền vàng `2727:1131` không?
2. Mục 4: ảnh và nội dung (tiêu đề, mô tả) của từng dự án, số lượng 4 hay nhiều hơn?
3. Mục 8: mặt sau giữ viền theo card (đỏ/vàng/xanh/amber) hay dùng vàng chung như ảnh mẫu? Icon mặt sau cho từng card?
4. Mục 2: bảng màu hover của từng nút có ổn không?
