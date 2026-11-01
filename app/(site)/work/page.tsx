import { PortableText } from "@portabletext/react";
import { cn } from "cn";
import type { Metadata } from "next";
import { PageTransition } from "@/components/page-transition";
import { SanityImage } from "@/components/sanity-image";
import { SectionHeading } from "@/components/section-heading";
import { formatDateRange } from "@/lib/format-date";
import { groupTechStack } from "@/lib/group-tech-stack";
import { routes } from "@/lib/routes";
import { stagger } from "@/lib/stagger";
import { strings } from "@/lib/strings";
import { WithFetchOptions } from "@/sanity/lib/fetch-options";
import { type FetchOptions, fetchSanity } from "@/sanity/lib/live";
import { workPageQuery } from "@/sanity/lib/queries";
import type { WorkPageQueryResult } from "@/sanity.types";

type Experience = WorkPageQueryResult["experiences"][number];

export const metadata: Metadata = {
  title: strings.work.title,
  alternates: { canonical: routes.work },
};

export default function WorkPage() {
  return (
    <PageTransition>
      <WithFetchOptions>
        {(fetchOptions) => <Work fetchOptions={fetchOptions} />}
      </WithFetchOptions>
    </PageTransition>
  );
}

async function Work({ fetchOptions }: { fetchOptions: FetchOptions }) {
  const { data } = await fetchSanity({ query: workPageQuery, ...fetchOptions });
  const techStack = groupTechStack(data.techStack);

  return (
    <div className="space-y-20 pt-16 sm:pt-24">
      <h1 className="ink-in font-display font-semibold text-4xl tracking-[0.01em] sm:text-5xl">
        {strings.work.title}
      </h1>

      <section aria-labelledby="experience" className="space-y-10">
        <SectionHeading id="experience">
          {strings.work.experience}
        </SectionHeading>
        {data.experiences.length ? (
          <ol className="relative space-y-12 border-l pl-8">
            {data.experiences.map((experience, index) => (
              <li
                key={experience._id}
                className="ink-in relative"
                style={stagger(index + 1)}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-2 -left-8 size-[7px] -translate-x-1/2 rounded-full border",
                    experience.isCurrent
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/50 bg-background",
                  )}
                />
                <ExperienceItem experience={experience} />
              </li>
            ))}
          </ol>
        ) : (
          <p className="font-serif text-muted-foreground">
            {strings.work.empty}
          </p>
        )}
      </section>

      {techStack.length ? (
        <section aria-labelledby="tech-stack" className="space-y-10">
          <SectionHeading id="tech-stack">
            {strings.work.techStack}
          </SectionHeading>
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-[7.5rem_1fr]">
            {techStack.map((group) => (
              <div key={group.category} className="contents">
                <dt className="label-mono pt-1">{group.category}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-x-3 gap-y-1 font-serif text-lg">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="after:ml-3 after:text-border after:content-['/'] last:after:content-none"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  );
}

function ExperienceItem({ experience }: { experience: Experience }) {
  return (
    <article className="space-y-2">
      <p className="label-mono">{formatDateRange(experience)}</p>
      <div className="flex items-center gap-3">
        {experience.image?.asset ? (
          <SanityImage
            image={experience.image}
            sizes="28px"
            className="size-7 shrink-0 rounded-[3px] object-cover"
          />
        ) : null}
        <h3 className="font-display font-semibold text-lg tracking-[0.01em]">
          {experience.role}
        </h3>
      </div>
      <p className="text-muted-foreground text-sm">
        {experience.url ? (
          <a
            href={experience.url}
            className="text-foreground underline decoration-primary/45 decoration-1 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-primary"
          >
            {experience.company}
          </a>
        ) : (
          experience.company
        )}
      </p>
      {experience.description?.length ? (
        <div className="max-w-[36rem] pt-1 font-serif text-[1.05rem] text-muted-foreground leading-relaxed">
          <PortableText value={experience.description} />
        </div>
      ) : null}
    </article>
  );
}
