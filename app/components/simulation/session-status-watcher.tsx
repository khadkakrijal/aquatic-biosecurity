"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface SessionStatusWatcherProps {
  sessionCode: string;
}

export default function SessionStatusWatcher({
  sessionCode,
}: SessionStatusWatcherProps) {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from("simulation_sessions")
          .select("status")
          .eq("session_code", sessionCode.toUpperCase())
          .single();

        if (!mounted || error || !data) return;

        if (data.status === "ended") {
          localStorage.removeItem("active-simulation-meeting");
          window.dispatchEvent(new Event("active-simulation-meeting-changed"));
          clearInterval(interval);
          router.replace("/scenario/invasive-mussel");
        }
      } catch (err) {
        console.error("Session watcher error:", err);
      }
    }, 2000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [router, sessionCode]);

  return null;
}