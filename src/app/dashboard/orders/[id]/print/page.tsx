import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export default async function PrintOrderPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const statusLabels: Record<string, string> = {
    PENDING: "Pendente",
    IN_PROGRESS: "Em Andamento",
    COMPLETED: "Concluída",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelada",
  };

  return (
    <div className="min-h-screen bg-white p-8 print:p-4">
      <style jsx>{`
        @media print {
          .no-print {
            display: none;
          }
          body {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
      
      <div className="no-print mb-4">
        <button
          onClick={() => window.print()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Imprimir
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="border-b-2 border-gray-900 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            ORDEM DE SERVIÇO
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Nº {order.orderNumber}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2 underline">
              DADOS DO CLIENTE
            </h2>
            <div className="space-y-1 text-sm">
              <p><strong>Nome:</strong> {order.client.name}</p>
              {order.client.email && (
                <p><strong>Email:</strong> {order.client.email}</p>
              )}
              {order.client.phone && (
                <p><strong>Telefone:</strong> {order.client.phone}</p>
              )}
              {order.client.document && (
                <p><strong>CPF/CNPJ:</strong> {order.client.document}</p>
              )}
              {order.client.address && (
                <p><strong>Endereço:</strong> {order.client.address}</p>
              )}
              {(order.client.city || order.client.state) && (
                <p>
                  <strong>Cidade/Estado:</strong>{" "}
                  {order.client.city || ""}
                  {order.client.city && order.client.state ? " / " : ""}
                  {order.client.state || ""}
                </p>
              )}
              {order.client.zipCode && (
                <p><strong>CEP:</strong> {order.client.zipCode}</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2 underline">
              DADOS DA ORDEM
            </h2>
            <div className="space-y-1 text-sm">
              <p><strong>Data:</strong>{" "}
                {format(new Date(order.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
              <p><strong>Status:</strong> {statusLabels[order.status]}</p>
            </div>
          </div>
        </div>

        {order.description && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2 underline">
              DESCRIÇÃO DO SERVIÇO
            </h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.description}</p>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 underline">
            ITENS/SERVIÇOS
          </h2>
          <table className="w-full border-collapse border border-gray-900">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-900 px-4 py-2 text-left text-sm font-bold">
                  Descrição
                </th>
                <th className="border border-gray-900 px-4 py-2 text-center text-sm font-bold">
                  Qtd
                </th>
                <th className="border border-gray-900 px-4 py-2 text-right text-sm font-bold">
                  Preço Unit.
                </th>
                <th className="border border-gray-900 px-4 py-2 text-right text-sm font-bold">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="border border-gray-900 px-4 py-2 text-sm">
                    {item.description}
                  </td>
                  <td className="border border-gray-900 px-4 py-2 text-center text-sm">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-900 px-4 py-2 text-right text-sm">
                    R$ {item.unitPrice.toFixed(2)}
                  </td>
                  <td className="border border-gray-900 px-4 py-2 text-right text-sm">
                    R$ {item.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td colSpan={3} className="border border-gray-900 px-4 py-2 text-right">
                  TOTAL:
                </td>
                <td className="border border-gray-900 px-4 py-2 text-right">
                  R$ {order.totalAmount.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-16 space-y-8">
          <div className="border-t-2 border-gray-900 pt-4">
            <p className="text-sm text-center mb-8">
              _______________________________________
            </p>
            <p className="text-sm text-center font-bold">
              ASSINATURA DO CLIENTE
            </p>
          </div>

          <div className="border-t-2 border-gray-900 pt-4">
            <p className="text-sm text-center mb-8">
              _______________________________________
            </p>
            <p className="text-sm text-center font-bold">
              ASSINATURA DO RESPONSÁVEL
            </p>
          </div>
        </div>

        {order.signedAt && (
          <div className="mt-8 text-xs text-gray-600">
            <p>Assinado em: {format(new Date(order.signedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
            {order.signedBy && <p>Por: {order.signedBy}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
