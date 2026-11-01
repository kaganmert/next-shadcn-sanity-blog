import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import {
  PageTransition,
  ProjectTitleTransition,
} from "@/components/page-transition";
import { PostList } from "@/components/post-list";
import { ProjectLinks } from "@/components/project-links";
import { RichDescription } from "@/components/rich-description";
import { SanityImage } from "@/components/sanity-image";
import { SectionHeading } from "@/components/section-heading";
import { SlashList } from "@/components/slash-list";
import { formatDateRange } from "@/lib/format-date";
import { routes } from "@/lib/routes";
import { getSiteIdentity } from "@/lib/site-identity";
import { stagger } from "@/lib/stagger";
import { withPlaceholderParam } from "@/lib/static-params";
import { strings } from "@/lib/strings";
import { WithFetchOptions } from "@/sanity/lib/fetch-options";
import {
  type FetchOptions,
  fetchSanity,
  publishedFetchOptions,
} from "@/sanity/lib/live";
import { projectQuery, projectSlugsQuery } from "@/sanity/lib/queries";

/** Unknown slugs wait for the full render so `notFound()` returns a real 404. */
export const ensureStatic = "navigation";

/** Navigating here may wait for the page (see ensureStatic). */
export const instant = false;

/** Prerenders every project page (projects with a gallery) at build time. */
export async function generateStaticParams() {
  const { data } = await fetchSanity({
    query: projectSlugsQuery,
    ...publishedFetchOptions,
  });
  return withPlaceholderParam(data);
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [site, { data: project }] = await Promise.all([
    getSiteIdentity(),
    fetchSanity({
      query: projectQuery,
      params: { slug },
      ...publishedFetchOptions,
    }),
  ]);
  if (!project) return {};
  const description = project.tagline ?? undefined;
  return {
    title: project.name,
    description,
    alternates: { canonical: routes.project(slug) },
    // Next replaces (not merges) the layout's openGraph, so repeat the site-wide fields.
    openGraph: {
      type: "website",
      url: routes.project(slug),
      siteName: site.title,
      locale: strings.locale.openGraph,
      title: project.name ?? undefined,
      description,
    },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  return (
    <PageTransition>
      <WithFetchOptions>
        {(fetchOptions) => <Project slug={slug} fetchOptions={fetchOptions} />}
      </WithFetchOptions>
    </PageTransition>
  );
}

async function Project({
  slug,
  fetchOptions,
}: {
  slug: string;
  fetchOptions: FetchOptions;
}) {
  const { data: project } = await fetchSanity({
    query: projectQuery,
    params: { slug },
    ...fetchOptions,
  });
  if (!project) notFound();

  return (
    <div className="pt-16 sm:pt-24">
      <article className="space-y-20">
        <header>
          <p className="ink-in label-mono">
            {strings.project.eyebrow}
            {project.status ? (
              <span className="before:mx-2 before:content-['·']">
                {project.status}
              </span>
            ) : null}
          </p>
          <div className="mt-6 flex items-center gap-5">
            {project.icon?.asset ? (
              <SanityImage
                image={project.icon}
                priority
                sizes="64px"
                className="ink-in size-14 shrink-0 rounded-[22%] object-cover sm:size-16"
              />
            ) : null}
            <ProjectTitleTransition slug={slug}>
              <h1 className="text-balance font-display font-semibold text-4xl leading-[1.2] tracking-[0.01em] sm:text-5xl">
                {project.name}
              </h1>
            </ProjectTitleTransition>
          </div>
          {project.tagline ? (
            <p
              className="ink-in mt-6 text-pretty font-serif text-muted-foreground text-xl leading-relaxed"
              style={stagger(1)}
            >
              {project.tagline}
            </p>
          ) : null}
          <div
            className="ink-in mt-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t pt-6"
            style={stagger(2)}
          >
            {project.startDate ? (
              <p className="label-mono">
                {formatDateRange({ ...project, isCurrent: project.isOngoing })}
              </p>
            ) : null}
            <ProjectLinks project={project} />
          </div>
        </header>

        {project.description?.length ? (
          <div
            className="ink-rise font-serif text-[1.125rem] text-muted-foreground leading-[1.8]"
            style={stagger(3)}
          >
            <RichDescription value={project.description} />
          </div>
        ) : null}

        {project.gallery?.length ? (
          <section aria-labelledby="gallery" className="space-y-8">
            <SectionHeading id="gallery">
              {strings.project.gallery}
            </SectionHeading>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {project.gallery.map((image, index) => (
                <li
                  key={image._key}
                  className="ink-rise"
                  style={stagger(index + 1)}
                >
                  <SanityImage
                    image={image}
                    sizes="(min-width: 768px) 210px, 45vw"
                    className="h-auto w-full rounded-sm border"
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {project.techStack?.length ? (
          <section aria-labelledby="project-tech-stack" className="space-y-6">
            <SectionHeading id="project-tech-stack">
              {strings.work.techStack}
            </SectionHeading>
            <SlashList items={project.techStack} className="text-lg" />
          </section>
        ) : null}

        {project.updates.length ? (
          <section aria-labelledby="updates" className="space-y-4">
            <SectionHeading id="updates">
              {strings.project.updates}
            </SectionHeading>
            <PostList
              posts={project.updates}
              emptyMessage={strings.blog.empty}
              headingLevel="h3"
            />
          </section>
        ) : null}
      </article>
      <BackLink href={routes.work} label={strings.project.backToWork} />
    </div>
  );
}
