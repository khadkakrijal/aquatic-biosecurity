"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { importScenarioAction, type ImportActionState } from "./action";
import { Button } from "@/components/ui/button";

const initialState: ImportActionState = {
  success: false,
  message: "",
};

export default function ImportScenarioForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    importScenarioAction,
    initialState,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (pending) {
      setProgress(5);

      progressTimerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;

          // gradually slow down near the end
          if (prev < 30) return prev + 8;
          if (prev < 60) return prev + 5;
          if (prev < 80) return prev + 3;
          return prev + 1;
        });
      }, 300);
    } else {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    }

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    };
  }, [pending]);

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      setProgress(100);

      Swal.fire({
        icon: "success",
        title: "Import completed",
        text: state.message,
        confirmButtonText: "OK",
      }).then(() => {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        setProgress(0);
        router.push("/admin/scenarios");
        router.refresh();
      });
    } else {
      setProgress(0);

      Swal.fire({
        icon: "error",
        title: "Import failed",
        text: state.message,
        confirmButtonText: "OK",
      });
    }
  }, [state, router]);

  return (
    <div className="space-y-5">
      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">
            Scenario Excel file
          </label>

          <input
            ref={fileInputRef}
            type="file"
            name="file"
            accept=".xlsx"
            required
            disabled={pending}
            className="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-white disabled:cursor-not-allowed disabled:opacity-60"
          />

          <p className="text-xs text-slate-500">
            Upload the prepared Excel workbook in .xlsx format.
          </p>
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="rounded-2xl bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-70"
        >
          {pending ? "Importing..." : "Import and Publish Scenario"}
        </Button>
      </form>

      {(pending || progress > 0) && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-900">
              Importing scenario...
            </p>
            <p className="text-sm font-semibold text-slate-700">{progress}%</p>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-cyan-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            {progress < 25 && "Preparing workbook and validating sheets..."}
            {progress >= 25 &&
              progress < 50 &&
              "Creating scenario and stages..."}
            {progress >= 50 &&
              progress < 75 &&
              "Adding questions and criteria..."}
            {progress >= 75 &&
              progress < 100 &&
              "Finalising branching and publishing scenario..."}
            {progress === 100 && "Import completed successfully."}
          </p>
        </div>
      )}
    </div>
  );
}
