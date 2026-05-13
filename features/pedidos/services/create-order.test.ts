import { describe, it, expect, vi, beforeEach } from "vitest";
import { createOrder } from "./create-order";
import { db } from "@/db/client";
import { clientes } from "@/db/schema/clientes";
import { productos } from "@/db/schema/productos";
import { inventario } from "@/db/schema/inventario";
import { pedidos } from "@/db/schema/pedidos";
import { detallesPedidos } from "@/db/schema/detalles-pedidos";
import { PEDIDO_ESTADO, PEDIDO_TIPO } from "@/db/constants";
import { StockInsufficientError } from "@/lib/errors";

vi.mock("@/db/client", () => ({
  db: {
    transaction: vi.fn(),
  },
}));

function getTableKey(table: unknown): string {
  if (table === clientes) return "clientes";
  if (table === productos) return "productos";
  if (table === inventario) return "inventario";
  if (table === pedidos) return "pedidos";
  if (table === detallesPedidos) return "detallesPedidos";
  return "unknown";
}

interface MockConfig {
  selectResults: Record<string, unknown[]>;
  insertResults: Record<string, unknown[]>;
}

function setupMockTransaction(config: MockConfig) {
  const mockTx = {
    select: vi.fn(() => ({
      from: vi.fn((table: unknown) => {
        const key = getTableKey(table);
        const data = config.selectResults[key] ?? [];
        return {
          where: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve(data)),
            then: (resolve: (value: unknown[]) => unknown) =>
              Promise.resolve(data).then(resolve),
          })),
          then: (resolve: (value: unknown[]) => unknown) =>
            Promise.resolve(data).then(resolve),
        };
      }),
    })),
    insert: vi.fn((table: unknown) => {
      const tableKey = getTableKey(table);
      return {
        values: vi.fn((_data: unknown) => {
          const result = config.insertResults[tableKey] ?? [];
          return {
            returning: vi.fn(() => Promise.resolve(result)),
            then: (resolve: (value: unknown) => unknown) =>
              Promise.resolve(undefined).then(resolve),
          };
        }),
      };
    }),
  };

  vi.mocked(db.transaction).mockImplementation(async (callback) => {
    return (callback as unknown as (tx: typeof mockTx) => Promise<unknown>)(
      mockTx
    );
  });

  return mockTx;
}

