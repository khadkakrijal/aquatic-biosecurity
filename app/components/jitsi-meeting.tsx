"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    JitsiMeetExternalAPI?: any;
  }
}

interface JitsiMeetingProps {
  roomName: string;
  userName: string;
  height?: number;
  onReady?: () => void;
  isHost?: boolean;
}

export default function JitsiMeeting({
  roomName,
  userName,
  height = 380,
  onReady,
  isHost = false,
}: JitsiMeetingProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<any>(null);

  useEffect(() => {
    let disposed = false;

    const closeMeetingBox = () => {
      localStorage.removeItem("active-simulation-meeting");
      window.dispatchEvent(new Event("active-simulation-meeting-changed"));
      window.dispatchEvent(new Event("force-close-simulation-meeting"));
    };

    const loadScript = () =>
      new Promise<void>((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve();
          return;
        }

        const existing = document.querySelector(
          'script[src="https://meet.jit.si/external_api.js"]',
        ) as HTMLScriptElement | null;

        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener(
            "error",
            () => reject(new Error("Failed to load Jitsi script")),
            { once: true },
          );
          return;
        }

        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Jitsi script"));
        document.body.appendChild(script);
      });

    const createMeeting = async () => {
      try {
        await loadScript();

        if (disposed || !containerRef.current || !window.JitsiMeetExternalAPI) {
          return;
        }

        if (apiRef.current) {
          apiRef.current.dispose?.();
          apiRef.current = null;
        }

        containerRef.current.innerHTML = "";

        const api = new window.JitsiMeetExternalAPI("meet.jit.si", {
          roomName,
          parentNode: containerRef.current,
          width: "100%",
          height,
          userInfo: {
            displayName: userName,
          },
          configOverwrite: {
            prejoinPageEnabled: false,
            enableWelcomePage: false,
            startWithAudioMuted: !isHost,
            startWithVideoMuted: !isHost,
            disableDeepLinking: true,
          },
          interfaceConfigOverwrite: {
            TILE_VIEW_MAX_COLUMNS: 3,
            TOOLBAR_BUTTONS: isHost
              ? [
                  "microphone",
                  "camera",
                  "desktop",
                  "fullscreen",
                  "hangup",
                  "settings",
                  "tileview",
                ]
              : ["fullscreen", "hangup"],
          },
        });

        api.addListener("videoConferenceLeft", () => {
          closeMeetingBox();
        });

        api.addListener("readyToClose", () => {
          closeMeetingBox();
        });

        api.addListener("videoConferenceJoined", () => {
          onReady?.();
        });

        apiRef.current = api;
      } catch (error) {
        console.error("Jitsi init error:", error);
      }
    };

    createMeeting();

    return () => {
      disposed = true;
      if (apiRef.current) {
        apiRef.current.dispose?.();
        apiRef.current = null;
      }
    };
  }, [roomName, userName, height, onReady, isHost]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden rounded-xl"
    />
  );
}
