"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface DashboardUserMenuProps {
  fullName: string;
  email: string;
  role: string;
}

export default function DashboardUserMenu({
  fullName,
  email,
  role,
}: DashboardUserMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials =
    fullName
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
      >
        {initials}
      </button>

      {open ? (
        <div className="absolute right-0 top-14 z-50 w-72 rounded-2xl border border-white/15 bg-slate-950/90 p-4 text-white shadow-2xl backdrop-blur-xl">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">{fullName}</p>
            <p className="mt-1 break-all text-xs text-slate-300">{email}</p>
            <p className="mt-3 inline-flex rounded-full bg-cyan-400/10 px-3 py-1 text-xs capitalize text-cyan-200">
              {role}
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <button
              onClick={() => {
                setOpen(false);
                router.push("/dashboard");
              }}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-left text-sm text-white transition hover:bg-white/10"
            >
              My Dashboard
            </button>

            <button
              onClick={handleSignOut}
              className="w-full rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-left text-sm text-red-200 transition hover:bg-red-400/20"
            >
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}