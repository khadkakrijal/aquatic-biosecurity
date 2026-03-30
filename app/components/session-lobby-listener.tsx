"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface SessionLobbyListenerProps {
  sessionId: string;
  sessionCode: string;
  initialStatus: string;
  initialStageNumber: number;
}

export default function SessionLobbyListener({
  sessionId,
  sessionCode,
  initialStatus,
  initialStageNumber,
}: SessionLobbyListenerProps) {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    if (initialStatus === "active") {
      router.replace(
        `/simulation/demo/stage/${initialStageNumber}?session=${sessionCode}`
      );
      return;
    }

    if (initialStatus === "ended") {
      localStorage.removeItem("active-simulation-meeting");
      window.dispatchEvent(new Event("active-simulation-meeting-changed"));
      router.replace("/scenario/invasive-mussel");
      return;
    }

    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from("simulation_sessions")
          .select("status,current_stage_number,session_code")
          .eq("id", sessionId)
          .single();

        if (!isMounted || error || !data) return;

        if (data.status === "active") {
          router.replace(
            `/simulation/demo/stage/${data.current_stage_number ?? 1}?session=${data.session_code ?? sessionCode}`
          );
          clearInterval(interval);
          return;
        }

        if (data.status === "ended") {
          localStorage.removeItem("active-simulation-meeting");
          window.dispatchEvent(new Event("active-simulation-meeting-changed"));
          clearInterval(interval);
          router.replace("/scenario/invasive-mussel");
        }
      } catch (err) {
        console.error("Lobby polling error:", err);
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [initialStageNumber, initialStatus, router, sessionCode, sessionId]);

  return null;
}