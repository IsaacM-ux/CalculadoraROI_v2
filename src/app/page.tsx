import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-800 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Herramienta gratuita
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            ¿Cuánto puedes{' '}
            <span className="text-green-600">ahorrar</span>
            {' '}con un drone agrícola?
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Compara los costos reales de fumigación y siembra: bomba de espalda vs tractor vs drone.
            Calcula tu ROI en minutos.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/calculadora"
              className="inline-flex items-center justify-center rounded-xl bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-green-700 transition-colors"
            >
              Calcular mi ROI
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-12">
            Tres métodos, una comparación clara
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border p-6 border-red-200 bg-red-50">
              <span className="text-4xl">🎒</span>
              <h3 className="mt-4 text-lg font-semibold text-red-900">Bomba de Espalda</h3>
              <p className="mt-2 text-sm text-red-700">
                Alto costo de mano de obra, 20% de desperdicio de insumos, exposición a químicos y tiempos largos de aplicación.
              </p>
            </div>
            <div className="rounded-2xl border p-6 border-amber-200 bg-amber-50">
              <span className="text-4xl">🚜</span>
              <h3 className="mt-4 text-lg font-semibold text-amber-900">Tractor Pulverizador</h3>
              <p className="mt-2 text-sm text-amber-700">
                Consume combustible, daña 3-5% del cultivo por pisoteo, no opera en terreno irregular y requiere mantenimiento costoso.
              </p>
            </div>
            <div className="rounded-2xl border p-6 border-green-200 bg-green-50">
              <span className="text-4xl">🛸</span>
              <h3 className="mt-4 text-lg font-semibold text-green-900">Drone Agrícola</h3>
              <p className="mt-2 text-sm text-green-700">
                Reduce insumos 20-30%, cero daño al cultivo, opera en cualquier terreno y cubre más hectáreas por hora.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-12">
            ¿Cómo funciona?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white font-bold text-lg">1</div>
              <h3 className="mt-4 font-semibold text-gray-900">Elige tu cultivo</h3>
              <p className="mt-1 text-sm text-gray-500">Selecciona entre 8 cultivos con datos precargados</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white font-bold text-lg">2</div>
              <h3 className="mt-4 font-semibold text-gray-900">Ingresa tus datos</h3>
              <p className="mt-1 text-sm text-gray-500">Superficie, aplicaciones y costos actuales</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white font-bold text-lg">3</div>
              <h3 className="mt-4 font-semibold text-gray-900">Compara métodos</h3>
              <p className="mt-1 text-sm text-gray-500">Manual, tractor y drone lado a lado</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white font-bold text-lg">4</div>
              <h3 className="mt-4 font-semibold text-gray-900">Descarga tu reporte</h3>
              <p className="mt-1 text-sm text-gray-500">PDF con gráficas y ahorro calculado</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/calculadora"
              className="inline-flex items-center justify-center rounded-xl bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-green-700 transition-colors"
            >
              Comenzar Cálculo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-gray-400">
          <p>Calculadora ROI Drones Agrícolas — Valores de referencia. Ajuste según su realidad.</p>
        </div>
      </footer>
    </main>
  );
}
