import React from "react";

export const metadata = {
  title: "Nosotros | Food Tech",
  description: "Conoce al equipo detrás de Food Tech",
};

const teamMembers = [
  {
    name: "Victor Manuel",
    lastName: "Jordan Solis",
    role: "El Inmortal de Main",
    story:
      "Quizás el único humano que hace 'git push --force' a la rama main y sobrevive para contarlo. Asegura que su código se documenta solo, pero aún estamos esperando que hable.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    name: "Alejandro Daniel",
    lastName: "Quispe Nieto",
    role: "El Filósofo",
    story:
      "Puede pasar horas debatiendo la profunda diferencia entre null y undefined, pero olvida el await en cada promesa. Su café siempre está frío.",
    color: "from-purple-500 to-indigo-400",
  },
  {
    name: "Gabriela Fumiko",
    lastName: "Furukawa Oki",
    role: "La Francotiradora del CSS",
    story:
      "Capaz de notar que un div está desviado 0.5 pixeles a simple vista. Se rumorea que sueña en Flexbox y sus pesadillas están hechas de float: left.",
    color: "from-pink-500 to-rose-400",
  },
  {
    name: "Patricio",
    lastName: "Rios Cristian",
    role: "El Solucionador",
    story:
      "Su técnica principal de debugging es poner console.log('aquí') hasta que la consola parece un poema abstracto. Si funciona, no lo toques.",
    color: "from-emerald-500 to-teal-400",
  },
  {
    name: "Alexis Daniel",
    lastName: "Pereyra Herencia",
    role: "El Optimista",
    story:
      "Siempre estima que un feature tomará 'un par de horas' los viernes a las 4:59 PM. Sus 'pequeños cambios' suelen requerir refactorizar media base de datos.",
    color: "from-amber-500 to-orange-400",
  },
  {
    name: "Jerimi Scott",
    lastName: "Palomino Fernandez",
    role: "El Arquitecto Oscuro",
    story:
      "Dibuja diagramas de arquitectura tan complejos que el equipo cree que son planos para invocar a Cthulhu. Le tiene alergia a lo 'simple'.",
    color: "from-red-500 to-orange-500",
  },
];

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Background ambient effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-slate-200 to-slate-500 mb-6 tracking-tight">
            Conoce al <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">Desastre</span>... digo, al Equipo
          </h1>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Escribimos código, rompemos producción y, a veces, sabemos lo que estamos haciendo.
            Esta es la historia real detrás de los commits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group relative rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 overflow-hidden hover:border-slate-700 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-900/50 flex flex-col h-full"
            >
              {/* Top gradient bar */}
              <div className={`h-2 w-full bg-linear-to-r ${member.color}`}></div>

              <div className="p-8 grow flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-2xl font-bold text-slate-300">
                      {member.name.charAt(0)}{member.lastName.charAt(0)}
                    </span>
                  </div>
                  <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-800/80 text-slate-300 border border-slate-700">
                    {member.role}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-1">
                  {member.name}
                </h3>
                <h4 className="text-lg font-medium text-slate-400 mb-6">
                  {member.lastName}
                </h4>

                <div className="relative">
                  <span className="text-4xl text-slate-700 absolute -top-4 -left-2 font-serif opacity-50">"</span>
                  <p className="text-slate-300 leading-relaxed font-light z-10 relative pl-4">
                    {member.story}
                  </p>
                </div>
              </div>

              {/* Decorative hover effect */}
              <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t ${member.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
