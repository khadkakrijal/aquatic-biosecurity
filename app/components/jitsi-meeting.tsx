"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
    __simulationJitsi?: {
      api: any | null;
      roomName: string;
      userName: string;
      hostNode: HTMLDivElement | null;
      parkingNode: HTMLDivElement | null;
    };
  }
}

interface JitsiMeetingProps {
  roomName: string;
  userName: string;
  height?: number;
  onReady?: () => void;
}

export default function JitsiMeeting({
  roomName,
  userName,
  height = 260,
  onReady,
}: JitsiMeetingProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const closeMeetingBox = () => {
      localStorage.removeItem("active-simulation-meeting");
      window.dispatchEvent(new Event("active-simulation-meeting-changed"));
      window.dispatchEvent(new Event("force-close-simulation-meeting"));
    };

    const getStore = () => {
      if (!window.__simulationJitsi) {
        const parkingNode = document.createElement("div");
        parkingNode.id = "jitsi-parking-node";
        parkingNode.style.display = "none";
        document.body.appendChild(parkingNode);

        const hostNode = document.createElement("div");
        hostNode.style.width = "100%";
        hostNode.style.height = `${height}px`;

        window.__simulationJitsi = {
          api: null,
          roomName: "",
          userName: "",
          hostNode,
          parkingNode,
        };
      }

      return window.__simulationJitsi;
    };

    const attachHostNode = () => {
      const store = getStore();
      if (!containerRef.current || !store.hostNode) return;

      store.hostNode.style.width = "100%";
      store.hostNode.style.height = `${height}px`;

      if (store.hostNode.parentElement !== containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(store.hostNode);
      }
    };

    const bindMeetingEvents = (api: any) => {
      api.addListener("videoConferenceLeft", () => {
        closeMeetingBox();
      });

      api.addListener("readyToClose", () => {
        closeMeetingBox();
      });
    };

    const createMeeting = () => {
      if (cancelled || !window.JitsiMeetExternalAPI) return;

      const store = getStore();
      attachHostNode();

      const roomChanged = store.roomName !== roomName;
      const userChanged = store.userName !== userName;

      if (store.api && !roomChanged && !userChanged) {
        onReady?.();
        return;
      }

      if (store.api && (roomChanged || userChanged)) {
        store.api.dispose?.();
        store.api = null;
      }

      store.roomName = roomName;
      store.userName = userName;

      if (!store.api && store.hostNode) {
        store.api = new window.JitsiMeetExternalAPI("meet.jit.si", {
          roomName,
          parentNode: store.hostNode,
          width: "100%",
          height,
          userInfo: {
            displayName: userName,
          },
          configOverwrite: {
            prejoinPageEnabled: false,
            enableWelcomePage: false,
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            disableDeepLinking: true,
          },
          interfaceConfigOverwrite: {
            TILE_VIEW_MAX_COLUMNS: 3,
          },
        });

        bindMeetingEvents(store.api);
      }

      onReady?.();
    };

    const existingScript = document.querySelector(
      'script[src="https://meet.jit.si/external_api.js"]'
    ) as HTMLScriptElement | null;

    if (window.JitsiMeetExternalAPI) {
      createMeeting();
    } else if (existingScript) {
      existingScript.addEventListener("load", createMeeting, { once: true });
    } else {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = createMeeting;
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;

      const store = window.__simulationJitsi;
      if (!store?.hostNode || !store?.parkingNode) return;

      if (store.hostNode.parentElement !== store.parkingNode) {
        store.parkingNode.appendChild(store.hostNode);
      }
    };
  }, [roomName, userName, height, onReady]);

  return <div ref={containerRef} className="w-full overflow-hidden rounded-xl" />;
}