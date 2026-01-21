import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import AddUserForm from "@/components/AddUserForm";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Usuários</h1>

      <AddUserForm />

      <div className="bg-white rounded-2xl shadow-pastel overflow-hidden border border-soft-border">
        <h2 className="px-6 py-4 text-lg font-medium text-gray-800 border-b border-soft-border">
          Usuários com acesso
        </h2>
        <table className="min-w-full divide-y divide-soft-border">
          <thead className="bg-soft-gray">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Perfil
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Cadastrado em
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-soft-border">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-soft-gray/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                  {u.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {u.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      u.role === "ADMIN" ? "bg-pastel-lavender text-gray-800" : "bg-soft-gray text-gray-700"
                    }`}
                  >
                    {u.role === "ADMIN" ? "Administrador" : "Usuário"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {format(new Date(u.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
