"use client";

import { useEffect, useState } from "react";
import JitsiMeeting from "./jitsi-meeting";

interface ActiveMeetingState {
  roomName: string;
  sessionCode: string;
  userName: string;
  isHost?: boolean;
}

export default function FloatingSessionMeeting() {
  const [mounted, setMounted] = useState(false);
  const [meeting, setMeeting] = useState<ActiveMeetingState | null>(null);
  const [minimized, setMinimized] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const syncMeeting = () => {
      const raw = localStorage.getItem("active-simulation-meeting");

      if (!raw) {
        setMeeting(null);
        setMinimized(false);
        setHidden(false);
        return;
      }

      try {
        const parsed = JSON.parse(raw);

        if (parsed?.roomName && parsed?.sessionCode && parsed?.userName) {
          setMeeting(parsed);
        } else {
          setMeeting(null);
        }
      } catch {
        setMeeting(null);
      }
    };

    const forceCloseMeeting = () => {
      localStorage.removeItem("active-simulation-meeting");
      setMeeting(null);
      setMinimized(false);
      setHidden(false);
    };

    syncMeeting();

    window.addEventListener("storage", syncMeeting);
    window.addEventListener("active-simulation-meeting-changed", syncMeeting);
    window.addEventListener("force-close-simulation-meeting", forceCloseMeeting);

    return () => {
      window.removeEventListener("storage", syncMeeting);
      window.removeEventListener(
        "active-simulation-meeting-changed",
        syncMeeting
      );
      window.removeEventListener(
        "force-close-simulation-meeting",
        forceCloseMeeting
      );
    };
  }, [mounted]);

  if (!mounted || !meeting) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[92vw] max-w-[520px] rounded-2xl border bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Meeting Room</p>
          <p className="text-xs text-slate-500">{meeting.sessionCode}</p>
          <p className="text-xs text-slate-400">{meeting.userName}</p>
          <p className="text-[11px] text-slate-400">
            {meeting.isHost ? "Host controls session" : "Viewer mode"}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setHidden(false);
              setMinimized((prev) => !prev);
            }}
            className="rounded-lg border px-2 py-1 text-xs text-slate-700"
          >
            {minimized ? "Expand" : "Minimize"}
          </button>

          <button
            type="button"
            onClick={() => {
              setHidden((prev) => !prev);
              setMinimized(false);
            }}
            className="rounded-lg border px-2 py-1 text-xs text-slate-700"
          >
            {hidden ? "Show" : "Hide"}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          hidden || minimized
            ? "max-h-0 p-0 opacity-0"
            : "max-h-[560px] p-3 opacity-100"
        }`}
      >
        <JitsiMeeting
          roomName={meeting.roomName}
          userName={meeting.userName}
          height={380}
          isHost={Boolean(meeting.isHost)}
        />
      </div>
    </div>
  );
}