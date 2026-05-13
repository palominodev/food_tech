@startuml
skinparam sequenceArrowThickness 1.5
skinparam sequenceArrowColor #2980C4
skinparam sequenceLifeLineBorderColor #2980C4
skinparam sequenceParticipantBackgroundColor #5AABEC
skinparam sequenceParticipantBorderColor #2980C4
skinparam sequenceParticipantFontColor #042C53
skinparam sequenceParticipantFontSize 13
skinparam sequenceBoxBackgroundColor #E6F1FB
skinparam sequenceBoxBorderColor #2980C4
skinparam shadowing false

actor Cliente
participant "Interfaz de Usuario" as UI
participant "Lógica de Negocio" as Logica
participant "Gestión de Usuarios" as GUsuarios
participant "Gestión de Pedidos" as GPedidos
participant Mesero
participant Cocinero
participant Cajero
participant "Sistema de Pago" as GPagos
participant "Pasarela de Pago" as Pasarela
participant "Inventario" as GInventario
participant Administrador
database "ERP_Restaurante_DB" as BD

' ─────────────────────────────────────
' 1. PEDIDO
' ─────────────────────────────────────
ref over Cliente, GPedidos
  Proceso de pedido
end ref

Cliente -> UI : realizarPedido()
UI -> Logica : solicitarMenuCatalogo()
Logica -> GPedidos : consultarProductos()
GPedidos -> BD : SELECT productos disponibles
BD --> GPedidos : Lista de productos
GPedidos --> UI : Mostrar menú / catálogo
UI --> Cliente : Ver menú

Cliente -> UI : seleccionarProductos()
UI -> Logica : agregarAlCarrito()
Logica -> GPedidos : calcularSubtotal()
UI --> Cliente : Mostrar carrito

Cliente -> Mesero : confirmarPedido()
Mesero -> Logica : registrarPedido()
Logica -> GPedidos : asociarCliente()
GPedidos -> GPedidos : calcularTotal()
GPedidos -> BD : INSERT Pedido + DetallePedido
BD --> GPedidos : Pedido guardado
GPedidos --> Logica : Pedido registrado
Logica --> Mesero : Confirmación
Mesero --> Cliente : Pedido confirmado

' ─────────────────────────────────────
' 3. COCINA
' ─────────────────────────────────────
ref over Logica, Cocinero
  Proceso de cocina
end ref

Logica -> Cocinero : notificarPedido()
Cocinero -> UI : verPedidos()
UI -> GPedidos : consultarEstadoPedido()
GPedidos -> BD : SELECT pedidos pendientes
BD --> GPedidos : Pedidos
GPedidos --> Cocinero : Pedido recibido

loop hasta que el pedido esté listo
  Cocinero -> Logica : actualizarEstado()
  Logica -> GPedidos : cambiarEstado()
  GPedidos -> BD : UPDATE estado pedido
  BD --> GPedidos : OK
  GPedidos --> Cocinero : Estado actualizado
end

Logica -> Mesero : notificarPedidoListo()
Mesero --> Cliente : Entrega del pedido

' ─────────────────────────────────────
' 4. PAGO
' ─────────────────────────────────────
ref over Cajero, Pasarela
  Proceso de pago
end ref

Cliente -> Cajero : solicitarPago()
Cajero -> GPagos : procesarPago()
GPagos -> BD : INSERT Pago

alt Pago en efectivo
  GPagos --> Cajero : Registrar monto en efectivo
else Pago digital
  GPagos -> Pasarela : procesar()
  Pasarela --> GPagos : Pago confirmado
  GPagos -> GPagos : confirmar()
end

GPagos -> BD : UPDATE estado pago
BD --> GPagos : OK
Cajero -> GPagos : emitirComprobante()
GPagos --> UI : Comprobante generado
UI --> Cliente : Comprobante emitido

' ─────────────────────────────────────
' 5. INVENTARIO
' ─────────────────────────────────────
ref over GInventario, Administrador
  Gestión de inventario
end ref

GPedidos -> GInventario : actualizarStock()
GInventario -> BD : UPDATE stock productos
GInventario -> GInventario : verificarStock()

alt Stock bajo mínimo
  GInventario -> Administrador : alertaStockBajo()
  Administrador -> Logica : gestionarProveedores()
  Logica -> BD : INSERT OrdenCompra
  BD --> Logica : Orden guardada
  Logica --> Administrador : OrdenCompra generada
else Stock normal
  GInventario --> Logica : Stock OK
end

' ─────────────────────────────────────
' 6. REPORTES
' ─────────────────────────────────────
Administrador -> UI : verReportes()
UI -> Logica : solicitarReporte()
Logica -> BD : SELECT datos consolidados
BD --> Logica : Datos
Logica -> Logica : generar()
Logica --> UI : Reporte generado
UI --> Administrador : Reporte mostrado
@enduml