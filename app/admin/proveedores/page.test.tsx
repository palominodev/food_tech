import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProveedoresPage from "./page";

// Mock the actions
vi.mock("@/features/proveedores/services/proveedor-actions", () => ({
  getProveedores: vi.fn().mockResolvedValue([
    { id: 1, nombre: "Proveedor A", contacto: "123" },
    { id: 2, nombre: "Proveedor B", contacto: "456" },
  ]),
  deleteProveedor: vi.fn(),
}));

describe("ProveedoresPage", () => {
  it("renders the list of suppliers", async () => {
    // Note: Since it's an RSC, we might need to await it if testing directly 
    // or mock the component if it's purely server-side.
    // For now, let's assume we implement it as an RSC.
    const Page = await ProveedoresPage();
    render(Page);
    
    expect(screen.getByText("Gestión de Proveedores")).toBeInTheDocument();
    expect(screen.getByText("Proveedor A")).toBeInTheDocument();
    expect(screen.getByText("Proveedor B")).toBeInTheDocument();
  });
});
