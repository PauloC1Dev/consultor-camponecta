import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../db/supabaseClient'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export const Procurar = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const ofertaNome = searchParams.get('ofertaNome')

  const [inputValue, setInputValue] = useState('')

  const { data: ofertas, error } = useQuery({
    // Inclui ofertaNome na queryKey para revalidar quando o parâmetro mudar
    queryKey: ['ofertas', ofertaNome],
    queryFn: async () => {
      let query = supabase
        .from('ofertas')
        .select('id, nome, tipo, quantidade, valor')

      // Adiciona o filtro LIKE se ofertaNome existir
      if (ofertaNome) {
        query = query.ilike('nome', `%${ofertaNome}%`)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  const handleClick = () => {
    if (inputValue.trim()) {
      setSearchParams({ ofertaNome: inputValue })
    }
  }

  const handleClean = () => {
    setInputValue('') // Limpa o input
    setSearchParams({}) // Remove todos os parâmetros da URL
  }

  return (
    <>
      <input
        type="text"
        placeholder="Maçã..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (inputValue.length <= 0) return handleClean()
            handleClick()
          }
        }}
      />

      <button onClick={handleClick}>Procurar</button>

      <button onClick={handleClean}>Limpar</button>

      {/* Lista das ofertas */}
      <div>
        {ofertas && ofertas.length > 0 ? (
          ofertas.map((oferta) => (
            <div key={oferta.id}>
              <h3>{oferta.nome}</h3>
              <p>Tipo: {oferta.tipo}</p>
              <p>Quantidade: {oferta.quantidade}</p>
              <p>Valor: R$ {oferta.valor}</p>
            </div>
          ))
        ) : (
          <p>Nenhuma oferta encontrada</p>
        )}
      </div>
    </>
  )
}
