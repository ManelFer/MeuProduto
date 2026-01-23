"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  document: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
}

interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Sale {
  id: string;
  saleNumber: string;
  clientId: string | null;
  client: Client | null;
  items: SaleItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function SaleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/sales/${params.id}`);
        if (!response.ok) {
          throw new Error("Venda não encontrada");
        }
        const data = await response.json();
        setSale(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar venda");
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [params.id]);

  if (loading) {
    return (
      <div className="text-center py-12 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-soft-gray rounded w-1/3 mx-auto" />
          <div className="h-64 bg-soft-gray rounded" />
        </div>
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div className="text-center py-12 p-6">
        <div className="text-red-600 mb-4">{error || "Venda não encontrada"}</div>
        <Link
          href="/dashboard/sales"
          className="text-pastel-lavender-dark hover:text-gray-900 transition-colors"
        >
          Voltar para vendas
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800">
          Venda {sale.saleNumber}
        </h1>
        <Link
          href={`/dashboard/sales/${sale.id}/print`}
          target="_blank"
          className="px-6 py-3 rounded-xl bg-pastel-green text-gray-900 hover:bg-pastel-green-hover transition-all font-medium shadow-pastel"
        >
          Imprimir
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-pastel border border-soft-border p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sale.client && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações do Cliente</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium text-gray-700">Nome:</span>{" "}
                  <span className="text-gray-800">{sale.client.name}</span>
                </p>
                {sale.client.email && (
                  <p>
                    <span className="font-medium text-gray-700">Email:</span>{" "}
                    <span className="text-gray-800">{sale.client.email}</span>
                  </p>
                )}
                {sale.client.phone && (
                  <p>
                    <span className="font-medium text-gray-700">Telefone:</span>{" "}
                    <span className="text-gray-800">{sale.client.phone}</span>
                  </p>
                )}
                {sale.client.document && (
                  <p>
                    <span className="font-medium text-gray-700">CPF/CNPJ:</span>{" "}
                    <span className="text-gray-800">{sale.client.document}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações da Venda</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium text-gray-700">Número:</span>{" "}
                <span className="text-gray-800">{sale.saleNumber}</span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Data:</span>{" "}
                <span className="text-gray-800">
                  {format(new Date(sale.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Valor Total:</span>{" "}
                <span className="text-gray-800 font-semibold text-lg">
                  R$ {sale.totalAmount.toFixed(2)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Itens da Venda</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-soft-border">
              <thead className="bg-soft-gray">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Preço Unitário
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-soft-border">
                {sale.items.map((item) => (
                  <tr key={item.id} className="hover:bg-soft-gray/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {item.product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                      R$ {item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 text-right">
                      R$ {item.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-soft-gray">
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-right text-sm font-semibold text-gray-800">
                    Total:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 text-right">
                    R$ {sale.totalAmount.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          href="/dashboard/sales"
          className="px-6 py-3 rounded-xl border border-soft-border text-gray-700 bg-white hover:bg-soft-gray transition-all font-medium"
        >
          Voltar para vendas
        </Link>
      </div>
    </div>
  );
}
