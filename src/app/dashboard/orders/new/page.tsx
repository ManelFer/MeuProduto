import OrderForm from "@/components/OrderForm";

export default function NewOrderPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-900">Nova Ordem de Serviço</h1>
      <OrderForm />
    </div>
  );
}
