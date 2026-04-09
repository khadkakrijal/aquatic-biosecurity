import { notFound } from "next/navigation";
import { getScenarioBySlug } from "@/app/lib/scenario-loader";
import SummaryPageClient from "./SummaryPageClient";


interface PageProps {
  params: Promise<{
    scenarioSlug: string;
  }>;
}

export default async function SummaryPage({ params }: PageProps) {
  const { scenarioSlug } = await params;

  const scenario = await getScenarioBySlug(scenarioSlug);

  if (!scenario) {
    notFound();
  }

  return <SummaryPageClient scenario={scenario} />;
}