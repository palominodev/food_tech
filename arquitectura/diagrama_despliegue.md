@startuml
skinparam monochrome true
skinparam shadowing false

' --- NODOS ---
node "Cliente" {
  artifact "Cliente Web/PWA"
}

node "Restaurante" {
  artifact "Tablet Mesero"
  artifact "Caja POS"
  artifact "Pantalla Cocina"
  artifact "PC Administrador"
}

node "Servidor ERP" {
  artifact "Backend API"
  artifact "Modulo Inventario"
  artifact "Modulo Pedidos"
  artifact "Modulo Reportes"
  artifact "Modulo Pagos"
}

node "Base de Datos ERP_Restaurante_DB" {
  artifact "ERP_Restaurante_DB"
}

node "Pasarela de Pago" as "PasarelaPago" {
  artifact "Pasarela de Pago"
}

' --- CONEXIONES ---
"Cliente" --> "Restaurante" : Conexión a Internet
"Restaurante" --> "Servidor ERP" : Conexión a Backend
"Servidor ERP" --> "Base de Datos ERP_Restaurante_DB" : Conexión de Datos
"Servidor ERP" --> "PasarelaPago" : Conexión a Pago

@enduml
