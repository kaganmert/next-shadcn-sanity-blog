import { strings } from "@/lib/strings";
import { type FetchOptions, fetchSanity } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";

export async function SiteFooter({
  fetchOptions,
}: {
  fetchOptions: FetchOptions;
}) {
  const { data: settings } = await fetchSanity({
    query: settingsQuery,
    ...fetchOptions,
  });

  return (
    <footer className="page-column flex flex-wrap items-center justify-between gap-4 py-10 text-muted-foreground text-sm">
      <p>{strings.footer.builtWith}</p>
      {settings?.socialLinks?.length ? (
        <ul className="flex flex-wrap gap-4">
          {settings.socialLinks.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </footer>
  );
}
