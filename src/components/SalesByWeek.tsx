"use client";

import { useState, useEffect } from "react";

interface WeekData {
  weekStart: string;
  weekLabel: string;
  total: number;
  count: number;
}

export default function SalesByWeek() {
  const [data, setData] = useState<WeekData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/sales/by-week?weeks=6");
        if (!res.ok) throw new Error("Erro ao carregar dados");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-pastel overflow-hidden border border-soft-border">
        <h2 className="px-6 py-4 text-lg font-medium text-gray-800 border-b border-soft-border">
          Controle financeiro por semana
        </h2>
        <div className="p-6">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-12 bg-soft-gray rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-pastel overflow-hidden border border-soft-border">
        <h2 className="px-6 py-4 text-lg font-medium text-gray-800 border-b border-soft-border">
          Controle financeiro por semana
        </h2>
        <div className="p-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-pastel overflow-hidden border border-soft-border">
      <h2 className="px-6 py-4 text-lg font-medium text-gray-800 border-b border-soft-border">
        Controle financeiro por semana
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-soft-border">
          <thead className="bg-soft-gray">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Semana</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">Vendas</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-soft-border">
            {data.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  Nenhuma venda registrada nas últimas semanas
                </td>
              </tr>
            ) : (
              data.map((week) => (
                <tr key={week.weekStart} className="hover:bg-soft-gray/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{week.weekLabel}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-right">{week.count}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 text-right">
                    R$ {week.total.toFixed(2)}
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
