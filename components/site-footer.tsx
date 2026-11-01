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
    <footer className="page-column pt-10 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-8 text-muted-foreground text-sm">
        <p className="label-mono">{strings.footer.builtWith}</p>
        {settings?.socialLinks?.length ? (
          <ul className="flex flex-wrap gap-5">
            {settings.socialLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  className="transition-colors duration-150 hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </footer>
  );
}
