"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface SessionStatusWatcherProps {
  sessionCode: string;
  currentStatus: string;
}

export default function SessionStatusWatcher({
  sessionCode,
  currentStatus,
}: SessionStatusWatcherProps) {
  const router = useRouter();

  useEffect(() => {
    if (currentStatus === "active") {
      router.push(`/simulation/demo/stage/1?session=${sessionCode}`);
      return;
    }

    const supabase = createClient();

    const interval = setInterval(async () => {
      const { data, error } = await supabase
        .from("simulation_sessions")
        .select("status,current_stage_number,session_code")
        .eq("session_code", sessionCode)
        .single();

      if (error || !data) return;

      if (data.status === "active") {
        router.push(
          `/simulation/demo/stage/${data.current_stage_number}?session=${data.session_code}`
        );
        router.refresh();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentStatus, router, sessionCode]);

  return null;
}