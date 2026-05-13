import { describe, it, expect, vi, beforeEach } from "vitest";
import { getOrderStatus } from "./get-order-status";
import { db } from "@/db/client";
import { NotFoundError } from "@/lib/errors";

vi.mock("@/db/client", () => ({
  db: {
    query: {
      pedidos: {
        findFirst: vi.fn(),
      },
    },
  },
}));

function mockFindFirst(result: unknown) {
  vi.mocked(db.query.pedidos.findFirst).mockResolvedValue(result);
}

describe("getOrderStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns order with all details when found", async () => {
    const fecha = new Date();
    mockFindFirst({
      id: 100,
      estado: "Registrado",
      total: 28.48,
      fecha,
      cliente: { id: 5, nombre: "Juan", telefono: "5551234" },
      detalles: [
        {
          id: 10,
          cantidad: 2,
          precioUnitario: 12.99,
          subtotal: 25.98,
          producto: { id: 1, nombre: "Burger", precio: 12.99 },
        },
        {
          id: 11,
          cantidad: 1,
          precioUnitario: 2.5,
          subtotal: 2.5,
          producto: { id: 2, nombre: "Cola", precio: 2.5 },
        },
      ],
    });

    const result = await getOrderStatus({
      pedidoId: 100,
      telefono: "5551234",
    });

    expect(result.id).toBe(100);
    expect(result.estado).toBe("Registrado");
    expect(result.total).toBeCloseTo(28.48, 2);
    expect(result.cliente.telefono).toBe("5551234");
    expect(result.detalles).toHaveLength(2);
    expect(result.detalles[0].producto.nombre).toBe("Burger");
    expect(result.detalles[1].producto.nombre).toBe("Cola");
  });

  it("throws NotFoundError when pedido ID not found", async () => {
    mockFindFirst(undefined);

    await expect(
      getOrderStatus({ pedidoId: 999, telefono: "5551234" })
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("throws NotFoundError when phone mismatches (privacy)", async () => {
    mockFindFirst({
      id: 100,
      estado: "Registrado",
      total: 28.48,
      fecha: new Date(),
      cliente: { id: 5, nombre: "Juan", telefono: "5559999" },
      detalles: [],
    });

    await expect(
      getOrderStatus({ pedidoId: 100, telefono: "5551234" })
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("returns cancelled order (client has right to know)", async () => {
    const fecha = new Date();
    mockFindFirst({
      id: 100,
      estado: "Cancelado",
      total: 28.48,
      fecha,
      cliente: { id: 5, nombre: "Juan", telefono: "5551234" },
      detalles: [],
    });

    const result = await getOrderStatus({
      pedidoId: 100,
      telefono: "5551234",
    });

    expect(result.estado).toBe("Cancelado");
    expect(result.id).toBe(100);
  });
});
