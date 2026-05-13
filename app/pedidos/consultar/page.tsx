"use client";

import { useState } from "react";
import Link from "next/link";
import { searchOrders } from "./actions";

interface OrderResult {
  id: number;
  estado: string;
  total: number;
  fecha: string;
  tipo: string;
  detalles: Array<{
    id: number;
    cantidad: number;
    producto: { id: number; nombre: string };
  }>;
}

const statusColors: Record<string, string> = {
  Registrado: "bg-yellow-100 text-yellow-800",
  En_Preparacion: "bg-blue-100 text-blue-800",
  Listo: "bg-purple-100 text-purple-800",
  Entregado: "bg-green-100 text-green-800",
  Pagado: "bg-emerald-100 text-emerald-800",
  Cancelado: "bg-red-100 text-red-800",
};

export default function ConsultarPedidoPage() {
  const [telefono, setTelefono] = useState("");
  const [orders, setOrders] = useState<OrderResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSearched(false);
    setOrders([]);

    if (!telefono.trim()) {
      setError("Ingresá tu número de teléfono");
      return;
    }

    setLoading(true);
    try {
      const result = await searchOrders(telefono.trim());

      if (result.error) {
        setError(result.error.message);
        return;
      }

      setOrders(result.orders as OrderResult[]);
      setSearched(true);
    } catch {
      setError("Error al buscar pedidos. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Consultar Pedido</h1>
      <p className="text-gray-600 mb-6">
        Ingresá tu teléfono para ver tus pedidos.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium mb-1">
            Teléfono
          </label>
          <input
            id="telefono"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej: 903089982"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Buscando..." : "Buscar pedidos"}
        </button>
      </form>

      {searched && orders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron pedidos con ese teléfono.
        </div>
      )}

      {orders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {orders.length} {orders.length === 1 ? "pedido encontrado" : "pedidos encontrados"}
          </h2>

          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/pedidos/${order.id}?tel=${encodeURIComponent(telefono)}`}
              className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">Pedido #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.fecha).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[order.estado] ?? "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.estado}
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                {order.detalles.map((d) => d.producto.nombre).join(", ")}
              </div>

              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-sm text-gray-500">
                  {order.detalles.length} {order.detalles.length === 1 ? "item" : "items"}
                </span>
                <span className="font-bold">${order.total.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
