"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddUserForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!name.trim()) {
      setMessage({ type: "err", text: "Nome é obrigatório." });
      return;
    }
    if (!email.trim()) {
      setMessage({ type: "err", text: "Email é obrigatório." });
      return;
    }
    if (!password || password.length < 6) {
      setMessage({ type: "err", text: "A senha deve ter no mínimo 6 caracteres." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Erro ao cadastrar usuário." });
        return;
      }

      setMessage({ type: "ok", text: "Usuário cadastrado. Ele já pode acessar a plataforma." });
      setName("");
      setEmail("");
      setPassword("");
      router.refresh();
    } catch {
      setMessage({ type: "err", text: "Erro ao cadastrar usuário." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-pastel p-6 border border-soft-border max-w-xl">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Adicionar usuário</h2>

      {message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm mb-4 ${
            message.type === "ok"
              ? "bg-pastel-green/50 text-gray-800 border border-green-200"
              : "bg-pastel-pink/50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-soft-border bg-white text-gray-800 placeholder-gray-400 focus:border-pastel-lavender-dark focus:ring-2 focus:ring-pastel-lavender outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-soft-border bg-white text-gray-800 placeholder-gray-400 focus:border-pastel-lavender-dark focus:ring-2 focus:ring-pastel-lavender outline-none transition-all"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Senha *</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
          className="w-full px-4 py-3 rounded-xl border border-soft-border bg-white text-gray-800 placeholder-gray-400 focus:border-pastel-lavender-dark focus:ring-2 focus:ring-pastel-lavender outline-none transition-all"
        />
      </div>

      <div className="mt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-pastel-lavender text-gray-900 hover:bg-pastel-lavender-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-pastel"
        >
          {loading ? "Cadastrando..." : "Cadastrar usuário"}
        </button>
      </div>
    </form>
  );
}
