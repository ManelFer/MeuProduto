import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-gray via-white to-pastel-lavender/20 flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 p-6">
        {children}
      </main>
    </div>
  );
}