describe("createOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates order with correct total (happy path)", async () => {
    const fecha = new Date();
    setupMockTransaction({
      selectResults: {
        clientes: [
          { id: 5, nombre: "Juan", telefono: "5551234" },
        ],
        productos: [
          { id: 1, nombre: "Burger", precio: 12.99, disponible: true },
          { id: 2, nombre: "Cola", precio: 2.5, disponible: true },
        ],
        inventario: [
          { productoId: 1, stockActual: 10 },
          { productoId: 2, stockActual: 20 },
        ],
        detallesPedidos: [
          {
            id: 10,
            pedidoId: 100,
            productoId: 1,
            cantidad: 2,
            precioUnitario: 12.99,
            subtotal: 25.98,
          },
          {
            id: 11,
            pedidoId: 100,
            productoId: 2,
            cantidad: 1,
            precioUnitario: 2.5,
            subtotal: 2.5,
          },
        ],
      },
      insertResults: {
        pedidos: [
          {
            id: 100,
            estado: PEDIDO_ESTADO.Registrado,
            total: 28.48,
            fecha,
            tipo: PEDIDO_TIPO.Online,
            clienteId: 5,
            usuarioId: 1,
          },
        ],
      },
    });

    const result = await createOrder({
      cliente: { nombre: "Juan", telefono: "5551234" },
      items: [
        { productoId: 1, cantidad: 2 },
        { productoId: 2, cantidad: 1 },
      ],
    });

    expect(result.pedido.id).toBe(100);
    expect(result.pedido.estado).toBe(PEDIDO_ESTADO.Registrado);
    expect(result.pedido.total).toBeCloseTo(28.48, 2);
    expect(result.cliente.id).toBe(5);
    expect(result.detalles).toHaveLength(2);
    expect(result.detalles[0].subtotal).toBeCloseTo(25.98, 2);
    expect(result.detalles[1].subtotal).toBeCloseTo(2.5, 2);
  });

  it("reuses existing client by telefono", async () => {
    const fecha = new Date();
    setupMockTransaction({
      selectResults: {
        clientes: [{ id: 7, nombre: "Maria", telefono: "5559999" }],
        productos: [{ id: 3, nombre: "Pasta", precio: 14.5, disponible: true }],
        inventario: [{ productoId: 3, stockActual: 5 }],
        detallesPedidos: [
          {
            id: 20,
            pedidoId: 200,
            productoId: 3,
            cantidad: 1,
            precioUnitario: 14.5,
            subtotal: 14.5,
          },
        ],
      },
      insertResults: {
        pedidos: [
          {
            id: 200,
            estado: PEDIDO_ESTADO.Registrado,
            total: 14.5,
            fecha,
            tipo: PEDIDO_TIPO.Online,
            clienteId: 7,
            usuarioId: 1,
          },
        ],
      },
    });

    const result = await createOrder({
      cliente: { nombre: "Maria", telefono: "5559999" },
      items: [{ productoId: 3, cantidad: 1 }],
    });

    expect(result.cliente.id).toBe(7);
    expect(result.cliente.telefono).toBe("5559999");
  });

  it("creates new client if telefono does not exist", async () => {
    const fecha = new Date();
    setupMockTransaction({
      selectResults: {
        clientes: [],
        productos: [
          { id: 4, nombre: "Salad", precio: 8.5, disponible: true },
        ],
        inventario: [{ productoId: 4, stockActual: 15 }],
        detallesPedidos: [
          {
            id: 30,
            pedidoId: 300,
            productoId: 4,
            cantidad: 1,
            precioUnitario: 8.5,
            subtotal: 8.5,
          },
        ],
      },
      insertResults: {
        clientes: [{ id: 99, nombre: "Pedro", telefono: "5550000" }],
        pedidos: [
          {
            id: 300,
            estado: PEDIDO_ESTADO.Registrado,
            total: 8.5,
            fecha,
            tipo: PEDIDO_TIPO.Online,
            clienteId: 99,
            usuarioId: 1,
          },
        ],
      },
    });

    const result = await createOrder({
      cliente: { nombre: "Pedro", telefono: "5550000" },
      items: [{ productoId: 4, cantidad: 1 }],
    });

    expect(result.cliente.id).toBe(99);
    expect(result.cliente.nombre).toBe("Pedro");
  });

  it("throws StockInsufficientError when stock < cantidad", async () => {
    setupMockTransaction({
      selectResults: {
        clientes: [{ id: 1, nombre: "Ana", telefono: "5551111" }],
        productos: [
          { id: 5, nombre: "Steak", precio: 20.0, disponible: true },
        ],
        inventario: [{ productoId: 5, stockActual: 1 }],
      },
      insertResults: {},
    });

    await expect(
      createOrder({
        cliente: { nombre: "Ana", telefono: "5551111" },
        items: [{ productoId: 5, cantidad: 3 }],
      })
    ).rejects.toBeInstanceOf(StockInsufficientError);
  });

  it("throws error when product not found", async () => {
    setupMockTransaction({
      selectResults: {
        clientes: [{ id: 1, nombre: "Luis", telefono: "5552222" }],
        productos: [],
      },
      insertResults: {},
    });

    await expect(
      createOrder({
        cliente: { nombre: "Luis", telefono: "5552222" },
        items: [{ productoId: 999, cantidad: 1 }],
      })
    ).rejects.toThrow("Product 999 not found");
  });

  it("throws error when product not disponible", async () => {
    setupMockTransaction({
      selectResults: {
        clientes: [{ id: 1, nombre: "Carlos", telefono: "5553333" }],
        productos: [
          { id: 6, nombre: "Special", precio: 30.0, disponible: false },
        ],
      },
      insertResults: {},
    });

    await expect(
      createOrder({
        cliente: { nombre: "Carlos", telefono: "5553333" },
        items: [{ productoId: 6, cantidad: 1 }],
      })
    ).rejects.toThrow("Product 6 is not available");
  });

  it("rejects zero quantity", async () => {
    await expect(
      createOrder({
        cliente: { nombre: "Test", telefono: "5554444" },
        items: [{ productoId: 1, cantidad: 0 }],
      })
    ).rejects.toThrow("Invalid quantity");
  });

  it("rejects negative quantity", async () => {
    await expect(
      createOrder({
        cliente: { nombre: "Test", telefono: "5554444" },
        items: [{ productoId: 1, cantidad: -2 }],
      })
    ).rejects.toThrow("Invalid quantity");
  });

  it("uses Online as default tipo", async () => {
    const fecha = new Date();
    setupMockTransaction({
      selectResults: {
        clientes: [{ id: 1, nombre: "T", telefono: "5555555" }],
        productos: [{ id: 1, nombre: "A", precio: 10, disponible: true }],
        inventario: [{ productoId: 1, stockActual: 5 }],
        detallesPedidos: [
          {
            id: 1,
            pedidoId: 400,
            productoId: 1,
            cantidad: 1,
            precioUnitario: 10,
            subtotal: 10,
          },
        ],
      },
      insertResults: {
        pedidos: [
          {
            id: 400,
            estado: PEDIDO_ESTADO.Registrado,
            total: 10,
            fecha,
            tipo: PEDIDO_TIPO.Online,
            clienteId: 1,
            usuarioId: 1,
          },
        ],
      },
    });

    const result = await createOrder({
      cliente: { nombre: "T", telefono: "5555555" },
      items: [{ productoId: 1, cantidad: 1 }],
    });

    expect(result.pedido.estado).toBe(PEDIDO_ESTADO.Registrado);
  });
});
