import { PortableText } from "@portabletext/react";
import { SanityImage } from "@/components/sanity-image";
import { formatDateRange } from "@/lib/format-date-range";
import { groupTechStack } from "@/lib/group-tech-stack";
import { strings } from "@/lib/strings";
import { WithFetchOptions } from "@/sanity/lib/fetch-options";
import { type FetchOptions, fetchSanity } from "@/sanity/lib/live";
import { workPageQuery } from "@/sanity/lib/queries";
import type { WorkPageQueryResult } from "@/sanity.types";

type Experience = WorkPageQueryResult["experiences"][number];

export default function WorkPage() {
  return (
    <WithFetchOptions>
      {(fetchOptions) => <Work fetchOptions={fetchOptions} />}
    </WithFetchOptions>
  );
}

async function Work({ fetchOptions }: { fetchOptions: FetchOptions }) {
  const { data } = await fetchSanity({ query: workPageQuery, ...fetchOptions });
  const techStack = groupTechStack(data.techStack);

  return (
    <div className="space-y-12 py-12">
      <h1 className="font-semibold text-3xl tracking-tight">
        {strings.work.title}
      </h1>

      <section aria-labelledby="experience" className="space-y-6">
        <h2 id="experience" className="font-semibold text-xl tracking-tight">
          {strings.work.experience}
        </h2>
        {data.experiences.length ? (
          <ol className="space-y-8">
            {data.experiences.map((experience) => (
              <li key={experience._id}>
                <ExperienceItem experience={experience} />
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-muted-foreground">{strings.work.empty}</p>
        )}
      </section>

      {techStack.length ? (
        <section aria-labelledby="tech-stack" className="space-y-6">
          <h2 id="tech-stack" className="font-semibold text-xl tracking-tight">
            {strings.work.techStack}
          </h2>
          <dl className="space-y-4">
            {techStack.map((group) => (
              <div key={group.category} className="space-y-2">
                <dt className="text-muted-foreground text-sm">
                  {group.category}
                </dt>
                <dd>
                  <ul className="flex flex-wrap gap-2 text-sm">
                    {group.items.map((item) => (
                      <li key={item} className="rounded-full border px-3 py-1">
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
    <article className="flex gap-4">
      {experience.image?.asset ? (
        <SanityImage
          image={experience.image}
          sizes="40px"
          className="size-10 shrink-0 rounded-md object-cover"
        />
      ) : null}
      <div className="min-w-0 space-y-1">
        <h3 className="font-semibold tracking-tight">{experience.role}</h3>
        <p className="text-sm">
          {experience.url ? (
            <a href={experience.url} className="text-primary hover:underline">
              {experience.company}
            </a>
          ) : (
            experience.company
          )}
          <span className="text-muted-foreground">
            {" "}
            · {formatDateRange(experience)}
          </span>
        </p>
        {experience.description?.length ? (
          <div className="pt-1 text-muted-foreground leading-7">
            <PortableText value={experience.description} />
          </div>
        ) : null}
      </div>
    </article>
  );
}
