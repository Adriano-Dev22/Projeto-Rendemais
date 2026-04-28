function Landing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <span className="text-2xl font-bold text-emerald-400">Veskan</span>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition">Funcionalidades</a>
          <a href="#" className="hover:text-white transition">Planos</a>
          <a href="#" className="hover:text-white transition">Sobre</a>
        </div>
        <div className="flex gap-3">
          <button className="text-sm text-gray-400 hover:text-white transition px-4 py-2">
            Entrar
          </button>
          <button className="text-sm bg-emerald-500 hover:bg-emerald-400 transition text-black font-semibold px-4 py-2 rounded-lg">
            Começar grátis
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-20">
        <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full mb-6">
          Plataforma de investimentos inteligentes
        </span>
        <h1 className="text-5xl font-bold leading-tight max-w-3xl mb-6">
          Descubra quanto seu dinheiro
          <span className="text-emerald-400"> realmente rende</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mb-10">
          O Veskan calcula sua rentabilidade real — descontando inflação, impostos e taxas. 
          Sem enrolação, sem letra miúda.
        </p>
        <div className="flex gap-4">
          <button className="bg-emerald-500 hover:bg-emerald-400 transition text-black font-semibold px-6 py-3 rounded-lg text-sm">
            Simular agora — é grátis
          </button>
          <button className="border border-gray-700 hover:border-gray-500 transition text-gray-300 px-6 py-3 rounded-lg text-sm">
            Ver como funciona
          </button>
        </div>
      </section>

      {/* CARDS DE FEATURES */}
      <section className="px-8 pb-24 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-emerald-400 text-2xl mb-3">📈</div>
          <h3 className="font-semibold mb-2">Rentabilidade real</h3>
          <p className="text-gray-400 text-sm">Veja o quanto você ganhou de verdade, depois da inflação passar por cima.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-emerald-400 text-2xl mb-3">🧮</div>
          <h3 className="font-semibold mb-2">Cálculo automático de IR</h3>
          <p className="text-gray-400 text-sm">A tabela regressiva aplicada automaticamente — sem você precisar saber de cor.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-emerald-400 text-2xl mb-3">⚡</div>
          <h3 className="font-semibold mb-2">Simule em segundos</h3>
          <p className="text-gray-400 text-sm">Digite o valor, a taxa e o prazo. O Veskan faz o resto em tempo real.</p>
        </div>
      </section>

    </div>
  )
}

export default Landing