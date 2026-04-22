"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

type HomeUserMenuProps = {
  email: string;
  fullName?: string | null;
  role?: string | null;
};

export default function HomeUserMenu({
  email,
  fullName,
  role,
}: HomeUserMenuProps) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = fullName?.trim() || email;
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const isAdmin = role === "admin";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "Sign out?",
      text: "You will need to log in again to access your account.",
      showCancelButton: true,
      confirmButtonText: "Sign out",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#0891b2",
      background: "#0f172a",
      color: "#ffffff",
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase.auth.signOut();

    if (error) {
      await Swal.fire({
        icon: "error",
        title: "Sign out failed",
        text: error.message,
        confirmButtonColor: "#0891b2",
        background: "#0f172a",
        color: "#ffffff",
      });
      return;
    }

    await Swal.fire({
      icon: "success",
      title: "Signed out",
      timer: 1000,
      showConfirmButton: false,
      background: "#0f172a",
      color: "#ffffff",
    });

    router.push("/");
    router.refresh();
  };

  const handleAdminPanel = () => {
    setOpen(false);
    router.push("/admin");
  };

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-200/60 bg-slate-900/70 text-sm font-semibold text-white shadow-lg shadow-black/30 backdrop-blur-md transition hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-cyan-300/60"
        aria-label="Open profile menu"
      >
        {avatarLetter}
      </button>

      {open && (
        <div className="absolute right-0  z-[100] w-80 rounded-3xl bg-cyan-600 p-4 shadow-2xl shadow-black/40">
          <div className="rounded-2xl  p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-base font-semibold text-white shadow-md">
                {/* {avatarLetter} */}
              </div>

              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-300">
                  Signed in as
                </p>
                <p className="mt-1 truncate text-base font-semibold text-white">
                  {displayName}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl px-3 py-2">
              <p className="text-xs text-slate-300">Email</p>
              <p className="mt-1 break-words text-sm text-white">{email}</p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={handleAdminPanel}
              className="mt-4 w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-red-500"
            >
              Admin Panel
            </button>
          )}

          <button
            onClick={handleSignOut}
            className="mt-4 w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-red-500"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}