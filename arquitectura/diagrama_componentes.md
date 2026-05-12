@startuml
skinparam monochrome true
skinparam shadowing false

title Diagrama de Componentes - ERP Restaurante

rectangle "Sistema ERP" {
  component "Interfaz de Usuario" as UI
  component "Lógica de Negocio" as LOGICA
  component "Gestión de Usuarios" as USUARIOS
  component "Gestión de Pedidos" as PEDIDOS
  component "Inventario" as INVENTARIO
  component "Sistema de Pago" as PAGOS
  database "ERP_Restaurante_DB" as BD
}

actor "Pasarela de Pago" as PASARELA

UI --> LOGICA
LOGICA --> USUARIOS
LOGICA --> PEDIDOS
LOGICA --> INVENTARIO
PEDIDOS --> PAGOS
PAGOS --> PASARELA

USUARIOS --> BD
PEDIDOS --> BD
INVENTARIO --> BD
PAGOS --> BD
@enduml
