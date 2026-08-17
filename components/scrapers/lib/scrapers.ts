import { promises as fs } from "fs";
import path from "path";

export interface SpiderEntry {
  slug: string;
  agency?: string;
  last_run?: string;
  last_run_status?: string;
}

export interface Manifest {
  spiders: SpiderEntry[];
}

export interface MeetingRecord {
  id: string;
  title: string;
  description: string;
  classification: string;
  start: string;
  end: string;
  all_day: boolean;
  time_notes: string;
  location: { name: string; address: string };
  links: { href: string; title: string }[];
  source: string;
  status: string;
  _idx?: number;
  _isFirst?: boolean;
  _duplicateCount?: number;
  _duplicateGroup?: number;
}

const DATA_DIR = path.join(process.cwd(), "data", "scrapers");

export async function listScrapers(): Promise<Manifest> {
  let files: string[] = [];
  try {
    files = await fs.readdir(DATA_DIR);
  } catch {
    return { spiders: [] };
  }

  const spiders = files
    .filter((file) => file.endsWith(".json"))
    .map((file) => ({ slug: file.replace(/\.json$/, "") }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  return { spiders };
}

export async function getScraperOutput(slug: string): Promise<MeetingRecord[]> {
  const filePath = path.join(DATA_DIR, `${slug}.json`);
  const contents = await fs.readFile(filePath, "utf-8");
  return JSON.parse(contents) as MeetingRecord[];
}
