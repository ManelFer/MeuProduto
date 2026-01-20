"use client";

import { useState } from "react";

interface OrderStatusManagerProps {
  orderId: string;
  currentStatus: string;
  onStatusChange?: (newStatus: string) => void;
}

export default function OrderStatusManager({
  orderId,
  currentStatus,
  onStatusChange,
}: OrderStatusManagerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusLabels: Record<string, string> = {
    PENDING: "Pendente",
    IN_PROGRESS: "Em Andamento",
    COMPLETED: "Concluída",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelada",
  };

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar status");
      }

      const updatedOrder = await response.json();
      onStatusChange?.(updatedOrder.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Status:</label>
        <span className="text-sm font-semibold text-gray-900">
          {statusLabels[currentStatus]}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => handleStatusChange("PENDING")}
          disabled={loading || currentStatus === "PENDING"}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            currentStatus === "PENDING"
              ? "bg-yellow-100 text-yellow-800 cursor-not-allowed"
              : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 disabled:opacity-50"
          }`}
        >
          Pendente
        </button>

        <button
          onClick={() => handleStatusChange("COMPLETED")}
          disabled={loading || currentStatus === "COMPLETED"}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            currentStatus === "COMPLETED"
              ? "bg-green-100 text-green-800 cursor-not-allowed"
              : "bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50"
          }`}
        >
          Concluída
        </button>
      </div>
    </div>
  );
}
