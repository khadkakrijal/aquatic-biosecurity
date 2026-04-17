import Link from "next/link";
import { LayoutDashboard, FolderKanban, Users,File } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LogoutButton from "@/app/components/simulation/log-outButton";

interface AdminSidebarProps {
  userEmail?: string;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Scenarios",
    href: "/admin/scenarios",
    icon: FolderKanban,
  },
  {
    label: "Sessions",
    href: "/admin/session/create",
    icon: Users,
  },
  {
    label: "Import Scenario",
    href: "/admin/import",
    icon: File,
  },
];

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  return (
    <aside className="w-full border-r bg-white lg:w-72">
      <div className="flex h-full flex-col">
        <div className="border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-600 text-white font-bold">
              A
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Admin Panel
              </h2>
              <p className="text-sm text-slate-500">Biosecurity Simulation</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-5">
          <Badge className="bg-cyan-600 text-white">Management</Badge>
        </div>

        <nav className="flex-1 space-y-2 px-3 pb-6">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t px-4 py-4">
          <div className="mb-4 rounded-2xl bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-500">Signed in as</p>
            <p className="mt-1 break-all text-sm text-slate-800">
              {userEmail || "Admin user"}
            </p>
          </div>

          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
