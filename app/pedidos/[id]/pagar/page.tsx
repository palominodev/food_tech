"use client";

import { useState, useEffect, use } from "react";
import { submitPayment, getOrderForPayment } from "./actions";

interface PaymentPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function PaymentPage({
  params,
  searchParams,
}: PaymentPageProps) {
  const { id } = use(params);
  const sp = use(searchParams);
  const tel = typeof sp.tel === "string" ? sp.tel : null;

  const pedidoId = parseInt(id, 10);

  const [order, setOrder] = useState<{
    id: number;
    total: number;
    estado: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState<{ pagoId: number } | null>(null);

  useEffect(() => {
    if (!tel || isNaN(pedidoId)) {
      setError("Datos de pedido inválidos");
      setLoading(false);
      return;
    }

    getOrderForPayment({ pedidoId, telefono: tel }).then((res) => {
      if (res.success) {
        setOrder({
          id: res.order.id,
          total: res.order.total,
          estado: res.order.estado,
        });
      } else {
        setError(res.error.message);
      }
      setLoading(false);
    });
  }, [pedidoId, tel]);

  const handlePay = async () => {
    setPaying(true);
    setError(null);

    const result = await submitPayment({ pedidoId, metodo: "Mock" });

    setPaying(false);

    if (result.success) {
      setSuccess({ pagoId: result.pagoId });
    } else {
      setError(result.error.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <p>Cargando detalles del pedido...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          Pago confirmado
        </h1>
        <p className="mb-4">Tu pago fue procesado correctamente.</p>
        <p className="mb-6">
          Número de recibo: <strong>#{success.pagoId}</strong>
        </p>
        <a href={`/pedidos/${pedidoId}`} className="text-blue-600 underline">
          Volver al pedido
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Pagar Pedido</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {order && (
        <div className="border rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500">Pedido #{order.id}</span>
            <span className="font-bold text-lg">
              ${order.total.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Estado:{" "}
            <span className="font-medium">{order.estado}</span>
          </p>
          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full bg-blue-600 text-white py-3 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            {paying ? "Procesando pago..." : "Pagar ahora"}
          </button>
        </div>
      )}
    </div>
  );
}
