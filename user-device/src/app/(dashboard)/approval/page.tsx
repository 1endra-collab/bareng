import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ApprovalList from "@/components/ApprovalList";

export default async function ApprovalPage() {
  const { userId } = await auth();

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId!,
    },
  });

  if (user?.role !== "admin") {
    redirect("/dashboard");
  }

  const pengajuan = await prisma.peminjaman.findMany({
    where: {
      status: "pending",
    },
    include: {
      user: true,
      device: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">
        Approval Pengajuan
      </h1>

      {/* Alirkan data database ke komponen interaktif antispam */}
      <ApprovalList pengajuan={pengajuan} />
    </div>
  );
}
