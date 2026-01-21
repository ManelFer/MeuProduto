import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [clientsCount, productsCount, ordersCount, allProducts] = await Promise.all([
    prisma.client.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.product.findMany({
      select: { id: true, name: true, sku: true, stock: true, minStock: true },
    }),
  ]);

  const lowStockProducts = allProducts
    .filter((p) => p.stock <= p.minStock)
    .slice(0, 10);

  const cards = [
    {
      href: "/dashboard/clients",
      label: "Clientes",
      value: clientsCount,
      sub: "cadastrados",
      icon: (
        <svg className="w-7 h-7 text-indigo-500 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      gradient: "from-white to-pastel-blue/40",
      iconBg: "bg-pastel-blue",
    },
    {
      href: "/dashboard/products",
      label: "Produtos em estoque",
      value: productsCount,
      sub: "itens cadastrados",
      icon: (
        <svg className="w-7 h-7 text-emerald-600 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
      gradient: "from-white to-pastel-green/40",
      iconBg: "bg-pastel-green",
    },
    {
      href: "/dashboard/orders",
      label: "Ordens de serviço",
      value: ordersCount,
      sub: "ordens",
      icon: (
        <svg className="w-7 h-7 text-amber-600 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      gradient: "from-white to-pastel-orange/40",
      iconBg: "bg-pastel-orange",
    },
  ];

  return (
    <div className="space-y-8 p-6">
      <header>
        <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
        <p className="mt-1 text-gray-600">Visão geral do seu negócio</p>
      </header>

      {/* Cards principais */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <Link
            key={card.href}
            href={card.href}
            title={`Ver ${card.label.toLowerCase()}`}
            className={`group block bg-gradient-to-br ${card.gradient} rounded-2xl border border-soft-border shadow-pastel p-6 card-hover animate-in focus:outline-none focus:ring-2 focus:ring-pastel-lavender focus:ring-offset-2`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">{card.value}</p>
                <p className="mt-0.5 text-xs text-gray-500">{card.sub}</p>
              </div>
              <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${card.iconBg} shadow-pastel`}>
                {card.icon}
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Ver detalhes →
            </p>
          </Link>
        ))}
      </section>

      {/* Alertas de estoque baixo */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-pastel-orange">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </span>
          Estoque baixo
        </h2>

        {lowStockProducts.length > 0 ? (
          <div className="bg-white rounded-2xl border border-soft-border shadow-pastel overflow-hidden">
            <div className="divide-y divide-soft-border">
              {lowStockProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/dashboard/products/${product.id}/edit`}
                  title={`Ajustar estoque de ${product.name}`}
                  className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 px-6 py-4 transition-colors duration-200 hover:bg-pastel-orange/30 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-inset"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="font-medium text-gray-800 truncate">{product.name}</span>
                    {product.sku && (
                      <span className="flex-shrink-0 text-xs text-gray-500">({product.sku})</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 flex-shrink-0">
                    <span className="text-sm text-gray-600">
                      Estoque: <strong className="text-amber-700">{product.stock}</strong>
                      <span className="text-gray-400 mx-1">·</span>
                      Mín: {product.minStock}
                    </span>
                    <span className="text-sm font-medium text-amber-700 group-hover:underline">
                      Ver produto →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-soft-border bg-pastel-green/30 px-6 py-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-pastel-green">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div>
              <p className="font-medium text-gray-800">Nenhum alerta de estoque</p>
              <p className="text-sm text-gray-600">Todos os produtos estão acima do estoque mínimo.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
