// MOTOR DE CÁLCULO DO VESKAN


// CÁLCULO BÁSICO — Plano Gratuito
export function calcularBasico({ principal, taxaAnual, anos, ipca }) {
  const meses = anos * 12
  const taxaMensal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1

  // Montante: M = P × (1 + i)^n
  const montante = principal * Math.pow(1 + taxaMensal, meses)
  const rendimentoNominal = montante - principal

  // Poder de compra corrigido pela inflação
  const poderCorrigido = principal * Math.pow(1 + ipca / 100, anos)
  const perdaInflacao = poderCorrigido - principal
  const ganhoReal = montante - poderCorrigido

  // Taxa real anual — Fórmula de Fisher
  const taxaRealAnual = ((1 + taxaAnual / 100) / (1 + ipca / 100) - 1) * 100

  // Histórico anual para o gráfico
  const historico = []
  for (let ano = 0; ano <= anos; ano++) {
    const mesesAno = ano * 12
    historico.push({
      ano,
      saldo: principal * Math.pow(1 + taxaMensal, mesesAno),
      poderCompra: principal * Math.pow(1 + ipca / 100, ano),
    })
  }

  return {
    montante,
    rendimentoNominal,
    perdaInflacao,
    ganhoReal,
    taxaRealAnual,
    historico,
  }
}

// CÁLCULO PREMIUM — Com aportes, IR e taxa de administração
export function calcularPremium({
  principal, taxaAnual, anos, ipca,
  aporteMensal, aliquotaIR, taxaAdm,
}) {
  const meses = anos * 12
  const taxaLiquida = taxaAnual - taxaAdm
  const taxaMensal = Math.pow(1 + taxaLiquida / 100, 1 / 12) - 1

  let saldo = principal
  const historico = [{ ano: 0, saldo: principal }]

  for (let m = 1; m <= meses; m++) {
    saldo = saldo * (1 + taxaMensal) + aporteMensal
    if (m % 12 === 0) {
      historico.push({ ano: m / 12, saldo })
    }
  }

  const totalAportado = principal + aporteMensal * meses
  const lucro = saldo - totalAportado
  const irPago = lucro > 0 ? lucro * (aliquotaIR / 100) : 0
  const montanteLiquido = saldo - irPago
  const poderCorrigido = totalAportado * Math.pow(1 + ipca / 100, anos)
  const ganhoReal = montanteLiquido - poderCorrigido

  return {
    montanteBruto: saldo,
    montanteLiquido,
    totalAportado,
    lucro,
    irPago,
    ganhoReal,
    historico,
  }
}

// TABELA DE IR — Renda fixa (tabela regressiva)
export const IR_TABLE = {
  rf_curtissimo: { label: 'Renda fixa < 6 meses', aliquota: 22.5 },
  rf_curto:      { label: 'Renda fixa 6m–1 ano',  aliquota: 20.0 },
  rf_medio:      { label: 'Renda fixa 1–2 anos',  aliquota: 17.5 },
  rf_longo:      { label: 'Renda fixa > 2 anos',  aliquota: 15.0 },
  isento:        { label: 'Isento (LCI/LCA/CRI/CRA)', aliquota: 0 },
  acoes:         { label: 'Ações',               aliquota: 15.0 },
}

// FORMATADORES — Para exibir os números na tela
export function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function formatarPorcentagem(valor) {
  return valor.toFixed(2).replace('.', ',') + '%'
}