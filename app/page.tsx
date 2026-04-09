import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Waves, ShieldAlert, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-cyan-100" />
      <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-blue-300/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="mb-16 space-y-6 text-center">
          <Badge className="rounded-full bg-blue-600 px-4 py-1 text-white">
            Aquatic Biosecurity Simulation
          </Badge>

          <h1 className="text-5xl font-semibold tracking-tight">
            Smart Emergency Simulation Platform
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Explore realistic aquatic biosecurity emergency scenarios through
            structured phases, free-text response, and AI-guided feedback.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden rounded-2xl border-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 px-8 py-6 text-base font-medium text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-cyan-200"
            >
              <Link href="/scenario">
                <span className="relative z-10 flex items-center gap-2">
                  Start Simulation
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
                <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-2xl border-slate-300 bg-white/70 px-8 py-6 text-base font-medium shadow-sm backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-md"
            >
              <Link href="/admin">Admin View</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-white/70 p-6 shadow-sm backdrop-blur-lg">
            <Waves className="mb-4 h-8 w-8 text-blue-600" />
            <h3 className="text-lg font-semibold">Structured Phase Flow</h3>
            <p className="mt-2 text-sm text-slate-600">
              Progress through realistic multi-phase aquatic emergency scenarios.
            </p>
          </div>

          <div className="rounded-2xl border bg-white/70 p-6 shadow-sm backdrop-blur-lg">
            <ShieldAlert className="mb-4 h-8 w-8 text-red-500" />
            <h3 className="text-lg font-semibold">Adaptive Pathways</h3>
            <p className="mt-2 text-sm text-slate-600">
              Your responses shape what happens next, including escalation and
              recovery pathways.
            </p>
          </div>

          <div className="rounded-2xl border bg-white/70 p-6 shadow-sm backdrop-blur-lg">
            <Sparkles className="mb-4 h-8 w-8 text-purple-500" />
            <h3 className="text-lg font-semibold">AI Phase Feedback</h3>
            <p className="mt-2 text-sm text-slate-600">
              Receive guided feedback on each phase based on key operational themes.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}