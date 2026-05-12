CREATE TABLE `clientes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`telefono` text
);
--> statement-breakpoint
CREATE TABLE `detalles_pedidos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pedido_id` integer NOT NULL,
	`producto_id` integer NOT NULL,
	`cantidad` integer NOT NULL,
	`precio_unitario` real NOT NULL,
	`subtotal` real NOT NULL,
	FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `inventario` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`producto_id` integer NOT NULL,
	`stock_actual` integer DEFAULT 0 NOT NULL,
	`stock_minimo` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `inventario_producto_id_unique` ON `inventario` (`producto_id`);--> statement-breakpoint
CREATE TABLE `ordenes_compra` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`proveedor_id` integer NOT NULL,
	`fecha` integer NOT NULL,
	`estado` text NOT NULL,
	FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ordenes_compra_productos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`orden_compra_id` integer NOT NULL,
	`producto_id` integer NOT NULL,
	`cantidad` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`orden_compra_id`) REFERENCES `ordenes_compra`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pagos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pedido_id` integer NOT NULL,
	`monto` real NOT NULL,
	`metodo` text NOT NULL,
	`estado` text NOT NULL,
	FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pagos_pedido_id_unique` ON `pagos` (`pedido_id`);--> statement-breakpoint
CREATE TABLE `pedidos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cliente_id` integer NOT NULL,
	`usuario_id` integer NOT NULL,
	`fecha` integer NOT NULL,
	`estado` text NOT NULL,
	`total` real DEFAULT 0 NOT NULL,
	`tipo` text NOT NULL,
	FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `productos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`precio` real NOT NULL,
	`categoria` text NOT NULL,
	`disponible` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `proveedores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`contacto` text
);
--> statement-breakpoint
CREATE TABLE `reportes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tipo` text NOT NULL,
	`fecha_inicio` integer NOT NULL,
	`fecha_fin` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`rol` text NOT NULL,
	`estado` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_email_unique` ON `usuarios` (`email`);