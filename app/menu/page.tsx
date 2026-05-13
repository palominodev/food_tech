import { getMenu, groupByCategory } from "@/features/menu/services/get-menu";

export const metadata = {
  title: "Menú | Chicken Food",
  description: "Descubre nuestro menú de pollo fresco y delicioso",
};

export default async function MenuPage() {
  const items = await getMenu();
  const grouped = groupByCategory(items);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-foreground mb-2">
          Nuestro Menú
        </h1>
        <p className="text-foreground/70 mb-10">
          Explora nuestra selección de productos preparados con ingredientes de
          calidad.
        </p>

        {grouped.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-foreground/60">
              No hay productos disponibles en este momento.
            </p>
            <p className="text-foreground/40 mt-2">
              Vuelve más tarde para ver nuestras novedades.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {grouped.map((group) => (
              <section key={group.categoria}>
                <h2 className="text-2xl font-bold text-foreground mb-6 border-b border-foreground/10 pb-2">
                  {group.categoria}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-surface border border-foreground/5 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {item.nombre}
                        </h3>
                        <span className="text-primary font-bold text-lg">
                          ${item.precio.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/50">
                        {item.categoria}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
