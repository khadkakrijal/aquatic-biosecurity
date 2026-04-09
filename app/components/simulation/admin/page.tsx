import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LogoutButton from "../log-outButton";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600">Welcome, {user.email}</p>
          </div>

          <LogoutButton />
        </div>

        <Card className="rounded-3xl">
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
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
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
    </main>
  );
}