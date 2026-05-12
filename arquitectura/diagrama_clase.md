@startuml
skinparam classAttributeIconSize 0
skinparam monochrome true
skinparam shadowing false

' --- CLASES ---

abstract class Usuario << (A,#ADD1B2) >> {
  - id: int
  - nombre: string
  - email: string
  - password: string
  - rol: string
  - estado: boolean
  + login()
  + logout()
}

class Administrador {
  + gestionarUsuarios()
  + verReportes()
  + gestionarProductos()
  + configurarSistema()
  + gestionarInventario()
  + gestionarProveedores()
}

class Cajero {
  + procesarPago()
  + emitirComprobante()
}

class Cocinero {
  + verPedidos()
  + actualizarEstado()
}

class Mesero {
  + registrarPedido()
  + actualizarPedido()
  + consultarEstadoPedido()
}

class Cliente {
  - id: int
  - nombre: string
  - telefono: string
  + realizarPedido()
  + verEstadoPedido()
}

class Pedido {
  - id: int
  - fecha: Date
  - estado: string
  - total: decimal
  - tipo: string
  + calcularTotal()
  + cambiarEstado()
}

class DetallePedido {
  - cantidad: int
  - precioUnitario: decimal
  - subtotal: decimal
  + calcularSubtotal()
}

class Producto {
  - id: int
  - nombre: string
  - precio: decimal
  - categoria: string
  - disponible: boolean
}

class Pago {
  - id: int
  - monto: decimal
  - metodo: string
  - estado: string
  + procesar()
  + confirmar()
}

class PasarelaPago {
  + procesarPago()
}

class Reporte {
  - tipo: string
  - fechaInicio: Date
  - fechaFin: Date
  + generar()
}

class OrdenCompra {
  - id: int
  - fecha: Date
  - estado: string
  + generarOrden()
  + actualizarEstado()
}

class Proveedor {
  - id: int
  - nombre: string
  - contacto: string
}

class Inventario {
  - id: int
  - stockActual: int
  - stockMinimo: int
  + actualizarStock()
  + verificarStock()
}

' --- RELACIONES ---

' 1. Herencia (Generalización)
Usuario <|-- Administrador
Usuario <|-- Cajero
Usuario <|-- Cocinero
Usuario <|-- Mesero

' 2. Dependencia
Administrador ..> Reporte
Pago ..> PasarelaPago : usa

' 3. Asociación
Cliente "1" -- "0..*" Pedido
Mesero "1" -- "0..*" Pedido
Pedido "1" -- "1" Pago
OrdenCompra "*" -- "1" Proveedor
DetallePedido "*" -- "1" Producto
Producto "1" -- "1" Inventario

' 4. Composición (NUEVA: El 'todo' es el Pedido, la 'parte' es el Detalle)
' Un detalle de pedido se destruye si se elimina el pedido.
Pedido "1" *-- "1..*" DetallePedido

' 5. Agregación (NUEVA: El 'todo' es la OrdenCompra, la 'parte' son los Productos)
' La orden agrupa productos, pero los productos existen de forma independiente en el sistema.
OrdenCompra "*" o-- "*" Producto

@enduml
