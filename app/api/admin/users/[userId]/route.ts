import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

interface RouteParams {
  params: Promise<{
    userId: string;
  }>;
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

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 },
      );
    }

    const { data: currentProfile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || currentProfile?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 },
      );
    }

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