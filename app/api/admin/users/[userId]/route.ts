import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";

interface RouteParams {
  params: Promise<{
    userId: string;
  }>;
}

async function checkAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated.", status: 401, user: null };
  }

  const { data: currentProfile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || currentProfile?.role !== "admin") {
    return { error: "Admin access required.", status: 403, user: null };
  }

  return { error: null, status: 200, user };
}

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin environment variables.");
  }

  return createSupabaseAdminClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await params;
    const body = await req.json();

    const fullName =
      typeof body.full_name === "string" ? body.full_name.trim() : "";
    const role = body.role;

    if (!fullName) {
      return NextResponse.json(
        { error: "Full name is required." },
        { status: 400 },
      );
    }

    if (!["admin", "participant"].includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    const adminCheck = await checkAdmin();

    if (adminCheck.error) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status },
      );
    }

    const supabase = await createClient();

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update user." },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await params;

    const adminCheck = await checkAdmin();

    if (adminCheck.error) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status },
      );
    }

    if (adminCheck.user?.id === userId) {
      return NextResponse.json(
        { error: "You cannot delete your own account." },
        { status: 400 },
      );
    }

    const adminSupabase = createAdminClient();

    await adminSupabase
      .from("simulation_stage_attempts")
      .delete()
      .eq("user_id", userId);

    await adminSupabase
      .from("simulation_attempts")
      .delete()
      .eq("user_id", userId);

    await adminSupabase.from("profiles").delete().eq("id", userId);

    const { error: deleteAuthError } =
      await adminSupabase.auth.admin.deleteUser(userId);

    if (deleteAuthError) {
      return NextResponse.json(
        { error: deleteAuthError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete user." },
      { status: 500 },
    );
  }
}