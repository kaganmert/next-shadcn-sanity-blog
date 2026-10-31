import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { strings } from "@/lib/strings";

const navItems = [
  { href: "/blog", label: strings.nav.blog },
  { href: "/work", label: strings.nav.work },
] as const;

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-4 py-6 sm:px-6">
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
