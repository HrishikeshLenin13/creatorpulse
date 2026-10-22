// Explicit deterministic sample set. Never returned by the live analyzer API.
export type SamplePost = {
  id: string;
  title: string;
  category: string;
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  color: string;
};
export const SAMPLE_AS_OF = "2026-10-22T23:59:59Z";
export const samplePosts: SamplePost[] = [
  {
    id: "1",
    title: "A slower morning, a better day",
    category: "Lifestyle",
    date: "2026-10-21",
    views: 128400,
    likes: 15200,
    comments: 480,
    shares: 990,
    color: "blue",
  },
  {
    id: "2",
    title: "The setup behind the shot",
    category: "Behind the scenes",
    date: "2026-10-19",
    views: 92600,
    likes: 11750,
    comments: 310,
    shares: 720,
    color: "pink",
  },
  {
    id: "3",
    title: "Three things I wish I knew sooner",
    category: "Education",
    date: "2026-10-17",
    views: 74500,
    likes: 8930,
    comments: 251,
    shares: 510,
    color: "peach",
  },
  {
    id: "4",
    title: "Making something out of nothing",
    category: "Process",
    date: "2026-10-14",
    views: 182900,
    likes: 23100,
    comments: 692,
    shares: 2400,
    color: "lilac",
  },
  {
    id: "5",
    title: "Come with me to the weekend market",
    category: "Lifestyle",
    date: "2026-10-09",
    views: 48700,
    likes: 4100,
    comments: 184,
    shares: 306,
    color: "mint",
  },
  {
    id: "6",
    title: "The first five seconds matter",
    category: "Education",
    date: "2026-10-03",
    views: 107300,
    likes: 12600,
    comments: 418,
    shares: 1230,
    color: "yellow",
  },
  {
    id: "7",
    title: "My everyday creative toolkit",
    category: "Behind the scenes",
    date: "2026-09-15",
    views: 61000,
    likes: 6000,
    comments: 210,
    shares: 480,
    color: "blue",
  },
  {
    id: "8",
    title: "A month of showing up",
    category: "Process",
    date: "2026-08-28",
    views: 142000,
    likes: 18100,
    comments: 605,
    shares: 1800,
    color: "pink",
  },
];
export function postsInWindow(days: number) {
  const cutoff = Date.parse(SAMPLE_AS_OF) - days * 86400000;
  return samplePosts.filter((p) => Date.parse(p.date + "T12:00:00Z") >= cutoff);
}
