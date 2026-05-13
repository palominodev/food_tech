import { describe, it, expect, vi, beforeEach } from "vitest";
import { getOrdersByPhone } from "./get-orders-by-phone";

// Mock the db module
vi.mock("@/db/client", () => ({
  db: {
    query: {
      clientes: { findFirst: vi.fn() },
      pedidos: { findMany: vi.fn() },
    },
  },
}));

const { db } = await import("@/db/client");
const mockDb = vi.mocked(db, true);

describe("getOrdersByPhone", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty array when client not found", async () => {
    mockDb.query.clientes.findFirst.mockResolvedValue(undefined);

    const result = await getOrdersByPhone("999999999");

    expect(result).toEqual([]);
  });

  it("returns empty array when client has no orders", async () => {
    mockDb.query.clientes.findFirst.mockResolvedValue({
      id: 1,
      nombre: "Test",
      telefono: "123456789",
    });
    mockDb.query.pedidos.findMany.mockResolvedValue([]);

    const result = await getOrdersByPhone("123456789");

    expect(result).toEqual([]);
  });

  it("returns orders with details when found", async () => {
    mockDb.query.clientes.findFirst.mockResolvedValue({
      id: 1,
      nombre: "Scott",
      telefono: "903089982",
    });
    mockDb.query.pedidos.findMany.mockResolvedValue([
      {
        id: 1,
        estado: "Registrado",
        total: 26.5,
        fecha: new Date("2026-05-12"),
        tipo: "Online",
        clienteId: 1,
        usuarioId: 1,
        detalles: [
          {
            id: 1,
            cantidad: 2,
            precioUnitario: 5.99,
            subtotal: 11.98,
            producto: { id: 7, nombre: "Bruschetta" },
          },
          {
            id: 2,
            cantidad: 1,
            precioUnitario: 14.5,
            subtotal: 14.5,
            producto: { id: 11, nombre: "Pasta Carbonara" },
          },
        ],
      },
    ] as any);

    const result = await getOrdersByPhone("903089982");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
    expect(result[0].estado).toBe("Registrado");
    expect(result[0].total).toBe(26.5);
    expect(result[0].detalles).toHaveLength(2);
    expect(result[0].detalles[0].producto.nombre).toBe("Bruschetta");
  });

  it("returns multiple orders sorted by fecha desc", async () => {
    mockDb.query.clientes.findFirst.mockResolvedValue({
      id: 1,
      nombre: "Scott",
      telefono: "903089982",
    });
    mockDb.query.pedidos.findMany.mockResolvedValue([
      {
        id: 2,
        estado: "Pagado",
        total: 15,
        fecha: new Date("2026-05-13"),
        tipo: "Online",
        clienteId: 1,
        usuarioId: 1,
        detalles: [],
      },
      {
        id: 1,
        estado: "Registrado",
        total: 26.5,
        fecha: new Date("2026-05-12"),
        tipo: "Online",
        clienteId: 1,
        usuarioId: 1,
        detalles: [],
      },
    ] as any);

    const result = await getOrdersByPhone("903089982");

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(2); // most recent first
    expect(result[1].id).toBe(1);
  });
});
