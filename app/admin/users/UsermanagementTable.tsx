"use client";

import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { X, Pencil, Trash2, ShieldCheck, UserRound } from "lucide-react";

type UserRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

interface UsersManagementTableProps {
  users: UserRow[];
  currentUserId: string;
}

type EditFormState = {
  full_name: string;
  role: "admin" | "participant";
};

export default function UsersManagementTable({
  users,
  currentUserId,
}: UsersManagementTableProps) {
  const initialRows = useMemo(
    () =>
      [...users].sort((a, b) => {
        if (a.id === currentUserId) return -1;
        if (b.id === currentUserId) return 1;
        return 0;
      }),
    [users, currentUserId],
  );

  const [rows, setRows] = useState<UserRow[]>(initialRows);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    full_name: "",
    role: "participant",
  });

  const formatDate = (value?: string | null) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const sortRowsWithCurrentUserFirst = (data: UserRow[]) => {
    return [...data].sort((a, b) => {
      if (a.id === currentUserId) return -1;
      if (b.id === currentUserId) return 1;
      return 0;
    });
  };

  const getInitials = (user: UserRow) => {
    const source = user.full_name || user.email || "User";

    return source
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getRoleClass = (role?: string | null) => {
    if (role === "admin") {
      return "border-cyan-200 bg-cyan-50 text-cyan-700";
    }

    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  };

  const openEditModal = (user: UserRow) => {
    setEditingUser(user);
    setEditForm({
      full_name: user.full_name || "",
      role: user.role === "admin" ? "admin" : "participant",
    });
  };

  const closeEditModal = () => {
    if (loadingId) return;

    setEditingUser(null);
    setEditForm({
      full_name: "",
      role: "participant",
    });
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    const trimmedName = editForm.full_name.trim();

    if (!trimmedName) {
      await Swal.fire({
        icon: "warning",
        title: "Full name required",
        text: "Please enter the user's full name before saving.",
        confirmButtonColor: "#0891b2",
      });
      return;
    }

    setLoadingId(editingUser.id);

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: trimmedName,
          role: editForm.role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update user.");
      }

      setRows((prev) =>
        sortRowsWithCurrentUserFirst(
          prev.map((row) =>
            row.id === editingUser.id
              ? {
                  ...row,
                  full_name: trimmedName,
                  role: editForm.role,
                  updated_at: new Date().toISOString(),
                }
              : row,
          ),
        ),
      );

      setEditingUser(null);

      await Swal.fire({
        icon: "success",
        title: "User updated",
        text: "The user profile was updated successfully.",
        confirmButtonColor: "#0891b2",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Update failed",
        text: error instanceof Error ? error.message : "Something went wrong.",
        confirmButtonColor: "#0891b2",
      });
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (user: UserRow) => {
    if (user.id === currentUserId) {
      await Swal.fire({
        icon: "warning",
        title: "Not allowed",
        text: "You cannot delete your own account from here.",
        confirmButtonColor: "#0891b2",
      });
      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "Delete user?",
      text: `This will permanently delete ${
        user.email || "this user"
      } from auth and profiles.`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#0891b2",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setLoadingId(user.id);

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete user.");
      }

      setRows((prev) =>
        sortRowsWithCurrentUserFirst(prev.filter((row) => row.id !== user.id)),
      );

      await Swal.fire({
        icon: "success",
        title: "User deleted",
        text: "The account was deleted successfully.",
        confirmButtonColor: "#0891b2",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: error instanceof Error ? error.message : "Something went wrong.",
        confirmButtonColor: "#0891b2",
      });
    } finally {
      setLoadingId(null);
    }
  };

  if (!rows.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
        <p className="text-sm text-slate-600">No users found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Platform Users
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Manage user roles and account access for the simulation platform.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-white text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Created</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((user) => {
                const isCurrentUser = user.id === currentUserId;
                const isLoading = loadingId === user.id;

                return (
                  <tr
                    key={user.id}
                    className={`border-b last:border-b-0 ${
                      isCurrentUser ? "bg-cyan-50/60" : "bg-white"
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-start gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900">
                              {user.full_name || "Unnamed User"}
                            </p>

                            {isCurrentUser && (
                              <span className="rounded-full bg-cyan-200 px-2 py-0.5 text-xs font-bold text-cyan-800">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {user.email || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getRoleClass(
                          user.role,
                        )}`}
                      >
                        {user.role === "admin" ? (
                          <ShieldCheck className="h-3.5 w-3.5" />
                        ) : (
                          <UserRound className="h-3.5 w-3.5" />
                        )}
                        {user.role || "participant"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(user.created_at)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          disabled={isLoading}
                          className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-700 transition hover:bg-cyan-100 disabled:opacity-50"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(user)}
                          disabled={isLoading || isCurrentUser}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Edit User
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Update the user's display name and access role.
                </p>
              </div>

              <button
                onClick={closeEditModal}
                disabled={Boolean(loadingId)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 px-6 py-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  User email
                </p>
                <p className="mt-1 break-all text-sm font-medium text-slate-900">
                  {editingUser.email || "No email"}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Full name
                </label>
                <input
                  value={editForm.full_name}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      full_name: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Role
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() =>
                      setEditForm((prev) => ({
                        ...prev,
                        role: "participant",
                      }))
                    }
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      editForm.role === "participant"
                        ? "border-emerald-300 bg-emerald-50 ring-2 ring-emerald-100"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserRound className="h-5 w-5 text-emerald-600" />
                      <p className="font-semibold text-slate-900">
                        Participant
                      </p>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Can access and complete simulation exercises.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditForm((prev) => ({
                        ...prev,
                        role: "admin",
                      }))
                    }
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      editForm.role === "admin"
                        ? "border-cyan-300 bg-cyan-50 ring-2 ring-cyan-100"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-cyan-600" />
                      <p className="font-semibold text-slate-900">Admin</p>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Can manage scenarios, users, sessions, imports and
                      reports.
                    </p>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 px-6 py-5">
              <button
                onClick={closeEditModal}
                disabled={Boolean(loadingId)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateUser}
                disabled={loadingId === editingUser.id}
                className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
              >
                {loadingId === editingUser.id ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
