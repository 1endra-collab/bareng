import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId!,
    },
  });

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <Sidebar role={user?.role ?? "user"} />

      <div className="flex-1">
        <Navbar />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}