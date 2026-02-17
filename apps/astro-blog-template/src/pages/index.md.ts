import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const markdownContent = `# astro-blog-template

A clean, fast Astro blog template with markdown and HTML routes.

## Navigation

- [About](/about.md)
- [Recent Posts](/posts.md)
- [Archives](/archives.md)
- [RSS Feed](/rss.xml)

## Links

- Configure your links in \`src/constants.ts\`.
- Configure your site metadata in \`src/consts.ts\`.

---

*This is the markdown view. Visit the site root for the full experience.*`;

  return new Response(markdownContent, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
