import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      client: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const statusLabels: Record<string, string> = {
    PENDING: "Pendente",
    IN_PROGRESS: "Em Andamento",
    COMPLETED: "Concluída",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelada",
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-pastel-yellow text-gray-800",
    IN_PROGRESS: "bg-pastel-blue text-gray-800",
    COMPLETED: "bg-pastel-green text-gray-800",
    DELIVERED: "bg-soft-gray text-gray-800",
    CANCELLED: "bg-pastel-pink text-gray-800",
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800">Ordens de Serviço</h1>
        <Link
          href="/dashboard/orders/new"
          className="px-6 py-3 rounded-xl bg-pastel-orange text-gray-900 hover:bg-pastel-orange-hover transition-all font-medium shadow-pastel"
        >
          Nova Ordem
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-pastel overflow-hidden border border-soft-border">
        <table className="min-w-full divide-y divide-soft-border">
          <thead className="bg-soft-gray">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Número
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Valor Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-soft-border">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Nenhuma ordem de serviço cadastrada
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-soft-gray/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.client.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[order.status]
                      }`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    R$ {order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {format(new Date(order.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="text-pastel-lavender-dark hover:text-gray-900 transition-colors"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/dashboard/orders/${order.id}/print`}
                      className="text-pastel-green-hover hover:text-gray-900 transition-colors"
                      target="_blank"
                    >
                      Imprimir
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
