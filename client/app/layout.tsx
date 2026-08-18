import type { Metadata, Viewport } from "next";
import "./globals.css";
import BackgroundMusic from "@/src/presentation/components/BackgroundMusic";

export const metadata: Metadata = {
  title: "Sojho or Fatah",
  description:
    "A real-time social deduction word game. Find the imposter before it's too late.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#12100e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <BackgroundMusic />
        {children}
        
        </body>
    </html>
  );
}
