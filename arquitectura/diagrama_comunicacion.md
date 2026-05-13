@startuml
skinparam monochrome true
skinparam shadowing false
skinparam ObjectBackgroundColor #5AABEC
skinparam ObjectBorderColor #2980C4
skinparam ObjectFontColor #042C53
skinparam ArrowColor #2980C4

title Diagrama de Comunicación - Gestión de Pedido y Pago

' --- OBJETOS (participantes) ---
object ":Cliente" as C
object ":Mesero" as M
object ":Pedido" as P
object ":DetallePedido" as DP
object ":Producto" as PR
object ":Inventario" as I
object ":Cocinero" as CO
object ":Cajero" as CA
object ":Pago" as PAG
object ":PasarelaPago" as PP
object ":Reporte" as R

' --- LAYOUT HINTS ---
C -[hidden]right- M
M -[hidden]right- P
P -[hidden]right- CO
P -[hidden]down- DP
DP -[hidden]right- PR
PR -[hidden]right- I
CA -[hidden]right- PAG
PAG -[hidden]right- PP

' --- ENLACES Y MENSAJES ---
C --> M : 1: verMenú()\n1.1: seleccionarProductos()
M --> P : 2: registrarPedido(cliente, detalle[])
P --> DP : 2.1: crearDetalle(producto, cantidad)
DP --> PR : 2.1.1: obtenerPrecio()
PR --> I : 2.2: verificarStock(producto)
I --> I : 2.2.1: actualizarStock(-cantidad)
I --> P : 2.3: stockConfirmado

P --> CO : 3: notificarPedido()
CO --> P : 3.1: cambiarEstado(En_Preparacion)
CO --> P : 3.2: cambiarEstado(Listo)
P --> M : 4: notificarListo()

M --> C : 5: entregarPedido()
M --> P : 5.1: cambiarEstado(Entregado)

C --> CA : 6: solicitarPago()
CA --> PAG : 6.1: crearPago(pedido, monto, metodo)
PAG --> PP : 6.1.1: procesarTransaccion(monto)
PP --> PAG : 6.1.2: confirmarTransaccion()
PAG --> P : 6.2: cambiarEstado(Pagado)
CA --> C : 7: entregarComprobante()

P --> R : 8: generarReporte(venta)

note right of P
  El objeto Pedido coordina
  la comunicación central
  entre todos los participantes.
end note

@enduml
