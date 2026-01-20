"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import OrderStatusManager from "@/components/OrderStatusManager";

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
  document: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  category: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  product: Product | null;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  clientId: string;
  client: Client;
  orderNumber: string;
  status: string;
  description: string | null;
  items: OrderItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  signedAt: Date | null;
  signedBy: string | null;
}

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusLabels: Record<string, string> = {
    PENDING: "Pendente",
    IN_PROGRESS: "Em Andamento",
    COMPLETED: "Concluída",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelada",
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${params.id}`);
        if (!response.ok) {
          throw new Error("Ordem não encontrada");
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar ordem");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  const handleStatusChange = async (newStatus: string) => {
    if (order) {
      setOrder({
        ...order,
        status: newStatus,
      });
    }
  };

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>;
  }

  if (error || !order) {
    return <div className="text-center py-12 text-red-600">{error || "Ordem não encontrada"}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Ordem de Serviço {order.orderNumber}
        </h1>
        <Link
          href={`/dashboard/orders/${order.id}/print`}
          target="_blank"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Imprimir
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Cliente</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Nome:</span> {order.client.name}</p>
              {order.client.email && (
                <p><span className="font-medium">Email:</span> {order.client.email}</p>
              )}
              {order.client.phone && (
                <p><span className="font-medium">Telefone:</span> {order.client.phone}</p>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações da Ordem</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Número:</span> {order.orderNumber}</p>
              <p><span className="font-medium">Data:</span>{" "}
                {format(new Date(order.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
              <p><span className="font-medium">Valor Total:</span> R$ {order.totalAmount.toFixed(2)}</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Gerenciar Status</h2>
            <OrderStatusManager
              orderId={order.id}
              currentStatus={order.status}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>

        {order.description && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h2>
            <p className="text-sm text-gray-700">{order.description}</p>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Itens</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Preço Unitário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {item.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    R$ {item.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                  Total:
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  R$ {order.totalAmount.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
