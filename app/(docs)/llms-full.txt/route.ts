import { source } from "@/lib/source";

export function GET() {
  const pages = source.getPages();
  const parts = pages.map((page) => {
    const url = page.url;
    const title = page.data.title;
    const description = page.data.description ?? "";
    return `## ${title}\n\n${description}\n\nURL: ${url}`;
  });
  return new Response(parts.join("\n\n---\n\n"), {
    headers: { "content-type": "text/plain" },
  });
}

export const dynamic = "force-static";
