import { cn } from "cn";
import type { Metadata } from "next";
import Link from "next/link";
import {
  PageTransition,
  ProjectTitleTransition,
} from "@/components/page-transition";
import { ProjectLinks } from "@/components/project-links";
import { inkLinkClass, RichDescription } from "@/components/rich-description";
import { SanityImage } from "@/components/sanity-image";
import { SectionHeading } from "@/components/section-heading";
import { SlashList } from "@/components/slash-list";
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
type Project = WorkPageQueryResult["projects"][number];
type Credential = WorkPageQueryResult["credentials"][number];

export const metadata: Metadata = {
  title: strings.work.title,
  alternates: { canonical: routes.work },
};

/** Credential sections, in page order. Awards and certificates share one. */
const credentialSections = [
  { id: "education", title: strings.work.education, kinds: ["education"] },
  {
    id: "awards",
    title: strings.work.awardsAndCertificates,
    kinds: ["award", "certificate"],
  },
  {
    id: "organizations",
    title: strings.work.organizations,
    kinds: ["organization"],
  },
] as const;

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
      <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <h1 className="ink-in font-display font-semibold text-4xl tracking-[0.01em] sm:text-5xl">
          {strings.work.title}
        </h1>
        {data.resumeUrl ? (
          <a
            href={routes.resume}
            className="ink-in group label-mono inline-flex items-center gap-2 pb-1.5 transition-colors duration-150 hover:text-primary"
            style={stagger(1)}
          >
            {strings.work.downloadCv}
            <span
              aria-hidden
              className="transition-transform duration-200 ease-out group-hover:translate-y-0.5"
            >
              ↓
            </span>
          </a>
        ) : null}
      </header>

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

      {data.projects.length ? (
        <section aria-labelledby="projects" className="space-y-4">
          <SectionHeading id="projects">{strings.work.projects}</SectionHeading>
          <ul>
            {data.projects.map((project) => (
              <li key={project._id} className="border-t py-8 first:border-t-0">
                <ProjectItem project={project} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {credentialSections.map((section) => {
        const items = data.credentials.filter((credential) =>
          (section.kinds as readonly string[]).includes(credential.kind ?? ""),
        );
        return items.length ? (
          <section
            key={section.id}
            aria-labelledby={section.id}
            className="space-y-8"
          >
            <SectionHeading id={section.id}>{section.title}</SectionHeading>
            <ul className="space-y-8">
              {items.map((credential) => (
                <li key={credential._id}>
                  <CredentialItem credential={credential} />
                </li>
              ))}
            </ul>
          </section>
        ) : null;
      })}

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
                  <SlashList items={group.items} className="text-lg" />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  );
}

const descriptionClass =
  "max-w-[36rem] font-serif text-[1.05rem] text-muted-foreground leading-relaxed";

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
          <a href={experience.url} className={inkLinkClass}>
            {experience.company}
          </a>
        ) : (
          experience.company
        )}
      </p>
      {experience.description?.length ? (
        <div className={cn(descriptionClass, "pt-1")}>
          <RichDescription value={experience.description} />
        </div>
      ) : null}
    </article>
  );
}

function ProjectItem({ project }: { project: Project }) {
  const title = (
    <h3 className="font-display font-semibold text-lg tracking-[0.01em]">
      {project.hasPage && project.slug ? (
        <Link
          href={routes.project(project.slug)}
          className="transition-colors duration-150 hover:text-primary"
        >
          {project.name}
        </Link>
      ) : (
        project.name
      )}
    </h3>
  );

  return (
    <article className="space-y-2">
      <p className="label-mono">
        {project.startDate
          ? formatDateRange({ ...project, isCurrent: project.isOngoing })
          : null}
        {project.status ? (
          <span className="before:mx-2 before:content-['·']">
            {project.status}
          </span>
        ) : null}
      </p>
      <div className="flex items-center gap-3">
        {project.icon?.asset ? (
          <SanityImage
            image={project.icon}
            sizes="28px"
            className="size-7 shrink-0 rounded-[22%] object-cover"
          />
        ) : null}
        {project.hasPage && project.slug ? (
          <ProjectTitleTransition slug={project.slug}>
            {title}
          </ProjectTitleTransition>
        ) : (
          title
        )}
      </div>
      {project.tagline ? (
        <p className="text-muted-foreground text-sm">{project.tagline}</p>
      ) : null}
      {/* A project with its own page keeps its story and stack there; the list stays short. */}
      {!project.hasPage && project.description?.length ? (
        <div className={cn(descriptionClass, "pt-1")}>
          <RichDescription value={project.description} />
        </div>
      ) : null}
      {!project.hasPage && project.techStack?.length ? (
        <SlashList
          items={project.techStack}
          className="pt-1 text-[0.95rem] text-muted-foreground"
        />
      ) : null}
      <ProjectLinks
        project={project}
        more={
          project.hasPage && project.slug ? (
            <Link
              href={routes.project(project.slug)}
              className="transition-colors duration-150 hover:text-primary"
            >
              {strings.project.eyebrow} →
            </Link>
          ) : null
        }
      />
    </article>
  );
}

// `kind` is only used to pick the section, so the item never needs its literal type.
function CredentialItem({
  credential,
}: {
  credential: Omit<Credential, "kind">;
}) {
  return (
    <article className="grid gap-x-8 gap-y-1 sm:grid-cols-[7.5rem_1fr]">
      <p className="label-mono pt-1">{credential.period}</p>
      <div className="space-y-1">
        <h3 className="font-display font-semibold text-lg tracking-[0.01em]">
          {credential.url ? (
            <a
              href={credential.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-150 hover:text-primary"
            >
              {credential.title}
            </a>
          ) : (
            credential.title
          )}
        </h3>
        {credential.issuer ? (
          <p className="text-muted-foreground text-sm">{credential.issuer}</p>
        ) : null}
        {credential.description ? (
          <p className={cn(descriptionClass, "pt-1")}>
            {credential.description}
          </p>
        ) : null}
      </div>
    </article>
  );
}
