"use client";

interface SessionInviteCardProps {
  sessionCode: string;
}

export default function SessionInviteCard({
  sessionCode,
}: SessionInviteCardProps) {
  const invitePath = `/simulation/session/${sessionCode}/invite`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${invitePath}`
      );
    } catch (error) {
      console.error("Failed to copy invite link:", error);
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Invite link</h3>
      <p className="mt-1 text-sm text-slate-600">
        Share this invite link with participants.
      </p>

      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs break-all text-slate-700">
        {invitePath}
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="mt-4 rounded-2xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
      >
        Copy Full Invite Link
      </button>
    </div>
  );
}