@startuml
skinparam StateBackgroundColor #5AABEC
skinparam StateBorderColor #2980C4
skinparam StateFontColor #042C53
skinparam StateFontSize 13
skinparam ArrowColor #2980C4
skinparam monochrome true
skinparam shadowing false

title Diagrama de Estados - Pedido

[*] --> Registrado : Mesero registra pedido
Registrado --> En_Preparacion : Cocinero inicia preparación
Registrado --> Cancelado : Cliente cancela o falta de stock
En_Preparacion --> Listo : Cocinero finaliza preparación
Listo --> Entregado : Mesero entrega al cliente
Entregado --> Pagado : Cajero procesa el pago exitosamente
Pagado --> [*] : Cierre del pedido
Cancelado --> [*]
@enduml
