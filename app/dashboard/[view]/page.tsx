import { notFound } from "next/navigation";
import { Workspace } from "@/components/Workspace";
import type { View } from "@/components/Sidebar";
export function generateStaticParams() {
  return ["analyzer", "content", "revenue", "settings"].map((view) => ({
    view,
  }));
}
export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = await params;
  if (!["analyzer", "content", "revenue", "settings"].includes(view))
    notFound();
  return <Workspace view={view as View} />;
}
