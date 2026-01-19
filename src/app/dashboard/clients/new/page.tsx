import ClientForm from "@/components/ClientForm";

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Novo Cliente</h1>
      <ClientForm />
    </div>
  );
}
