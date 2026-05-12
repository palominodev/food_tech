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

  // 2. Sample productos
  const existingProducts = await db.select().from(schema.productos).limit(1);
  if (existingProducts.length === 0) {
    const productosData = [
      { nombre: "Bruschetta", precio: 5.99, categoria: "Entradas", disponible: true },
      { nombre: "Calamares Fritos", precio: 8.5, categoria: "Entradas", disponible: true },
      { nombre: "Ensalada César", precio: 7.0, categoria: "Entradas", disponible: true },
      { nombre: "Hamburguesa Clásica", precio: 12.99, categoria: "Platos Principales", disponible: true },
      { nombre: "Pasta Carbonara", precio: 14.5, categoria: "Platos Principales", disponible: true },
      { nombre: "Pollo al Curry", precio: 13.99, categoria: "Platos Principales", disponible: true },
      { nombre: "Tarta de Queso", precio: 6.5, categoria: "Postres", disponible: true },
      { nombre: "Helado Artesanal", precio: 5.0, categoria: "Postres", disponible: true },
      { nombre: "Coca-Cola", precio: 2.5, categoria: "Bebidas", disponible: true },
      { nombre: "Limonada", precio: 3.0, categoria: "Bebidas", disponible: true },
      { nombre: "Agua Mineral", precio: 1.5, categoria: "Bebidas", disponible: true },
      { nombre: "Vino Tinto (copa)", precio: 4.5, categoria: "Bebidas", disponible: true },
      { nombre: "Producto No Disponible", precio: 99.99, categoria: "Test", disponible: false },
    ];

    const inserted = await db
      .insert(schema.productos)
      .values(productosData)
      .returning({ id: schema.productos.id });

    console.log(`✓ ${inserted.length} products created`);

    // 3. Inventario for each product
    const inventarioData = inserted.map((p, i) => ({
      productoId: p.id,
      stockActual: 100 - i * 5,
      stockMinimo: 10,
    }));

    await db.insert(schema.inventario).values(inventarioData);
    console.log(`✓ ${inventarioData.length} inventory rows created`);
  } else {
    console.log("✓ Products already exist, skipping sample data");
  }

  await client.close();
  console.log("Seed completed.");
}

seed().catch((err: unknown) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
