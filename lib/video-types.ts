import type { Counts } from "./metrics";
export type VideoReport = {
  id: string;
  platform: "youtube" | "tiktok";
  url: string;
  title: string;
  author: string;
  fetchedAt: string;
  source: "public-oembed" | "youtube-data-api";
  metrics: Counts;
  publishedAt: string | null;
  interactionRate: number | null;
  observations: string[];
  limitations: string[];
};
