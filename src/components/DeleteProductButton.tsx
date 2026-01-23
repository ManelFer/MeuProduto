"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export default function DeleteProductButton({
  productId,
  productName,
}: DeleteProductButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Excluir o produto "${productName}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.error || "Erro ao excluir produto.");
        setLoading(false);
        return;
      }

      // Forçar recarregamento completo da página para atualizar a tabela
      window.location.reload();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto.");
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ml-3"
    >
      {loading ? "Excluindo..." : "Excluir"}
    </button>
  );
}
