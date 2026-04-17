"use server";

import { importScenarioFromExcel } from "@/app/lib/import-scenario-from-excel";



export type ImportActionState = {
  success: boolean;
  message: string;
};

export async function importScenarioAction(
  _prevState: ImportActionState,
  formData: FormData
): Promise<ImportActionState> {
  try {
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return {
        success: false,
        message: "Please choose an Excel file first.",
      };
    }

    if (!file.name.endsWith(".xlsx")) {
      return {
        success: false,
        message: "Please upload a .xlsx Excel file.",
      };
    }

    const buffer = await file.arrayBuffer();
    const result = await importScenarioFromExcel(buffer);

    return {
      success: true,
      message: `Scenario "${result.scenarioTitle}" was imported successfully.`,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Import failed due to an unknown error.",
    };
  }
}