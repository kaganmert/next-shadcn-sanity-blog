import Link from "next/link";
import { NavLinks } from "@/components/nav-links";
import { Seal } from "@/components/seal";
import { ThemeToggle } from "@/components/theme-toggle";
import { routes } from "@/lib/routes";
import { strings } from "@/lib/strings";
import { type FetchOptions, fetchSanity } from "@/sanity/lib/live";
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
  const { data: settings } = await fetchSanity({
    query: settingsQuery,
    ...fetchOptions,
  });
  const navigation = settings?.navigation?.length
    ? settings.navigation
    : defaultNavigation;

  return (
    <header className="page-column flex items-center justify-between gap-6 pt-8 pb-6 sm:pt-12">
      <Link
        href={routes.home}
        className="group flex min-w-0 items-center gap-3 rounded-sm"
      >
        <Seal className="seal-press" />
        <span className="truncate font-display font-semibold text-[0.95rem] tracking-[0.02em] transition-colors duration-150 group-hover:text-primary">
          {settings?.title ?? strings.siteName}
        </span>
      </Link>
      <nav
        aria-label={strings.nav.label}
        className="flex shrink-0 items-center gap-1"
      >
        <NavLinks items={navigation} />
        <ThemeToggle />
      </nav>
    </header>
  );
}
