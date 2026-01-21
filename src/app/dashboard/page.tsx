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
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-pastel p-6 border border-soft-border hover:shadow-pastel-hover transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600 mb-1">Clientes</h2>
              <p className="text-3xl font-semibold text-gray-800">{clientsCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-pastel-blue flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-pastel p-6 border border-soft-border hover:shadow-pastel-hover transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600 mb-1">Produtos</h2>
              <p className="text-3xl font-semibold text-gray-800">{productsCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-pastel-green flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-pastel p-6 border border-soft-border hover:shadow-pastel-hover transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600 mb-1">Ordens de Serviço</h2>
              <p className="text-3xl font-semibold text-gray-800">{ordersCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-pastel-orange flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="bg-pastel-yellow border border-yellow-200 rounded-2xl p-6 shadow-pastel">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Produtos com Estoque Baixo
          </h2>
          <ul className="space-y-2">
            {lowStockProducts.map((product) => (
              <li key={product.id} className="text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                <span className="font-medium">{product.name}</span>
                <span className="text-sm text-gray-600">- Estoque: {product.stock} (Mínimo: {product.minStock})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
