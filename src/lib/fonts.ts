import localFont from "next/font/local";

/**
 * Smooch Sans (OFL): display, nav, CTA. File nằm trong public/assets/fonts/smooch-sans/static.
 * Body font SVN-Gilroy được khai báo bằng @font-face trong globals.css (xem ghi chú license ở đó).
 */
export const smoochSans = localFont({
  src: [
    { path: "../../public/assets/fonts/smooch-sans/static/SmoochSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/assets/fonts/smooch-sans/static/SmoochSans-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../public/assets/fonts/smooch-sans/static/SmoochSans-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-smooch",
  display: "swap",
});
