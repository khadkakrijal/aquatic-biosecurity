import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UsersManagementTable from "./UsermanagementTable";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin/users");
  }

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (adminProfile?.role !== "admin") {
    redirect("/");
  }

  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at, updated_at")
    .order("created_at", { ascending: false });

    console.log(users,"user from supabase")

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">Users</h1>
          <p className="mt-2 text-slate-600">
            Manage user profiles, roles, and account access.
          </p>
        </div>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-red-600">Failed to load users.</p>
            ) : (
              <UsersManagementTable users={users || []} currentUserId={user.id} />
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}