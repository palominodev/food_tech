"use client";

import { useState, useEffect, useCallback } from "react";
import { getProducts, submitOrder } from "./actions";
import type { MenuItem } from "@/features/menu/types";

export default function NewOrderPage() {
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ pedidoId: number } | null>(null);

  useEffect(() => {
    getProducts().then((res) => {
      if (res.success) {
        setProducts(res.items);
      } else {
        setError(res.error.message);
      }
      setLoadingProducts(false);
    });
  }, []);

  const adjustQuantity = useCallback((productoId: number, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productoId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [productoId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productoId]: next };
    });
  }, []);

  const cartItems = Object.entries(quantities)
    .filter(([, qty]) => qty > 0)
    .map(([productoId, cantidad]) => ({
      productoId: Number(productoId),
      cantidad,
    }));

  const subtotal = cartItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productoId);
    return sum + (product?.precio || 0) * item.cantidad;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await submitOrder({
      nombre,
      telefono,
      items: cartItems,
    });

    setSubmitting(false);

    if (result.success) {
      setSuccess({ pedidoId: result.pedidoId });
    } else {
      setError(result.error.message);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 animate-fade-in-up">
        <div className="max-w-md w-full bg-background rounded-3xl shadow-2xl p-8 text-center border border-gray-100 dark:border-slate-800">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Tu número de orden es <strong className="text-foreground text-lg">#{success.pedidoId}</strong>. Hemos empezado a preparar tus platillos con mucho cuidado.
          </p>
          <a
            href={`/pedidos/${success.pedidoId}`}
            className="inline-flex items-center justify-center gap-2 w-full text-white bg-primary hover:bg-primary-hover py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg"
          >
            Ver estado del pedido
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-12 px-4 sm:px-6 animate-fade-in-up">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-primary/10">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15c0-4.418-4.03-8-9-8s-9 3.582-9 8m18 0v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m18 0H3m6-8V5a2 2 0 012-2h2a2 2 0 012 2v2" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            Arma tu <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">Pedido</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Selecciona tus platillos favoritos y nosotros nos encargamos del resto.
          </p>
        </div>

        <div className="bg-background rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 border-b border-red-100 dark:border-red-900/30 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nombre Completo</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  required
                  className="w-full bg-surface border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Teléfono</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej. 555-123-4567"
                  required
                  className="w-full bg-surface border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h2 className="text-xl font-bold">Menú Disponible</h2>
              </div>

              {loadingProducts ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin border-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {products.map((product) => {
                    const isSelected = quantities[product.id] > 0;
                    return (
                      <div
                        key={product.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                          isSelected
                            ? "border-primary/50 bg-primary/5"
                            : "border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700"
                        }`}
                      >
                        <div className="mb-4 sm:mb-0">
                          <p className="font-semibold text-lg">{product.nombre}</p>
                          <p className="font-medium text-primary">
                            ${product.precio.toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="flex items-center bg-background border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => adjustQuantity(product.id, -1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                          </button>
                          <span className="w-12 text-center font-semibold border-x border-gray-200 dark:border-slate-700 flex items-center justify-center h-10">
                            {quantities[product.id] || 0}
                          </span>
                          <button
                            type="button"
                            onClick={() => adjustQuantity(product.id, 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-primary"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-surface rounded-2xl p-6 mb-8 border border-gray-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold text-gray-600 dark:text-gray-300">Total a pagar:</span>
                <span className="font-extrabold text-2xl text-foreground">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={cartItems.length === 0 || submitting}
              className="relative w-full overflow-hidden rounded-xl p-[2px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="absolute inset-0 transition-transform duration-300 group-hover:scale-105 bg-linear-to-r from-primary to-secondary" />
              <span className="relative flex items-center justify-center gap-2 w-full bg-background px-8 py-4 rounded-[10px] transition-all duration-300 group-hover:bg-opacity-0 group-hover:text-white font-bold text-lg text-foreground">
                {submitting ? (
                  <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Confirmar Pedido
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
