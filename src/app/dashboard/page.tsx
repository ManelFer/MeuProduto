import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [clientsCount, productsCount, ordersCount] = await Promise.all([
    prisma.client.count(),
    prisma.product.count(),
    prisma.order.count(),
  ]);

  const lowStockProducts = await prisma.product.findMany({
    where: {
      stock: {
        lte: prisma.product.fields.minStock,
      },
    },
    take: 5,
  });

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700">Clientes</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{clientsCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700">Produtos</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{productsCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700">Ordens de Serviço</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{ordersCount}</p>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-4">
            Produtos com Estoque Baixo
          </h2>
          <ul className="space-y-2">
            {lowStockProducts.map((product) => (
              <li key={product.id} className="text-yellow-700">
                {product.name} - Estoque: {product.stock} (Mínimo: {product.minStock})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
