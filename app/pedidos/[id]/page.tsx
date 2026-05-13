import Link from "next/link";
import { getOrderStatus } from "@/features/pedidos/services/get-order-status";
import { NotFoundError } from "@/lib/errors";

interface OrderStatusPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OrderStatusPage({
  params,
  searchParams,
}: OrderStatusPageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const tel = typeof sp.tel === "string" ? sp.tel : undefined;

  if (!tel) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Consultar Pedido</h1>
        <p className="text-gray-600 mb-4">
          Ingresá tu número de teléfono para ver el estado de tu pedido.
        </p>
        <Link href="/" className="text-blue-600 underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const pedidoId = parseInt(id, 10);
  if (isNaN(pedidoId) || pedidoId <= 0) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Pedido no encontrado</h1>
        <Link href="/" className="text-blue-600 underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  try {
    const order = await getOrderStatus({ pedidoId, telefono: tel });

    const statusColors: Record<string, string> = {
      Registrado: "bg-yellow-100 text-yellow-800",
      En_Preparacion: "bg-blue-100 text-blue-800",
      Listo: "bg-purple-100 text-purple-800",
      Entregado: "bg-green-100 text-green-800",
      Pagado: "bg-emerald-100 text-emerald-800",
      Cancelado: "bg-red-100 text-red-800",
    };

    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Detalle del Pedido</h1>

        <div className="border rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500">Pedido #{order.id}</p>
              <p className="text-sm text-gray-500">
                {order.fecha instanceof Date
                  ? order.fecha.toLocaleDateString()
                  : new Date(order.fecha).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusColors[order.estado] ?? "bg-gray-100 text-gray-800"
              }`}
            >
              {order.estado}
            </span>
          </div>

          <div className="space-y-3 mb-6">
            {order.detalles.map((detalle) => (
              <div
                key={detalle.id}
                className="flex justify-between items-center py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{detalle.producto.nombre}</p>
                  <p className="text-sm text-gray-500">
                    {detalle.cantidad} x ${detalle.precioUnitario.toFixed(2)}
                  </p>
                </div>
                <p className="font-medium">${detalle.subtotal.toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center border-t pt-4">
            <span className="font-semibold">Total:</span>
            <span className="font-bold text-lg">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>

        {order.estado !== "Pagado" && order.estado !== "Cancelado" && (
          <Link
            href={`/pedidos/${order.id}/pagar?tel=${encodeURIComponent(tel)}`}
            className="block w-full text-center bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 transition-colors"
          >
            Pagar ahora
          </Link>
        )}
      </div>
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return (
        <div className="max-w-xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Pedido no encontrado</h1>
          <p className="text-gray-600 mb-4">
            No se encontró un pedido con ese ID y teléfono.
          </p>
          <Link href="/" className="text-blue-600 underline">
            Volver al inicio
          </Link>
        </div>
      );
    }
    throw error;
  }
}
