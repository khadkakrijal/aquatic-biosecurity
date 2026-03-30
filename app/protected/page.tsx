import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Protected Page</h1>
      <p className="mt-2">Logged in as {user.email}</p>
      <p className="mt-2 text-sm text-slate-600">User ID: {user.id}</p>
    </main>
  );
}