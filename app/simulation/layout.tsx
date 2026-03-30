"use client";

import { usePathname } from "next/navigation";
import FloatingSessionMeeting from "@/app/components/floating-session-meeting";

export default function SimulationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const shouldShowMeeting =
    pathname.includes("/simulation/demo") ||
    pathname.includes("/simulation/session/") && pathname.includes("/lobby");

  return (
    <>
      {children}
      {shouldShowMeeting ? <FloatingSessionMeeting /> : null}
    </>
  );
}