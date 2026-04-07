"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface SessionLobbyListenerProps {
  sessionId: string;
  sessionCode: string;
  initialStatus: string;
  initialStageNumber: number;
  isHost: boolean;
}

function mapStageNumberToStageId(stageNumber?: number | null): string {
  switch (stageNumber) {
    case 1:
      return "p1";
    case 2:
      return "p2-controlled";
    case 3:
      return "p3-controlled";
    case 4:
      return "p4-controlled";
    case 5:
      return "p5-controlled";
    case 6:
      return "p6-controlled";
    default:
      return "p1";
  }
}

export default function SessionLobbyListener({
  sessionId,
  sessionCode,
  initialStatus,
  initialStageNumber,
  isHost,
}: SessionLobbyListenerProps) {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    if (initialStatus === "active") {
      if (isHost) {
        router.replace(
          `/simulation/demo/stage/${mapStageNumberToStageId(
            initialStageNumber
          )}?session=${sessionCode}`
        );
      }
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
          clearInterval(interval);

          if (isHost) {
            router.replace(
              `/simulation/demo/stage/${mapStageNumberToStageId(
                data.current_stage_number
              )}?session=${data.session_code ?? sessionCode}`
            );
          }

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
  }, [
    initialStageNumber,
    initialStatus,
    isHost,
    router,
    sessionCode,
    sessionId,
  ]);

  return null;
}