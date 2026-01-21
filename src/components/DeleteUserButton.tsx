"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteUserButtonProps {
  userId: string;
  userName: string;
  isCurrentUser: boolean;
}

export default function DeleteUserButton({
  userId,
  userName,
  isCurrentUser,
}: DeleteUserButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Excluir o usuário "${userName}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.error || "Erro ao excluir usuário.");
        return;
      }

      router.refresh();
    } catch {
      alert("Erro ao excluir usuário.");
    } finally {
      setLoading(false);
    }
  };

  if (isCurrentUser) {
    return (
      <span className="text-xs text-gray-400" title="Você não pode excluir sua própria conta">
        —
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Excluindo..." : "Excluir"}
    </button>
  );
}
