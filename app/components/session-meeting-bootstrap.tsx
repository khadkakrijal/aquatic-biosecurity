"use client";

import { useEffect } from "react";

interface SessionMeetingBootstrapProps {
  sessionCode: string;
  userName: string;
  isHost: boolean;
}

export default function SessionMeetingBootstrap({
  sessionCode,
  userName,
  isHost,
}: SessionMeetingBootstrapProps) {
  useEffect(() => {
    const payload = {
      roomName: `simulation-${sessionCode.toUpperCase()}`,
      sessionCode: sessionCode.toUpperCase(),
      userName,
      isHost,
    };

    localStorage.setItem("active-simulation-meeting", JSON.stringify(payload));
    window.dispatchEvent(new Event("active-simulation-meeting-changed"));
  }, [sessionCode, userName, isHost]);

  return null;
}