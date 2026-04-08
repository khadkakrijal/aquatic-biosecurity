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
  const currentRoomRef = useRef<string>("");
  const currentUserRef = useRef<string>("");
  const currentRoleRef = useRef<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.style.width = "100%";
    container.style.height = `${height}px`;

    const iframe = container.querySelector("iframe") as HTMLIFrameElement | null;
    if (iframe) {
      iframe.style.width = "100%";
      iframe.style.height = `${height}px`;
    }

    apiRef.current?.resizeLargeVideo?.();
  }, [height]);

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
          'script[src="https://meet.jit.si/external_api.js"]'
        ) as HTMLScriptElement | null;

        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener(
            "error",
            () => reject(new Error("Failed to load Jitsi script")),
            { once: true }
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

    const createOrReuseMeeting = async () => {
      try {
        await loadScript();

        if (disposed || !containerRef.current || !window.JitsiMeetExternalAPI) {
          return;
        }

        const sameRoom = currentRoomRef.current === roomName;
        const sameUser = currentUserRef.current === userName;
        const sameRole = currentRoleRef.current === isHost;

        if (apiRef.current && sameRoom && sameUser && sameRole) {
          onReady?.();
          return;
        }

        if (apiRef.current) {
          apiRef.current.dispose?.();
          apiRef.current = null;
          containerRef.current.innerHTML = "";
        }

        containerRef.current.style.width = "100%";
        containerRef.current.style.height = `${height}px`;

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
        currentRoomRef.current = roomName;
        currentUserRef.current = userName;
        currentRoleRef.current = isHost;
      } catch (error) {
        console.error("Jitsi init error:", error);
      }
    };

    createOrReuseMeeting();

    return () => {
      disposed = true;
    };
  }, [roomName, userName, isHost, onReady, height]);

  useEffect(() => {
    return () => {
      apiRef.current?.dispose?.();
      apiRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full overflow-hidden" />;
}