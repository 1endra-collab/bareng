"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ClipboardList,
  History,
  Shield,
  LogOut,
  Monitor,
  ShieldCheck, 
} from "lucide-react";

import { SignOutButton } from "@clerk/nextjs";

const userMenus = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Ajukan Peminjaman",
    href: "/pengajuan",
    icon: ClipboardList,
  },
  {
    name: "Riwayat Peminjaman",
    href: "/riwayat",
    icon: History,
  },
  {
    name: "Peraturan",
    href: "/peraturan",
    icon: Shield,
  },
  {
    name: "Device",
    href: "/device",
    icon: Monitor,
  },
];

const adminMenus = [
  {
    name: "Approval",
    href: "/approval",
    icon: ShieldCheck,
  },
    {
    name: "Riwayat Semua",
    href: "/riwayat-admin",
    icon: History,
  },
];

export default function Sidebar({
  role,
}: {
  role: string;
}) {
  const pathname = usePathname();

  const menus =
    role === "admin"
      ? [...userMenus, ...adminMenus]
      : userMenus;

  return (
    <aside className="w-65 border-r bg-white p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">
          Device & Lab-Kom
        </h1>
      </div>

      <nav className="space-y-2">
        {menus.map((menu) => {
          const Icon = menu.icon;

          const active = pathname === menu.href;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                active
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <Icon size={20} />
              {menu.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10">
        <SignOutButton redirectUrl="/sign-in">
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-500 hover:bg-red-50">
            <LogOut size={20} />
            Logout
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}