@startuml
title Diagrama de Paquetes - ERP Restaurante Cliente/Servidor

package "ClienteApp" {

  package "Presentacion" {
    [VistaCliente]
    [VistaMesero]
    [VistaCajero]
    [VistaAdministrador]
  }

}

package "ServidorERP" {

  package "LogicaNegocio" {

    package "Pedidos" {
      [Pedido]
      [DetallePedido]
    }

    package "Pagos" {
      [Pago]
    }

    package "Productos" {
      [Producto]
    }

    package "Inventario" as PkgInventario {
      [Inventario]
    }

    package "Compras" {
      [OrdenCompra]
      [Proveedor]
    }

    package "Reportes" {
      [Reporte]
    }

    package "Usuarios" {
      [Usuario]
    }

  }

  package "API" {
    [APIPedidos]
    [APIPagos]
    [APIProductos]
    [APICompras]
    [APIReportes]
    [APIUsuarios]
  }

  package "BaseDatos" {
    [ERP_Restaurante_DB]
  }

}

' ─── Relaciones Presentacion → API ───
[VistaCliente]       ..> [APIPedidos]   : <<use>>
[VistaMesero]        ..> [APIPedidos]   : <<use>>
[VistaMesero]        ..> [APIProductos] : <<use>>
[VistaCajero]        ..> [APIPagos]     : <<use>>
[VistaAdministrador] ..> [APIUsuarios]  : <<use>>
[VistaAdministrador] ..> [APIReportes]  : <<use>>
[VistaAdministrador] ..> [APICompras]   : <<use>>

' ─── Relaciones API → LogicaNegocio ───
[APIPedidos]   ..> [Pedido]        : <<use>>
[APIPagos]     ..> [Pago]          : <<use>>
[APIProductos] ..> [Producto]      : <<use>>
[APICompras]   ..> [OrdenCompra]   : <<use>>
[APIReportes]  ..> [Reporte]       : <<use>>
[APIUsuarios]  ..> [Usuario]: <<use>>

' ─── Relaciones LogicaNegocio → BaseDatos ───
[Pedido]         ..> [ERP_Restaurante_DB] : <<access>>
[Pago]           ..> [ERP_Restaurante_DB] : <<access>>
[Producto]       ..> [ERP_Restaurante_DB] : <<access>>
[OrdenCompra]    ..> [ERP_Restaurante_DB] : <<access>>
[Reporte]        ..> [ERP_Restaurante_DB] : <<access>>
[Usuario] ..> [ERP_Restaurante_DB] : <<access>>
[Inventario]     ..> [ERP_Restaurante_DB] : <<access>>

@enduml
