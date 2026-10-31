import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { routes } from "@/lib/routes";
import { strings } from "@/lib/strings";
import { cachedSanity, type FetchOptions } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";

/** Used until the editor fills in navigation in Settings. */
const defaultNavigation = [
  { label: strings.nav.blog, href: routes.blog },
  { label: strings.nav.work, href: routes.work },
];

export async function SiteHeader({
  fetchOptions,
}: {
  fetchOptions: FetchOptions;
}) {
  const { data: settings } = await cachedSanity({
    query: settingsQuery,
    ...fetchOptions,
  });
  const navigation = settings?.navigation?.length
    ? settings.navigation
    : defaultNavigation;

  return (
    <header className="page-column flex items-center justify-between gap-4 py-6">
      <Link
        href={routes.home}
        className="truncate font-semibold tracking-tight hover:text-primary"
      >
        {settings?.title ?? strings.siteName}
      </Link>
      <nav
        aria-label={strings.nav.label}
        className="flex shrink-0 items-center gap-1 text-sm"
      >
        {navigation.map((item) => (
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
