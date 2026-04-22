"use client";

import { useMemo, useState } from "react";
import Swal from "sweetalert2";

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

  const handleEdit = async (user: UserRow) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit User",
      html: `
        <input
          id="swal-fullname"
          class="swal2-input"
          placeholder="Full name"
          value="${user.full_name || ""}"
        />
        <select id="swal-role" class="swal2-input">
          <option value="participant" ${
            user.role === "participant" ? "selected" : ""
          }>Participant</option>
          <option value="admin" ${
            user.role === "admin" ? "selected" : ""
          }>Admin</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save",
      confirmButtonColor: "#0891b2",
      preConfirm: () => {
        const fullName = (
          document.getElementById("swal-fullname") as HTMLInputElement | null
        )?.value;
        const role = (
          document.getElementById("swal-role") as HTMLSelectElement | null
        )?.value;

        return {
          full_name: fullName?.trim() || "",
          role: role || "participant",
        };
      },
    });

    if (!formValues) return;

    setLoadingId(user.id);

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update user.");
      }

      setRows((prev) =>
        sortRowsWithCurrentUserFirst(
          prev.map((row) =>
            row.id === user.id
              ? {
                  ...row,
                  full_name: formValues.full_name,
                  role: formValues.role,
                }
              : row,
          ),
        ),
      );

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
      text: `This will permanently delete ${user.email || "this user"} from auth and profiles.`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#0891b2",
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
    return <p className="text-slate-600">No users found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b text-slate-500">
            <th className="px-4 py-3">Full Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((user) => (
            <tr
              key={user.id}
              className={`border-b ${
                user.id === currentUserId ? "bg-cyan-50/60" : ""
              }`}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span>{user.full_name || "-"}</span>
                  {user.id === currentUserId && (
                    <span className="rounded-full bg-cyan-200 px-2 py-0.5 text-xs font-bold text-cyan-700">
                      You
                    </span>
                  )}
                </div>
              </td>

              <td className="px-4 py-3">{user.email || "-"}</td>

              <td className="px-4 py-3 capitalize">{user.role || "-"}</td>

              <td className="px-4 py-3">{formatDate(user.created_at)}</td>

              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    disabled={loadingId === user.id}
                    className="rounded-xl bg-cyan-600 px-3 py-2 text-white transition hover:bg-cyan-700 disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(user)}
                    disabled={loadingId === user.id}
                    className="rounded-xl bg-red-600 px-3 py-2 text-white transition hover:bg-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
