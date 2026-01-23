"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function PrintSalePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await fetch(`/api/sales/${params.id}`);
        if (!response.ok) {
          router.push("/dashboard/sales");
          return;
        }
        const data = await response.json();
        setSale(data);
      } catch (error) {
        console.error("Erro ao buscar venda:", error);
        router.push("/dashboard/sales");
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [params.id, router]);

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  if (!sale) {
    return <div className="p-8">Venda não encontrada</div>;
  }

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
          className="px-6 py-3 rounded-xl bg-pastel-green text-gray-900 hover:bg-pastel-green-hover transition-all font-medium shadow-pastel"
        >
          Imprimir
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="border-b-2 border-gray-900 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            NOTA DE VENDA
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Nº {sale.saleNumber}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          {sale.client && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2 underline">
                DADOS DO CLIENTE
              </h2>
              <div className="space-y-1 text-sm">
                <p><strong>Nome:</strong> {sale.client.name}</p>
                {sale.client.email && (
                  <p><strong>Email:</strong> {sale.client.email}</p>
                )}
                {sale.client.phone && (
                  <p><strong>Telefone:</strong> {sale.client.phone}</p>
                )}
                {sale.client.document && (
                  <p><strong>CPF/CNPJ:</strong> {sale.client.document}</p>
                )}
                {sale.client.address && (
                  <p><strong>Endereço:</strong> {sale.client.address}</p>
                )}
                {(sale.client.city || sale.client.state) && (
                  <p>
                    <strong>Cidade/Estado:</strong>{" "}
                    {sale.client.city || ""}
                    {sale.client.city && sale.client.state ? " / " : ""}
                    {sale.client.state || ""}
                  </p>
                )}
                {sale.client.zipCode && (
                  <p><strong>CEP:</strong> {sale.client.zipCode}</p>
                )}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2 underline">
              DADOS DA VENDA
            </h2>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Data:</strong>{" "}
                {format(new Date(sale.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
              <p>
                <strong>Número:</strong> {sale.saleNumber}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 underline">
            PRODUTOS VENDIDOS
          </h2>
          <table className="w-full border-collapse border border-gray-900">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-900 px-4 py-2 text-left text-sm font-bold">
                  Produto
                </th>
                <th className="border border-gray-900 px-4 py-2 text-left text-sm font-bold">
                  SKU
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
              {sale.items.map((item) => (
                <tr key={item.id}>
                  <td className="border border-gray-900 px-4 py-2 text-sm">
                    {item.product.name}
                  </td>
                  <td className="border border-gray-900 px-4 py-2 text-sm">
                    {item.product.sku}
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
                <td colSpan={4} className="border border-gray-900 px-4 py-2 text-right">
                  TOTAL:
                </td>
                <td className="border border-gray-900 px-4 py-2 text-right">
                  R$ {sale.totalAmount.toFixed(2)}
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
              ASSINATURA DO VENDEDOR
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
