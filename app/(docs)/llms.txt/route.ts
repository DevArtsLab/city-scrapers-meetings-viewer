import { source } from "@/lib/source";
import { llms } from "fumadocs-core/source";

const llmsConfig = llms(source);

export function GET() {
  return new Response(llmsConfig.index(), {
    headers: { "content-type": "text/plain" },
  });
}

export const dynamic = "force-static";
