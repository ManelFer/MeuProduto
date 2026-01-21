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
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
      setIsEditing(false);
      setIsEditingPassword(false);
      router.refresh();
    } catch {
      setMessage({ type: "err", text: "Erro ao salvar." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-pastel-lavender/40 to-pastel-blue/40 rounded-2xl shadow-pastel p-8 border border-soft-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pastel-lavender to-pastel-blue flex items-center justify-center shadow-pastel-lg ring-2 ring-white">
                <span className="text-4xl font-bold text-gray-700">{getInitials(name)}</span>
              </div>
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/5 transition-colors" />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900">{name}</h2>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {email}
              </p>
              <p className="text-xs text-gray-500 mt-2">Perfil criado há alguns dias</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-5 py-2 rounded-xl bg-pastel-lavender text-gray-900 hover:bg-pastel-lavender-hover font-medium transition-all duration-200 shadow-pastel flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setName(defaultName);
                }}
                className="px-5 py-2 rounded-xl bg-soft-gray text-gray-700 hover:bg-gray-300 font-medium transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 ${
            message.type === "ok"
              ? "bg-pastel-green/50 text-green-800 border border-green-200"
              : "bg-pastel-pink/50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "ok" ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          {message.text}
        </div>
      )}

      {/* Informações Pessoais */}
      {isEditing && (
        <div className="bg-white rounded-2xl shadow-pastel p-6 border border-soft-border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-pastel-lavender-dark" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            Informações Pessoais
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-soft-border bg-white text-gray-800 placeholder-gray-400 focus:border-pastel-lavender-dark focus:ring-2 focus:ring-pastel-lavender outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-soft-border bg-soft-gray text-gray-500 cursor-not-allowed pr-10"
                />
                <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <p className="mt-1 text-xs text-gray-500">O email não pode ser alterado.</p>
            </div>
          </div>
        </div>
      )}

      {/* Segurança */}
      <div className="bg-white rounded-2xl shadow-pastel p-6 border border-soft-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-pastel-lavender-dark" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Segurança
          </h3>
          <button
            type="button"
            onClick={() => setIsEditingPassword(!isEditingPassword)}
            className="text-sm text-pastel-lavender-dark hover:text-pastel-lavender-dark font-medium transition-colors"
          >
            {isEditingPassword ? "Fechar" : "Alterar senha"}
          </button>
        </div>

        {isEditingPassword && (
          <div className="mt-4 pt-4 border-t border-soft-border space-y-4">
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
              <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>
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
        )}
      </div>

      {/* Action Buttons */}
      {(isEditing || isEditingPassword) && (
        <div className="bg-white rounded-2xl shadow-pastel p-6 border border-soft-border flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setIsEditingPassword(false);
              setName(defaultName);
              setCurrentPassword("");
              setNewPassword("");
              setConfirmPassword("");
            }}
            className="px-6 py-3 rounded-xl bg-soft-gray text-gray-700 hover:bg-gray-300 font-medium transition-all duration-200 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-pastel-lavender text-gray-900 hover:bg-pastel-lavender-hover disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-pastel transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Salvando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 13a3 3 0 015-2.999m5-1a1 1 0 11-2 0 1 1 0 012 0z" />
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      )}
    </form>
  );
}
