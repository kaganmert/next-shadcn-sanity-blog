import { describe, expect, it } from "vitest";
import { buildRssFeed } from "./rss";

const site = {
  title: "My Blog",
  description: "Notes & experiments",
  url: "https://example.com",
};

describe("buildRssFeed", () => {
  it("describes the channel with absolute links and the feed's own URL", () => {
    const xml = buildRssFeed({ site, posts: [] });
    expect(xml).toMatch(
      /^<\?xml version="1.0" encoding="UTF-8"\?>\n<rss version="2.0"/,
    );
    expect(xml).toContain("<title>My Blog</title>");
    expect(xml).toContain("<link>https://example.com</link>");
    expect(xml).toContain(
      '<atom:link href="https://example.com/rss.xml" rel="self" type="application/rss+xml"/>',
    );
  });

  it("adds one item per post with an absolute link, guid and RFC 822 date", () => {
    const xml = buildRssFeed({
      site,
      posts: [
        {
          title: "Hello",
          slug: "hello-world",
          excerpt: "First post",
          publishedAt: "2026-10-20T09:00:00Z",
        },
      ],
    });
    expect(xml).toContain(
      [
        "<item>",
        "<title>Hello</title>",
        "<link>https://example.com/blog/hello-world</link>",
        '<guid isPermaLink="true">https://example.com/blog/hello-world</guid>',
        "<description>First post</description>",
        "<pubDate>Tue, 20 Oct 2026 09:00:00 GMT</pubDate>",
        "</item>",
      ].join(""),
    );
  });

  it("escapes characters that would break the XML", () => {
    const xml = buildRssFeed({
      site,
      posts: [
        {
          title: 'Tags <b> & "quotes"',
          slug: "x",
          excerpt: "a < b",
          publishedAt: "2026-01-01T00:00:00Z",
        },
      ],
    });
    expect(xml).toContain("<description>Notes &amp; experiments</description>");
    expect(xml).toContain(
      "<title>Tags &lt;b&gt; &amp; &quot;quotes&quot;</title>",
    );
    expect(xml).toContain("<description>a &lt; b</description>");
  });
});
