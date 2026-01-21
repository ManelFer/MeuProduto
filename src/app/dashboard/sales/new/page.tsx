import SaleForm from "@/components/SaleForm";

export default function NewSalePage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-semibold text-gray-800">Nova venda</h1>
      <SaleForm />
    </div>
  );
}
