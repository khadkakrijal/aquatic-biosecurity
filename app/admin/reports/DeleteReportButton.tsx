"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { deleteSimulationAttemptAction } from "@/app/actions/delete-simulation-report";

interface DeleteReportButtonProps {
  attemptId: string;
  redirectToReports?: boolean;
}

export default function DeleteReportButton({
  attemptId,
  redirectToReports = false,
}: DeleteReportButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete report?",
      text: "This will also delete all stage records for this attempt.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    startTransition(async () => {
      try {
        await deleteSimulationAttemptAction(attemptId);

        await Swal.fire({
          title: "Deleted",
          text: "The report has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#0891b2",
        });

        if (redirectToReports) {
          router.push("/admin/reports");
        } else {
          router.refresh();
        }
      } catch (error: any) {
        await Swal.fire({
          title: "Delete failed",
          text: error?.message || "Failed to delete report.",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-60"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}