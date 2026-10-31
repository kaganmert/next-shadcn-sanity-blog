import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { strings } from "@/lib/strings";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2"
      >
        {strings.skipToContent}
      </a>
      <SiteHeader />
      <main id="content" className="page-column flex-1 pb-16">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
