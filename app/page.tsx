import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Waves, ShieldAlert, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-cyan-100" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-300/20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-300/20 blur-3xl rounded-full" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <Badge className="px-4 py-1 rounded-full bg-blue-600 text-white">
            Aquatic Biosecurity Simulation
          </Badge>

          <h1 className="text-5xl font-semibold tracking-tight">
            Smart Emergency Simulation Platform
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Experience a realistic biosecurity emergency response scenario with
            structured phases, decision-making, and AI-powered feedback.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden rounded-2xl border-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 px-8 py-6 text-base font-medium text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-cyan-200"
            >
              <Link href="/scenario/invasive-mussel">
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

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/70 backdrop-blur-lg border rounded-2xl p-6 shadow-sm">
            <Waves className="mb-4 h-8 w-8 text-blue-600" />
            <h3 className="font-semibold text-lg">6 Phase Simulation</h3>
            <p className="text-sm text-slate-600 mt-2">
              Structured real-world emergency response phases.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-lg border rounded-2xl p-6 shadow-sm">
            <ShieldAlert className="mb-4 h-8 w-8 text-red-500" />
            <h3 className="font-semibold text-lg">Decision Impact</h3>
            <p className="text-sm text-slate-600 mt-2">
              Your choices affect outcomes and consequences.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-lg border rounded-2xl p-6 shadow-sm">
            <Sparkles className="mb-4 h-8 w-8 text-purple-500" />
            <h3 className="font-semibold text-lg">AI Feedback</h3>
            <p className="text-sm text-slate-600 mt-2">
              Get intelligent preparedness insights at the end.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
