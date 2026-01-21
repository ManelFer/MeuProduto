import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export default async function SalesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const sales = await prisma.sale.findMany({
    include: { client: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-semibold text-gray-800">Vendas</h1>
        <Link
          href="/dashboard/sales/new"
          className="px-6 py-3 rounded-xl bg-pastel-green text-gray-900 hover:bg-pastel-green-hover transition-all font-medium shadow-pastel w-fit"
        >
          Nova venda
        </Link>
      </div>

      

      <div className="bg-white rounded-2xl shadow-pastel overflow-hidden border border-soft-border">
        <h2 className="px-6 py-4 text-lg font-medium text-gray-800 border-b border-soft-border">
          Últimas vendas
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-soft-border">
            <thead className="bg-soft-gray">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Nº</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Data</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Cliente</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft-border">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma venda registrada
                  </td>
                </tr>
              ) : (
                sales.map((s) => (
                  <tr key={s.id} className="hover:bg-soft-gray/50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{s.saleNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {format(s.createdAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{s.client?.name || "—"}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 text-right">
                      R$ {s.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
