import { strings } from "@/lib/strings";

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-2xl px-4 py-10 text-muted-foreground text-sm sm:px-6">
      <p>{strings.footer.builtWith}</p>
    </footer>
  );
}
