import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { smoochSans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lưu Load | Một nơi để lưu – Nạp lại",
  description:
    "Lưu Load là cộng đồng sáng tạo chuyên về văn hóa Việt Nam. Khám phá, chia sẻ và kết nối cơ hội nghề nghiệp.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={smoochSans.variable}>
      <body className="min-h-screen">
        <SmoothScroll />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
