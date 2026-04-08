"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [expanded, setExpanded] = useState(false);

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
        setExpanded(false);
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
      setExpanded(false);
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

  const meetingHeight = useMemo(() => {
    if (expanded && typeof window !== "undefined") {
      return Math.max(window.innerHeight - 84, 300);
    }

    if (minimized || hidden) {
      return 220;
    }

    return 420;
  }, [expanded, minimized, hidden]);

  if (!mounted || !meeting) return null;

  const panelClasses = expanded
    ? "fixed inset-0 z-[9999] h-screen w-screen rounded-none border-0 bg-white shadow-none"
    : "fixed bottom-4 right-4 z-50 w-[94vw] max-w-[560px] rounded-2xl border bg-white shadow-2xl";

  const bodyClasses = expanded
    ? "h-[calc(100vh-84px)]"
    : minimized || hidden
    ? "h-0 opacity-0 pointer-events-none"
    : "h-auto opacity-100";

  return (
    <div className={panelClasses}>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">Meeting Room</p>
          <p className="truncate text-xs text-slate-500">{meeting.sessionCode}</p>
          <p className="truncate text-xs text-slate-400">{meeting.userName}</p>
          <p className="text-[11px] text-slate-400">
            {meeting.isHost ? "Host controls session" : "Viewer mode"}
          </p>
        </div>

        <div className="ml-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setHidden(false);
              setExpanded(false);
              setMinimized((prev) => !prev);
            }}
            className="rounded-lg border px-2 py-1 text-xs text-slate-700"
          >
            {minimized ? "Restore" : "Minimize"}
          </button>

          <button
            type="button"
            onClick={() => {
              setHidden(false);
              setMinimized(false);
              setExpanded((prev) => !prev);
            }}
            className="rounded-lg border px-2 py-1 text-xs text-slate-700"
          >
            {expanded ? "Exit Expand" : "Expand"}
          </button>

          <button
            type="button"
            onClick={() => {
              setExpanded(false);
              setMinimized(false);
              setHidden((prev) => !prev);
            }}
            className="rounded-lg border px-2 py-1 text-xs text-slate-700"
          >
            {hidden ? "Show" : "Hide"}
          </button>
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-200 ${bodyClasses}`}>
        <div
          className={expanded ? "h-full w-full" : "w-full p-3"}
          style={{
            visibility: hidden || minimized ? "hidden" : "visible",
          }}
        >
          <JitsiMeeting
            roomName={meeting.roomName}
            userName={meeting.userName}
            height={meetingHeight}
            isHost={Boolean(meeting.isHost)}
          />
        </div>
      </div>
    </div>
  );
}