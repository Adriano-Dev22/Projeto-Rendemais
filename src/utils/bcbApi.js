// ============================================
// API DO BANCO CENTRAL DO BRASIL
// ============================================

const BCB = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs' //Ainda vou colocar

// Busca IPCA acumulado dos últimos 12 meses
export async function buscarIPCA() {
  try {
    const res = await fetch(`${BCB}.433/dados/ultimos/12?formato=json`)
    const dados = await res.json()
    const acumulado = dados.reduce(
      (acc, d) => acc * (1 + parseFloat(d.valor) / 100), 1
    ) - 1
    return parseFloat((acumulado * 100).toFixed(2))
  } catch {
    return 4.5 // Valor padrão se a API falhar
  }
}

// Busca CDI acumulado dos últimos 252 dias úteis
export async function buscarCDI() {
  try {
    const res = await fetch(`${BCB}.12/dados/ultimos/252?formato=json`)
    const dados = await res.json()
    const acumulado = dados.reduce(
      (acc, d) => acc * (1 + parseFloat(d.valor) / 100), 1
    ) - 1
    return parseFloat((acumulado * 100).toFixed(2))
  } catch {
    return 10.65 // Valor padrão se a API falhar
  }
}