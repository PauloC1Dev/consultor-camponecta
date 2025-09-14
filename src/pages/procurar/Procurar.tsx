import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../db/supabaseClient'
import { useSearchParams } from 'react-router-dom'

export const Procurar = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const ofertaNome = searchParams.get('ofertaNome')

  const [inputValue, setInputValue] = useState('')

  const { data: ofertas, error } = useQuery({
    queryKey: ['ofertas', ofertaNome],
    queryFn: async () => {
      let query = supabase
        .from('ofertas')
        .select('id, nome, tipo, quantidade, valor')

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
    setInputValue('')
    setSearchParams({})
  }

  const handleCopyOferta = (oferta: any) => {
    const texto = `🛒 *${oferta.nome}*\n📦 Tipo: ${oferta.tipo}\n🔢 Quantidade: ${oferta.quantidade}\n💰 Valor: R$ ${oferta.valor}`

    navigator.clipboard
      .writeText(texto)
      .then(() => {
        alert('Oferta copiada para o clipboard! 📋')
      })
      .catch(() => {
        alert('Erro ao copiar. Tente novamente.')
      })
  }

  const handleCopyAllOferta = () => {
    if (!ofertas || ofertas.length === 0) {
      alert('Nenhuma oferta para copiar!')
      return
    }

    const textoCompleto = ofertas
      .map((oferta, index) => {
        return `${index + 1}. 🛒 *${oferta.nome}*\n   📦 Tipo: ${oferta.tipo}\n   🔢 Quantidade: ${oferta.quantidade}\n   💰 Valor: R$ ${oferta.valor}`
      })
      .join('\n\n')

    const textoFinal = `📋 *LISTA DE OFERTAS*\n\n${textoCompleto}\n\n✨ Total de ofertas: ${ofertas.length}`

    navigator.clipboard
      .writeText(textoFinal)
      .then(() => {
        alert(`${ofertas.length} ofertas copiadas para o clipboard! 📋`)
      })
      .catch(() => {
        alert('Erro ao copiar. Tente novamente.')
      })
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

      <div>
        {ofertas && ofertas.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <button
              style={{
                color: 'white',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold',
                borderRadius: '5px',
                padding: '12px 20px',
                backgroundColor: '#128C7E',
              }}
              onClick={handleCopyAllOferta}
            >
              📱 Copiar Todas as Ofertas
            </button>
          </div>
        )}

        {ofertas && ofertas.length > 0 ? (
          ofertas.map((oferta) => (
            <div>
              <div key={oferta.id}>
                <h3>{oferta.nome}</h3>
                <p>Tipo: {oferta.tipo}</p>
                <p>Quantidade: {oferta.quantidade}</p>
                <p>Valor: R$ {oferta.valor}</p>
              </div>
              <button
                onClick={() => handleCopyOferta(oferta)}
                style={{
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '5px',
                  padding: '8px 12px',
                  backgroundColor: '#25D366',
                }}
              >
                📱 Copiar para WhatsApp
              </button>
            </div>
          ))
        ) : (
          <p>Nenhuma oferta encontrada</p>
        )}
      </div>
    </>
  )
}
