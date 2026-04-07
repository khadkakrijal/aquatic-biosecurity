"use client";

import { useState } from "react";

interface SessionInviteCardProps {
  sessionCode: string;
}

export default function SessionInviteCard({
  sessionCode,
}: SessionInviteCardProps) {
  const [copied, setCopied] = useState(false);

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/simulation/session/${sessionCode}/invite`
      : `/simulation/session/${sessionCode}/invite`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy invite link error:", error);
      alert("Failed to copy invite link.");
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-900">Invite Participants</h3>
      <p className="mt-2 text-sm text-slate-600">
        Share this link with participants. After login, they will be added to
        the session automatically.
      </p>

      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs break-all text-slate-700">
        {inviteUrl}
      </div>

      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-2xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
        >
          {copied ? "Copied!" : "Copy Invite Link"}
        </button>
      </div>
    </div>
  );
}