import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <Badge className="bg-cyan-600 text-white">Admin Dashboard</Badge>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">
          Manage your simulation platform
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Create and manage aquatic biosecurity scenarios, edit branching stages,
          and manage shared simulation sessions from one place.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Scenario Management</CardTitle>
              <Badge variant="outline">Admin</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Create new scenarios, add stages, questions, criteria, and
              branching logic for each phase.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/admin/scenarios">
                <Button className="bg-cyan-600 text-white hover:bg-cyan-700">
                  Manage Scenarios
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Simulation Sessions</CardTitle>
              <Badge variant="outline">Multi-user</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Create a shared simulation session or join an existing one.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/admin/session/create">
                <Button className="bg-cyan-600 text-white hover:bg-cyan-700">
                  Create Session
                </Button>
              </Link>

              <Link href="/simulation/session/join">
                <Button variant="outline">Join Session</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}