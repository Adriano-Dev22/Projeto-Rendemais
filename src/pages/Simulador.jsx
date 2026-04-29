import { useCalculator } from '../hooks/useCalculator'
import { formatarMoeda, formatarPorcentagem } from '../utils/calculator'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'

function Simulador() {
  const { params, atualizar, resultadoBasico } = useCalculator()
  const { montante, rendimentoNominal, perdaInflacao, ganhoReal, taxaRealAnual, historico } = resultadoBasico

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <a href="/" className="text-2xl font-bold text-emerald-400">Veskan</a>
        <span className="text-sm text-gray-400">Simulador de investimentos</span>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* FORMULÁRIO */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-8">Configure sua simulação</h2>

          <div className="space-y-6">

            {/* Valor inicial */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">Valor inicial</label>
                <span className="text-sm font-semibold text-emerald-400">
                  {formatarMoeda(params.principal)}
                </span>
              </div>
              <input type="range" min="1000" max="100000" step="1000"
                value={params.principal}
                onChange={e => atualizar('principal', e.target.value)}
                className="w-full accent-emerald-400"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>R$ 1.000</span><span>R$ 100.000</span>
              </div>
            </div>

            {/* Taxa anual */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">Taxa anual bruta</label>
                <span className="text-sm font-semibold text-emerald-400">
                  {formatarPorcentagem(params.taxaAnual)}
                </span>
              </div>
              <input type="range" min="1" max="25" step="0.5"
                value={params.taxaAnual}
                onChange={e => atualizar('taxaAnual', e.target.value)}
                className="w-full accent-emerald-400"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>1%</span><span>25%</span>
              </div>
            </div>

            {/* Período */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">Período</label>
                <span className="text-sm font-semibold text-emerald-400">
                  {params.anos} {params.anos === 1 ? 'ano' : 'anos'}
                </span>
              </div>
              <input type="range" min="1" max="30" step="1"
                value={params.anos}
                onChange={e => atualizar('anos', e.target.value)}
                className="w-full accent-emerald-400"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>1 ano</span><span>30 anos</span>
              </div>
            </div>

            {/* IPCA */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">Inflação (IPCA)</label>
                <span className="text-sm font-semibold text-emerald-400">
                  {formatarPorcentagem(params.ipca)}
                </span>
              </div>
              <input type="range" min="2" max="15" step="0.5"
                value={params.ipca}
                onChange={e => atualizar('ipca', e.target.value)}
                className="w-full accent-emerald-400"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>2%</span><span>15%</span>
              </div>
            </div>

          </div>
        </div>

        {/* RESULTADOS */}
        <div className="flex flex-col gap-6">

          {/* Cards de resultado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-xs text-gray-500 mb-1">Montante bruto</p>
              <p className="text-2xl font-bold text-white">{formatarMoeda(montante)}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-xs text-gray-500 mb-1">Rendimento nominal</p>
              <p className="text-2xl font-bold text-emerald-400">{formatarMoeda(rendimentoNominal)}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-xs text-gray-500 mb-1">Perda à inflação</p>
              <p className="text-2xl font-bold text-red-400">{formatarMoeda(perdaInflacao)}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-xs text-gray-500 mb-1">Ganho real</p>
              <p className={`text-2xl font-bold ${ganhoReal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatarMoeda(ganhoReal)}
              </p>
            </div>
          </div>

          {/* Taxa real */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
            <p className="text-xs text-emerald-400 mb-1">Taxa real anual (pós-inflação)</p>
            <p className="text-3xl font-bold text-emerald-400">
              {formatarPorcentagem(taxaRealAnual)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {ganhoReal >= 0
                ? '✅ Seu investimento está batendo a inflação.'
                : '⚠️ Seu investimento está perdendo para a inflação.'}
            </p>
          </div>

          {/* Gráfico */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-sm text-gray-400 mb-4">Evolução patrimonial</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={historico}>
                <XAxis dataKey="ano" stroke="#4b5563"
                  tickFormatter={v => `Ano ${v}`} tick={{ fontSize: 11 }} />
                <YAxis stroke="#4b5563" tick={{ fontSize: 11 }}
                  tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 8 }}
                  formatter={v => formatarMoeda(v)}
                  labelFormatter={v => `Ano ${v}`}
                />
                <Legend />
                <Line type="monotone" dataKey="saldo" name="Saldo bruto"
                  stroke="#34d399" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="poderCompra" name="Poder de compra"
                  stroke="#f87171" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Simulador