import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import "@/app/globals.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const pendingCount = await prisma.commande.count({
    where: { statut: "EN_ATTENTE" },
  });

  return (
    <html lang="fr">
      <body>
        <AdminShell
          adminName={session.user?.name || "Admin"}
          adminRole="Concierge en chef"
          pendingCount={pendingCount}
        >
          {children}
        </AdminShell>
      </body>
    </html>
  );
}
