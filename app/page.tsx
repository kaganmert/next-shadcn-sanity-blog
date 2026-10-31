import { strings } from "@/lib/strings";

export default function Home() {
  return (
    <section className="py-12">
      <h1 className="font-semibold text-3xl tracking-tight">
        {strings.home.title}
      </h1>
      <p className="mt-3 max-w-prose text-muted-foreground leading-7">
        {strings.home.intro}
      </p>
    </section>
  );
}
