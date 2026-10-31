import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { strings } from "@/lib/strings";

// TODO(NSB-06): read navigation from the Sanity `settings` singleton.
const navItems = [
  { href: "/blog", label: strings.nav.blog },
  { href: "/work", label: strings.nav.work },
] as const;

export function SiteHeader() {
  return (
    <header className="page-column flex items-center justify-between gap-4 py-6">
      <Link
        href="/"
        className="truncate font-semibold tracking-tight hover:text-primary"
      >
        {strings.siteName}
      </Link>
      <nav
        aria-label={strings.nav.label}
        className="flex shrink-0 items-center gap-1 text-sm"
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  );
}
