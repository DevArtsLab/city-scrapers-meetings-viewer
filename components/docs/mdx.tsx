import defaultMdxComponents from "fumadocs-ui/mdx";
import { StatusChip } from "@/components/ui/StatusChip";

export function getMDXComponents(
  components?: Record<string, React.ComponentType>
) {
  return {
    ...defaultMdxComponents,
    StatusChip,
    ...components,
  };
}
