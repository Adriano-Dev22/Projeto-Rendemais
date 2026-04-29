import { useState, useMemo } from 'react'
import { calcularBasico, calcularPremium, IR_TABLE } from '../utils/calculator'

export function useCalculator() {
  const [params, setParams] = useState({
    principal: 10000,
    taxaAnual: 12,
    anos: 5,
    ipca: 4.5,
    aporteMensal: 500,
    tipoAtivo: 'rf_longo',
    taxaAdm: 0,
  })

  const resultadoBasico = useMemo(
    () => calcularBasico(params),
    [params.principal, params.taxaAnual, params.anos, params.ipca]
  )

  const resultadoPremium = useMemo(() => {
    const { aliquota } = IR_TABLE[params.tipoAtivo]
    return calcularPremium({ ...params, aliquotaIR: aliquota })
  }, [params])

  function atualizar(campo, valor) {
    setParams(prev => ({ ...prev, [campo]: Number(valor) }))
  }

  return { params, atualizar, resultadoBasico, resultadoPremium, IR_TABLE }
}