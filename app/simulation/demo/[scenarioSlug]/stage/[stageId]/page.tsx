import { notFound } from "next/navigation";
import { getScenarioStageById } from "@/app/lib/scenario-loader";
import StagePageClient from "./StagePageClient";


interface PageProps {
  params: Promise<{
    scenarioSlug: string;
    stageId: string;
  }>;
}

export default async function StagePage({ params }: PageProps) {
  const { scenarioSlug, stageId } = await params;

  const result = await getScenarioStageById(scenarioSlug, stageId);

  if (!result) {
    notFound();
  }

  return <StagePageClient scenario={result.scenario} stage={result.stage} />;
}