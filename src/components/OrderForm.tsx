"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Client {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface OrderItem {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export default function OrderForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    clientId: "",
    description: "",
  });
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    fetchClients();
    fetchProducts();
  }, []);

  const fetchClients = async () => {
    const res = await fetch("/api/clients");
    if (res.ok) {
      const data = await res.json();
      setClients(data);
    }
  };

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    if (res.ok) {
      const data = await res.json();
      setProducts(data);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        productId: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof OrderItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "productId" && value) {
            const product = products.find((p) => p.id === value);
            if (product) {
              updated.description = product.name;
              updated.unitPrice = product.price;
              updated.totalPrice = updated.unitPrice * updated.quantity;
            }
          } else if (field === "quantity") {
            updated.quantity = parseInt(value) || 1;
            updated.totalPrice = updated.unitPrice * updated.quantity;
          } else if (field === "unitPrice") {
            updated.unitPrice = parseFloat(value) || 0;
            updated.totalPrice = updated.unitPrice * updated.quantity;
          } else if (field === "description") {
            updated.description = value;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientId) {
      alert("Selecione um cliente");
      return;
    }

    if (items.length === 0) {
      alert("Adicione pelo menos um item");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: items.map(({ id, ...rest }) => rest),
        }),
      });

      if (response.ok) {
        router.push("/dashboard/orders");
        router.refresh();
      } else {
        alert("Erro ao criar ordem de serviço");
      }
    } catch (error) {
      alert("Erro ao criar ordem de serviço");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-pastel p-8 space-y-6 border border-soft-border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
          <select
            required
            className="w-full px-4 py-3 rounded-xl border border-soft-border bg-white text-gray-800 focus:border-pastel-orange-hover focus:ring-2 focus:ring-pastel-orange outline-none transition-all"
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
          >
            <option value="">Selecione um cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Descrição do Serviço</label>
        <textarea
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-soft-border bg-white text-gray-800 placeholder-gray-400 focus:border-pastel-orange-hover focus:ring-2 focus:ring-pastel-orange outline-none transition-all resize-none"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Itens/Serviços</h2>
          <button
            type="button"
            onClick={addItem}
            className="px-4 py-2 rounded-xl bg-pastel-green text-gray-900 hover:bg-pastel-green-hover text-sm font-medium shadow-pastel transition-all"
          >
            Adicionar Item
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum item adicionado</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border border-soft-border rounded-xl p-6 space-y-4 bg-soft-gray/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Produto (opcional)</label>
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-soft-border bg-white text-gray-800 focus:border-pastel-orange-hover focus:ring-2 focus:ring-pastel-orange outline-none transition-all"
                      value={item.productId}
                      onChange={(e) => updateItem(item.id, "productId", e.target.value)}
                    >
                      <option value="">Selecione um produto</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - R$ {product.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-soft-border bg-white text-gray-800 placeholder-gray-400 focus:border-pastel-orange-hover focus:ring-2 focus:ring-pastel-orange outline-none transition-all"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade *</label>
                    <input
                      type="number"
                      min="1"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-soft-border bg-white text-gray-800 focus:border-pastel-orange-hover focus:ring-2 focus:ring-pastel-orange outline-none transition-all"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preço Unitário *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-soft-border bg-white text-gray-800 focus:border-pastel-orange-hover focus:ring-2 focus:ring-pastel-orange outline-none transition-all"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, "unitPrice", e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total</label>
                      <p className="text-lg font-semibold text-gray-800">
                        R$ {item.totalPrice.toFixed(2)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="ml-4 px-3 py-2 rounded-xl text-red-600 hover:bg-pastel-pink/50 transition-all"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t border-soft-border pt-4">
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total da Ordem:</p>
                  <p className="text-2xl font-semibold text-gray-800">
                    R$ {totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-soft-border">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl border border-soft-border text-gray-700 bg-white hover:bg-soft-gray transition-all font-medium"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-pastel-orange text-gray-900 hover:bg-pastel-orange-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-pastel"
        >
          {loading ? "Criando..." : "Criar Ordem"}
        </button>
      </div>
    </form>
  );
}
