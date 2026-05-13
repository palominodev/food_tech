@startuml
skinparam monochrome true
skinparam shadowing false

title Diagrama de Temporización - Ciclo de Vida del Pedido

' --- LÍNEAS DE VIDA CON ESTADOS ---

concise "Pedido" as P
concise "Cocinero" as CO
concise "Mesero" as M
concise "Cajero" as CA
concise "Inventario" as I
concise "PasarelaPago" as PP

' --- ESCALA DE TIEMPO ---

@0
P is Registrado
CO is Inactivo
M is Registrando
CA is Inactivo
I is VerificandoStock
PP is Inactivo

@2
P is Registrado
I is StockActualizado
M is Esperando

@3
P is En_Preparacion
CO is Preparando
M is Esperando
I is Inactivo

@8
P is Listo
CO is Notificando
M is Entregando

@9
P is Entregado
CO is Inactivo
M is Inactivo

@10
P is Entregado
CA is ProcesandoPago
PP is ProcesandoTransaccion

@11
PP is Confirmado
CA is EmitendoComprobante

@12
P is Pagado
CA is Inactivo
PP is Inactivo

@13
P is Cerrado
I is ConfirmandoStock

@14
I is Inactivo

' --- RESTRICCIONES DE TIEMPO ---

@0 <-> @2 : {≤ 2 min}\nVerificación stock
@3 <-> @8 : {5-15 min}\nPreparación cocina
@8 <-> @9 : {≤ 1 min}\nEntrega al cliente
@10 <-> @12 : {≤ 2 min}\nProceso de pago
@12 <-> @14 : {≤ 2 min}\nCierre y actualización

highlight 3 to 8 #E8F4FD : Fase crítica — Preparación
highlight 10 to 12 #FCE4EC : Fase crítica — Pago

@enduml
