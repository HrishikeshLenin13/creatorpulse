"use client";
import { useSyncExternalStore } from "react";
import type { VideoReport } from "./video-types";
import { parseVideoUrl } from "./video-url";
const KEY = "creatorpulse.reports.v1";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("reports-changed", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("reports-changed", callback);
  };
}
function snapshot() {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}
export function parseReports(text: string): VideoReport[] {
  try {
    const values: unknown = JSON.parse(text);
    if (!Array.isArray(values)) return [];
    return values.slice(0, 30).filter((v): v is VideoReport => {
      if (!v || typeof v !== "object") return false;
      const r = v as Partial<VideoReport>;
      try {
        const target = parseVideoUrl(r.url);
        if (
          target.short ||
          target.id !== r.id ||
          target.platform !== r.platform
        )
          return false;
      } catch {
        return false;
      }
      return (
        typeof r.title === "string" &&
        typeof r.author === "string" &&
        typeof r.fetchedAt === "string" &&
        Number.isFinite(Date.parse(r.fetchedAt)) &&
        ["public-oembed", "youtube-data-api"].includes(r.source ?? "") &&
        !!r.metrics &&
        ["views", "likes", "comments", "shares"].every((k) => {
          const n = r.metrics![k as keyof VideoReport["metrics"]];
          return (
            n === null ||
            (typeof n === "number" && Number.isFinite(n) && n >= 0)
          );
        }) &&
        (r.interactionRate === null ||
          (typeof r.interactionRate === "number" &&
            Number.isFinite(r.interactionRate))) &&
        (r.publishedAt === null || typeof r.publishedAt === "string") &&
        Array.isArray(r.observations) &&
        r.observations.every((s) => typeof s === "string") &&
        Array.isArray(r.limitations) &&
        r.limitations.every((s) => typeof s === "string")
      );
    });
  } catch {
    return [];
  }
}
export function useReports() {
  return parseReports(useSyncExternalStore(subscribe, snapshot, () => "[]"));
}
export function saveReport(report: VideoReport) {
  const reports = parseReports(snapshot());
  localStorage.setItem(
    KEY,
    JSON.stringify(
      [
        report,
        ...reports.filter(
          (r) => r.platform !== report.platform || r.id !== report.id,
        ),
      ].slice(0, 30),
    ),
  );
  window.dispatchEvent(new Event("reports-changed"));
}
export function clearReports() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("reports-changed"));
}
