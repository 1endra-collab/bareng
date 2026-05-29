"use client";

import { Bell } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold">
          Perizinan Device & Lab-Kom
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Bell className="cursor-pointer" />

        <UserButton />
      </div>
    </header>
  );
}