"use client";

import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

type Props = {
  isLoggedIn: boolean;
};

export default function StartSimulationButton({ isLoggedIn }: Props) {
  const router = useRouter();

  const handleClick = async () => {
    if (!isLoggedIn) {
      await Swal.fire({
        icon: "warning",
        title: "Login required",
        text: "Please login first to start the simulation.",
        confirmButtonText: "Go to Login",
        confirmButtonColor: "#0891b2",
        background: "#0f172a",
        color: "#ffffff",
      });

      router.push("/login?next=/scenario");
      return;
    }

    router.push("/scenario");
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-500"
    >
      Start Simulation
    </button>
  );
}