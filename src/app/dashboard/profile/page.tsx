import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 animate-in ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-1 text-sm">Gerencie suas informações pessoais e preferências de conta</p>
        </div>
      </div>

      {/* Profile Form */}
      <ProfileForm
        defaultName={session.user.name ?? ""}
        email={session.user.email ?? ""}
      />

      {/* Footer Info */}
      <div className="bg-pastel-blue/30 border border-soft-border rounded-2xl p-6 text-center">
        <p className="text-sm text-gray-700">
          ✨ Suas informações estão seguras e nunca serão compartilhadas com terceiros.
        </p>
      </div>
    </div>
  );
}
