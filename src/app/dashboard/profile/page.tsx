import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Meu Perfil</h1>
      <ProfileForm
        defaultName={session.user.name ?? ""}
        email={session.user.email ?? ""}
      />
    </div>
  );
}
