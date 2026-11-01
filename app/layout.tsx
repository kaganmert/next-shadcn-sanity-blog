import {
  Geist,
  Geist_Mono,
  Newsreader,
  Shippori_Mincho,
} from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { strings } from "@/lib/strings";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Headings and the site mark. A Mincho face with a full Latin set. */
const mincho = Shippori_Mincho({
  variable: "--font-mincho",
  weight: ["500", "600"],
  subsets: ["latin"],
});

/** Long-form reading: post bodies, excerpts and intros. */
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

/** Shared by the site and the embedded Studio; the site chrome lives in app/(site)/layout.tsx. */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // next-themes adds the theme class to <html> before hydration.
    <html
      lang={strings.locale.lang}
      className={`${geistSans.variable} ${geistMono.variable} ${mincho.variable} ${newsreader.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
