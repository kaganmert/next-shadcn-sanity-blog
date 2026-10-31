import { strings } from "@/lib/strings";

export function SiteFooter() {
  return (
    <footer className="page-column py-10 text-muted-foreground text-sm">
      <p>{strings.footer.builtWith}</p>
    </footer>
  );
}
