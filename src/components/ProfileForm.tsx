"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  defaultName: string;
  email: string;
}

export default function ProfileForm({ defaultName, email }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [name, setName] = useState(defaultName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: "err", text: "A nova senha e a confirmação não coincidem." });
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setMessage({ type: "err", text: "A nova senha deve ter no mínimo 6 caracteres." });
      return;
    }
    if (newPassword && !currentPassword) {
      setMessage({ type: "err", text: "Informe a senha atual para alterar a senha." });
      return;
    }

    setLoading(true);
    try {
      const body: { name?: string; newPassword?: string; currentPassword?: string } = { name: name.trim() };
      if (newPassword) {
        body.newPassword = newPassword;
        body.currentPassword = currentPassword;
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Erro ao salvar." });
        return;
      }

      setMessage({ type: "ok", text: "Perfil atualizado com sucesso." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.refresh();
    } catch {
      setMessage({ type: "err", text: "Erro ao salvar." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-pastel p-8 space-y-6 border border-soft-border max-w-xl">
      {message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            message.type === "ok"
              ? "bg-pastel-green/50 text-gray-800 border border-green-200"
              : "bg-pastel-pink/50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full px-4 py-3 rounded-xl border border-soft-border bg-soft-gray text-gray-500 cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-gray-500">O email não pode ser alterado.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-soft-border bg-white text-gray-800 placeholder-gray-400 focus:border-pastel-lavender-dark focus:ring-2 focus:ring-pastel-lavender outline-none transition-all"
        />
      </div>

      <div className="pt-4 border-t border-soft-border">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Alterar senha</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha atual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-soft-border bg-white text-gray-800 placeholder-gray-400 focus:border-pastel-lavender-dark focus:ring-2 focus:ring-pastel-lavender outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nova senha</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-soft-border bg-white text-gray-800 placeholder-gray-400 focus:border-pastel-lavender-dark focus:ring-2 focus:ring-pastel-lavender outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar nova senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-soft-border bg-white text-gray-800 placeholder-gray-400 focus:border-pastel-lavender-dark focus:ring-2 focus:ring-pastel-lavender outline-none transition-all"
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">Deixe em branco para não alterar a senha.</p>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-soft-border">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-pastel-lavender text-gray-900 hover:bg-pastel-lavender-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-pastel"
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
