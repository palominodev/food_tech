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

  // 2. Seed proveedores
  console.log("Cleaning and reseeding proveedores...");
  await db.delete(schema.proveedores);
  await db.insert(schema.proveedores).values([
    { nombre: "Granja Avícola El Pollón", contacto: "ventas@elpollon.com" },
    { nombre: "Suministros Avícolas del Norte", contacto: "pedidos@san.com" },
    { nombre: "Distribuidora de Papas y Tubérculos", contacto: "logistica@papasperu.com" },
    { nombre: "Bebidas Refrescantes del Perú", contacto: "admin@bebidas.pe" },
    { nombre: "Envases y Descartables EcoFood", contacto: "ventas@ecofood.com" },
  ]);
  console.log("✓ Proveedores created");

  // 3. Clean and reseed productos + inventario
  console.log("Cleaning existing product data...");
  await db.delete(schema.inventario);
  await db.delete(schema.detallesPedidos);
  await db.delete(schema.pagos);
  await db.delete(schema.pedidos);
  await db.delete(schema.productos);

  const productosData = [
    // Entradas y Complementos
    { nombre: "Alitas BBQ (6 unidades)", precio: 12.5, categoria: "Entradas", disponible: true },
    { nombre: "Nuggets Crujientes (10 unidades)", precio: 9.9, categoria: "Entradas", disponible: true },
    { nombre: "Papas Fritas Grandes", precio: 8.5, categoria: "Entradas", disponible: true },
    { nombre: "Ensalada Coleslaw Tradicional", precio: 6.5, categoria: "Entradas", disponible: true },

    // Cubetas y Combos
    { nombre: "Cubeta Familiar (12 piezas)", precio: 45.99, categoria: "Combos", disponible: true },
    { nombre: "Combo Pareja (4 piezas + Papas + Bebida)", precio: 28.5, categoria: "Combos", disponible: true },
    { nombre: "Súper Mega Cubeta (20 piezas + 2 Papas G)", precio: 65.0, categoria: "Combos", disponible: true },
    { nombre: "Chicken Sandwich Combo", precio: 15.5, categoria: "Combos", disponible: true },

    // Piezas y Presas
    { nombre: "Presa de Pechuga", precio: 6.5, categoria: "Presas", disponible: true },
    { nombre: "Presa de Pierna", precio: 5.5, categoria: "Presas", disponible: true },
    { nombre: "Presa de Encuentro", precio: 5.8, categoria: "Presas", disponible: true },
    { nombre: "Ala de Pollo", precio: 4.5, categoria: "Presas", disponible: true },

    // Postres
    { nombre: "Pie de Manzana Caliente", precio: 6.0, categoria: "Postres", disponible: true },
    { nombre: "Helado de Vainilla y Chocolate", precio: 4.5, categoria: "Postres", disponible: true },
    { nombre: "Sundae de Caramelo", precio: 5.5, categoria: "Postres", disponible: true },

    // Bebidas
    { nombre: "Inca Kola 1L", precio: 5.5, categoria: "Bebidas", disponible: true },
    { nombre: "Coca-Cola Original 1L", precio: 5.5, categoria: "Bebidas", disponible: true },
    { nombre: "Chicha Morada de la Casa 1L", precio: 8.0, categoria: "Bebidas", disponible: true },
    { nombre: "Agua Mineral 500ml", precio: 2.5, categoria: "Bebidas", disponible: true },

    // Test / Otros
    { nombre: "Producto Especial Temporal", precio: 19.99, categoria: "Especiales", disponible: false },
  ];
  const inserted = await db
    .insert(schema.productos)
    .values(productosData)
    .returning({ id: schema.productos.id });

  console.log(`✓ ${inserted.length} products created`);

  // 4. Inventario for each product
  const inventarioData = inserted.map((p, i) => ({
    productoId: p.id,
    stockActual: 100 - i * 4,
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
