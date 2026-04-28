import jsPDF from "jspdf";

export type ReportStage = {
  phaseNumber: number;
  stageTitle: string;
  stageId: string;
  decision?: string;
  severity?: string;
  situationShown?: string;
  answer?: string;
  feedback?: string;
  branchReason?: string;
  matchedCount?: number;
  missedCount?: number;
  matchedCriteria?: string[];
  missingCriteria?: string[];
  submittedAt?: string;
};

export type SimulationReportPdfData = {
  fileName?: string;
  reportTitle?: string;
  participantName?: string;
  participantEmail?: string;
  scenarioTitle: string;
  status?: string;
  completion?: string | number;
  overallSeverity?: string;
  startedAt?: string;
  completedAt?: string;
  duration?: string;
  finalSummary?: string;
  finalReflection?: string;
  stages: ReportStage[];
};

export function generateSimulationReportPdf(data: SimulationReportPdfData) {
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const addPageIfNeeded = (height = 10) => {
    if (y + height > pageHeight - margin) {
      pdf.addPage();
      y = 18;
    }
  };

  const addTitle = (text: string) => {
    addPageIfNeeded(15);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.setTextColor(15, 23, 42);
    pdf.text(text, margin, y);
    y += 10;
  };

  const addSectionTitle = (text: string) => {
    addPageIfNeeded(12);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.setTextColor(15, 23, 42);
    pdf.text(text, margin, y);
    y += 7;
  };

  const addParagraph = (text?: string) => {
    if (!text?.trim()) return;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(51, 65, 85);

    const lines = pdf.splitTextToSize(text, contentWidth);

    lines.forEach((line: string) => {
      addPageIfNeeded(6);
      pdf.text(line, margin, y);
      y += 5;
    });

    y += 3;
  };

  const addKeyValue = (label: string, value?: string | number) => {
    addPageIfNeeded(7);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(15, 23, 42);
    pdf.text(`${label}:`, margin, y);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(51, 65, 85);
    pdf.text(String(value || "N/A"), margin + 48, y);
    y += 6;
  };

  const addQualityBars = () => {
    const counts = {
      strong: data.stages.filter((s) => s.decision === "strong").length,
      mixed: data.stages.filter((s) => s.decision === "mixed").length,
      limited: data.stages.filter((s) => s.decision === "limited").length,
    };

    addSectionTitle("Response Quality Visual Summary");
    addParagraph(
      "This section shows how many phase responses were rated strong, mixed, or limited.",
    );

    const rows = [
      { label: "Strong", value: counts.strong, color: [16, 185, 129] },
      { label: "Mixed", value: counts.mixed, color: [245, 158, 11] },
      { label: "Limited", value: counts.limited, color: [239, 68, 68] },
    ];

    const maxValue = Math.max(1, ...rows.map((row) => row.value));
    const labelWidth = 25;
    const barMaxWidth = contentWidth - labelWidth - 30;

    rows.forEach((row) => {
      addPageIfNeeded(14);

      const barWidth = (row.value / maxValue) * barMaxWidth;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(30, 41, 59);
      pdf.text(row.label, margin, y);

      pdf.setFillColor(row.color[0], row.color[1], row.color[2]);
      pdf.rect(margin + labelWidth, y - 5, barWidth, 6, "F");

      pdf.setFont("helvetica", "normal");
      pdf.text(String(row.value), margin + labelWidth + barWidth + 4, y);

      y += 10;
    });

    y += 3;
  };

  const addCriteriaBars = () => {
    addSectionTitle("Criteria Coverage Visual Summary");
    addParagraph(
      "Green bars show matched criteria. Orange bars show missed required criteria for each phase.",
    );

    const maxValue = Math.max(
      1,
      ...data.stages.map((s) =>
        Math.max(Number(s.matchedCount || 0), Number(s.missedCount || 0)),
      ),
    );

    const labelWidth = 25;
    const barMaxWidth = contentWidth - labelWidth - 35;

    data.stages.forEach((stage) => {
      addPageIfNeeded(24);

      const matched = Number(stage.matchedCount || 0);
      const missed = Number(stage.missedCount || 0);

      const matchedWidth = (matched / maxValue) * barMaxWidth;
      const missedWidth = (missed / maxValue) * barMaxWidth;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(30, 41, 59);
      pdf.text(`P${stage.phaseNumber}`, margin, y);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);

      pdf.text("Matched", margin + labelWidth, y);
      pdf.setFillColor(16, 185, 129);
      pdf.rect(margin + labelWidth + 22, y - 4, matchedWidth, 5, "F");
      pdf.text(String(matched), margin + labelWidth + 26 + matchedWidth, y);

      y += 8;

      pdf.text("Missed", margin + labelWidth, y);
      pdf.setFillColor(245, 158, 11);
      pdf.rect(margin + labelWidth + 22, y - 4, missedWidth, 5, "F");
      pdf.text(String(missed), margin + labelWidth + 26 + missedWidth, y);

      y += 11;
    });

    y += 3;
  };

  addTitle(data.reportTitle || "Biosecurity Simulation Report");

  addKeyValue("Participant", data.participantName || "Participant");
  addKeyValue("Email", data.participantEmail || "N/A");
  addKeyValue("Scenario", data.scenarioTitle);
  addKeyValue("Status", data.status || "N/A");
  addKeyValue("Completion", data.completion || "N/A");
  addKeyValue("Overall severity", data.overallSeverity || "N/A");
  addKeyValue("Started", data.startedAt || "N/A");
  addKeyValue("Completed", data.completedAt || "N/A");
  addKeyValue("Duration", data.duration || "N/A");

  y += 4;

  addSectionTitle("Preparedness Summary");
  addParagraph(data.finalSummary || "No final summary available.");

  addQualityBars();
  addCriteriaBars();

  if (data.finalReflection) {
    addSectionTitle("Final Reflection");
    addParagraph(data.finalReflection);
  }

  addSectionTitle("Phase-by-Phase Details");

  data.stages.forEach((stage, index) => {
    addSectionTitle(
      `Stage ${index + 1}: Phase ${stage.phaseNumber} — ${stage.stageTitle || stage.stageId}`,
    );

    addKeyValue("Decision", stage.decision || "N/A");
    addKeyValue("Severity", stage.severity || "N/A");
    addKeyValue("Submitted", stage.submittedAt || "N/A");

    addParagraph(`Situation shown: ${stage.situationShown || "N/A"}`);
    addParagraph(`Answer: ${stage.answer || "No answer recorded."}`);
    addParagraph(`Feedback: ${stage.feedback || "No feedback recorded."}`);

    if (stage.branchReason) {
      addParagraph(`Branch reason: ${stage.branchReason}`);
    }

    addParagraph(
      `Matched criteria: ${
        stage.matchedCriteria?.length ? stage.matchedCriteria.join(", ") : "None"
      }`,
    );

    addParagraph(
      `Missing required criteria: ${
        stage.missingCriteria?.length ? stage.missingCriteria.join(", ") : "None"
      }`,
    );
  });

  const pageCount = pdf.getNumberOfPages();

  for (let i = 1; i <= pageCount; i += 1) {
    pdf.setPage(i);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 40, pageHeight - 8);
  }

  const safeFileName =
    data.fileName ||
    `${data.participantName || "participant"}-${data.scenarioTitle}-report`;

  pdf.save(
    `${safeFileName}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + ".pdf",
  );
}