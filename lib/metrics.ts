export type Counts = {
  views: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
};
export function engagementRate(counts: Counts): number | null {
  const { views, likes, comments, shares } = counts;
  if (
    [views, likes, comments, shares].some(
      (v) => v === null || !Number.isFinite(v) || v < 0,
    ) ||
    !views
  )
    return null;
  return ((likes! + comments! + shares!) / views) * 100;
}
export function interactionRate(counts: Counts): number | null {
  if (
    counts.views === null ||
    counts.likes === null ||
    counts.comments === null ||
    counts.views <= 0 ||
    [counts.views, counts.likes, counts.comments].some(
      (v) => !Number.isFinite(v) || v < 0,
    )
  )
    return null;
  return ((counts.likes + counts.comments) / counts.views) * 100;
}
export function estimateRevenue(
  views: number,
  lowRpm: number,
  highRpm: number,
): [number, number] {
  if (
    [views, lowRpm, highRpm].some((v) => !Number.isFinite(v) || v < 0) ||
    lowRpm > highRpm
  )
    throw new Error(
      "Use nonnegative values and a low RPM no greater than the high RPM.",
    );
  return [(views / 1000) * lowRpm, (views / 1000) * highRpm];
}
export function relativeLift(value: number, baseline: number): number | null {
  return baseline > 0 ? ((value - baseline) / baseline) * 100 : null;
}
