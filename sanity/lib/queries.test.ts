import { describe, expect, it } from "vitest";
import { runQuery } from "@/test/run-query";
import { settingsQuery } from "./queries";

describe("settingsQuery", () => {
  it("returns the site identity, navigation and social links from the settings singleton", async () => {
    const settings = await runQuery(settingsQuery);

    expect(settings).toEqual({
      title: "next-shadcn-sanity-blog",
      description:
        "A personal blog and portfolio built with Next.js, Sanity and shadcn/ui.",
      intro: "Writing about software, design and the things in between.",
      navigation: [
        { label: "Blog", href: "/blog" },
        { label: "Work", href: "/work" },
      ],
      socialLinks: [
        {
          label: "GitHub",
          url: "https://github.com/kaganmert/next-shadcn-sanity-blog",
        },
        { label: "Email", url: "mailto:hello@example.com" },
      ],
    });
  });

  it("returns null when no settings document exists", async () => {
    expect(await runQuery(settingsQuery, { documents: [] })).toBeNull();
  });
});
