import "dotenv/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

async function seed(): Promise<void> {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error("TURSO_DATABASE_URL is not defined");
  }

  const authToken = process.env.TURSO_AUTH_TOKEN;

  const client = createClient({ url, authToken });
  const db = drizzle(client, { schema });

  console.log("Seeding database...");

  // 1. System user
  const existingUsers = await db.select().from(schema.usuarios).limit(1);
  if (existingUsers.length === 0) {
    await db.insert(schema.usuarios).values({
      nombre: "Online",
      email: "online@system.local",
      password: "system",
      rol: "mesero",
    });
    console.log("✓ System user created");
  } else {
    console.log("✓ Users already exist, skipping system user");
  }

  // 2. Seed proveedores (idempotent)
  const existingProveedores = await db.select().from(schema.proveedores).limit(1);
  if (existingProveedores.length === 0) {
    await db.insert(schema.proveedores).values([
      { nombre: "Distribuidora de Vegetales El Campo", contacto: "contacto@elcampo.com" },
      { nombre: "Carnes Premium del Sur", contacto: "ventas@carnespremium.com" },
      { nombre: "Pescadería Mar Azul", contacto: "pedidos@marazul.com" },
      { nombre: "Distribuidora de Bebidas y Licores Norte", contacto: "admin@norte.com" },
      { nombre: "Molinos y Granos Central", contacto: "compras@molinoscentral.com" },
    ]);
    console.log("✓ Proveedores created");
  } else {
    console.log("✓ Proveedores already exist, skipping");
  }

  // 3. Clean and reseed productos + inventario
  console.log("Cleaning existing product data...");
  await db.delete(schema.inventario);
  await db.delete(schema.detallesPedidos);
  await db.delete(schema.pagos);
  await db.delete(schema.pedidos);
  await db.delete(schema.productos);

  const productosData = [
    // Entradas
    { nombre: "Bruschetta de Tomate", precio: 6.5, categoria: "Entradas", disponible: true },
    { nombre: "Calamares a la Romana", precio: 9.0, categoria: "Entradas", disponible: true },
    { nombre: "Ensalada César con Pollo", precio: 8.5, categoria: "Entradas", disponible: true },
    { nombre: "Nachos con Queso y Guacamole", precio: 7.5, categoria: "Entradas", disponible: true },

    // Platos Principales
    { nombre: "Hamburguesa Clásica", precio: 12.99, categoria: "Platos Principales", disponible: true },
    { nombre: "Pasta Carbonara Auténtica", precio: 14.5, categoria: "Platos Principales", disponible: true },
    { nombre: "Pollo al Curry con Arroz", precio: 13.99, categoria: "Platos Principales", disponible: true },
    { nombre: "Lomo Saltado", precio: 16.5, categoria: "Platos Principales", disponible: true },
    { nombre: "Salmón a la Plancha", precio: 18.0, categoria: "Platos Principales", disponible: true },
    { nombre: "Pizza Margherita Familiar", precio: 12.0, categoria: "Platos Principales", disponible: true },

    // Postres
    { nombre: "Tarta de Queso con Arándanos", precio: 6.5, categoria: "Postres", disponible: true },
    { nombre: "Helado Artesanal de Vainilla", precio: 5.0, categoria: "Postres", disponible: true },
    { nombre: "Brownie con Helado de Chocolate", precio: 7.0, categoria: "Postres", disponible: true },
    { nombre: "Tiramisú Casero", precio: 6.0, categoria: "Postres", disponible: true },

    // Bebidas
    { nombre: "Coca-Cola 500ml", precio: 2.5, categoria: "Bebidas", disponible: true },
    { nombre: "Limonada Natural", precio: 3.5, categoria: "Bebidas", disponible: true },
    { nombre: "Agua Mineral sin Gas", precio: 1.5, categoria: "Bebidas", disponible: true },
    { nombre: "Vino Tinto Malbec (copa)", precio: 5.5, categoria: "Bebidas", disponible: true },
    { nombre: "Cerveza Artesanal IPA", precio: 4.5, categoria: "Bebidas", disponible: true },
    { nombre: "Jugo de Naranja Recién Exprimido", precio: 3.0, categoria: "Bebidas", disponible: true },

    // Test / Otros
    { nombre: "Producto de Prueba No Disponible", precio: 99.99, categoria: "Test", disponible: false },
  ];
  const inserted = await db
    .insert(schema.productos)
    .values(productosData)
    .returning({ id: schema.productos.id });

  console.log(`✓ ${inserted.length} products created`);

  // 4. Inventario for each product
  const inventarioData = inserted.map((p, i) => ({
    productoId: p.id,
    stockActual: 100 - i * 5,
    stockMinimo: 10,
  }));

  await db.insert(schema.inventario).values(inventarioData);
  console.log(`✓ ${inventarioData.length} inventory rows created`);

  await client.close();
  console.log("Seed completed.");
}

seed().catch((err: unknown) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
