const BCB = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs'

// IPCA acumulado 12 meses — série 433
export async function buscarIPCA() {
  try {
    const res = await fetch(`${BCB}.433/dados/ultimos/12?formato=json`)
    const dados = await res.json()
    const acumulado = dados.reduce(
      (acc, d) => acc * (1 + parseFloat(d.valor) / 100), 1
    ) - 1
    return parseFloat((acumulado * 100).toFixed(2))
  } catch {
    return 4.14
  }
}

// CDI anual — série 4389 (taxa anual já pronta)
export async function buscarCDI() {
  try {
    const res = await fetch(`${BCB}.4389/dados/ultimos/1?formato=json`)
    const dados = await res.json()
    return parseFloat(parseFloat(dados[0].valor).toFixed(2))
  } catch {
    return 10.65
  }
}