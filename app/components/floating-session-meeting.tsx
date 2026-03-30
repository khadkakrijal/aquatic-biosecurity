"use client";

import { useEffect, useState } from "react";
import JitsiMeeting from "./jitsi-meeting";

interface ActiveMeetingState {
  roomName: string;
  sessionCode: string;
  userName: string;
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
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        if (parsed?.roomName && parsed?.sessionCode && parsed?.userName) {
          setMeeting(parsed);
          setHidden(false);
        } else {
          setMeeting(null);
        }
      } catch {
        setMeeting(null);
      }
    };

    syncMeeting();

    window.addEventListener("storage", syncMeeting);
    window.addEventListener("active-simulation-meeting-changed", syncMeeting);

    return () => {
      window.removeEventListener("storage", syncMeeting);
      window.removeEventListener(
        "active-simulation-meeting-changed",
        syncMeeting
      );
    };
  }, [mounted]);

  if (!mounted || !meeting || hidden) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[360px] rounded-2xl border bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Meeting Room</p>
          <p className="text-xs text-slate-500">{meeting.sessionCode}</p>
          <p className="text-xs text-slate-400">{meeting.userName}</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMinimized((prev) => !prev)}
            className="rounded-lg border px-2 py-1 text-xs text-slate-700"
          >
            {minimized ? "Expand" : "Minimize"}
          </button>

          <button
            type="button"
            onClick={() => setHidden(true)}
            className="rounded-lg border px-2 py-1 text-xs text-slate-700"
          >
            Hide
          </button>
        </div>
      </div>

      {!minimized && (
        <div className="p-3">
          <JitsiMeeting
            roomName={meeting.roomName}
            userName={meeting.userName}
            height={260}
          />
        </div>
      )}
    </div>
  );
}