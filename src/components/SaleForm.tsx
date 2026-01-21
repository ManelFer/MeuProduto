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

interface SaleItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export default function SaleForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState<SaleItem[]>([]);

  useEffect(() => {
    (async () => {
      const [c, p] = await Promise.all([
        fetch("/api/clients").then((r) => (r.ok ? r.json() : [])),
        fetch("/api/products").then((r) => (r.ok ? r.json() : [])),
      ]);
      setClients(c);
      setProducts(p);
    })();
  }, []);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: String(Date.now()),
        productId: "",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof SaleItem, value: unknown) => {
    setItems(
      items.map((i) => {
        if (i.id !== id) return i;
        const u = { ...i, [field]: value };
        if (field === "productId" && value) {
          const p = products.find((x) => x.id === value);
          if (p) {
            u.unitPrice = p.price;
            u.totalPrice = p.price * (u.quantity || 1);
          }
        } else if (field === "quantity") {
          const q = typeof value === "number" ? value : parseInt(String(value), 10) || 1;
          u.quantity = Math.max(1, q);
          u.totalPrice = u.unitPrice * u.quantity;
        } else if (field === "unitPrice") {
          const v = typeof value === "number" ? value : parseFloat(String(value)) || 0;
          u.unitPrice = v;
          u.totalPrice = v * u.quantity;
        }
        return u;
      })
    );
  };

  const total = items.reduce((s, i) => s + i.totalPrice, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (items.length === 0) {
      setMessage({ type: "err", text: "Adicione ao menos um item." });
      return;
    }
    const invalid = items.find((i) => !i.productId || i.quantity < 1);
    if (invalid) {
      setMessage({ type: "err", text: "Todos os itens devem ter um produto e quantidade válida." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: clientId || null,
          items: items.map(({ id, ...r }) => r),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Erro ao registrar venda." });
        return;
      }
      setMessage({ type: "ok", text: "Venda registrada. O estoque foi atualizado." });
      setClientId("");
      setItems([]);
      router.refresh();
    } catch {
      setMessage({ type: "err", text: "Erro ao registrar venda." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-pastel p-8 space-y-6 border border-soft-border">
      <h2 className="text-lg font-semibold text-gray-800">Nova venda</h2>

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
        <label className="block text-sm font-medium text-gray-700 mb-2">Cliente (opcional)</label>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-soft-border bg-white text-gray-800 focus:border-pastel-lavender-dark focus:ring-2 focus:ring-pastel-lavender outline-none transition-all"
        >
          <option value="">Nenhum</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-medium text-gray-800">Itens da venda</h3>
          <button
            type="button"
            onClick={addItem}
            className="px-4 py-2 rounded-xl bg-pastel-green text-gray-900 hover:bg-pastel-green-hover text-sm font-medium shadow-pastel transition-all"
          >
            Adicionar item
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum item. Os produtos terão saída automática do estoque.</p>
        ) : (
          <div className="space-y-4">
            {items.map((i) => {
              const p = products.find((x) => x.id === i.productId);
              return (
                <div key={i.id} className="border border-soft-border rounded-xl p-4 bg-soft-gray/30 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Produto *</label>
                      <select
                        required
                        value={i.productId}
                        onChange={(e) => updateItem(i.id, "productId", e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-soft-border bg-white text-gray-800 focus:border-pastel-green focus:ring-2 focus:ring-pastel-green outline-none"
                      >
                        <option value="">Selecione</option>
                        {products.map((x) => (
                          <option key={x.id} value={x.id}>
                            {x.name} – R$ {x.price.toFixed(2)} (estoque: {x.stock})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={i.quantity}
                        onChange={(e) => updateItem(i.id, "quantity", e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-soft-border bg-white text-gray-800 focus:border-pastel-green focus:ring-2 focus:ring-pastel-green outline-none"
                      />
                      {p && i.quantity > p.stock && (
                        <p className="mt-1 text-xs text-amber-700">Estoque: {p.stock}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-600">Preço un.: R$ </span>
                      <input
                        type="number"
                        step="0.01"
                        min={0}
                        value={i.unitPrice}
                        onChange={(e) => updateItem(i.id, "unitPrice", e.target.value)}
                        className="w-24 px-2 py-1 rounded border border-soft-border text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800">R$ {i.totalPrice.toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() => removeItem(i.id)}
                        className="text-red-600 hover:bg-pastel-pink/50 px-2 py-1 rounded"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="border-t border-soft-border pt-4 flex justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-semibold text-gray-800">R$ {total.toFixed(2)}</p>
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
          disabled={loading || items.length === 0}
          className="px-6 py-3 rounded-xl bg-pastel-green text-gray-900 hover:bg-pastel-green-hover disabled:opacity-50 font-medium shadow-pastel"
        >
          {loading ? "Registrando..." : "Registrar venda"}
        </button>
      </div>
    </form>
  );
}
