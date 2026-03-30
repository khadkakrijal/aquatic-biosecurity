"use client";

import { useEffect } from "react";

interface SessionMeetingBootstrapProps {
  sessionCode: string;
  userName: string;
}

export default function SessionMeetingBootstrap({
  sessionCode,
  userName,
}: SessionMeetingBootstrapProps) {
  useEffect(() => {
    const payload = {
      roomName: `simulation-${sessionCode.toUpperCase()}`,
      sessionCode: sessionCode.toUpperCase(),
      userName,
    };

    localStorage.setItem("active-simulation-meeting", JSON.stringify(payload));
    window.dispatchEvent(new Event("active-simulation-meeting-changed"));
  }, [sessionCode, userName]);

  return null;
}