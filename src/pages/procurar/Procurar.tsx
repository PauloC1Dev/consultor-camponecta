import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../db/supabaseClient'
import { useSearchParams } from 'react-router-dom'
import { Divider } from '@mui/material'

export const Procurar = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const ofertaNome = searchParams.get('ofertaNome')

  const [inputValue, setInputValue] = useState('')

  const { data: ofertas, error } = useQuery<any[]>({
    queryKey: ['ofertas', ofertaNome],
    queryFn: async () => {
      let query = supabase.from('ofertas').select(`
        id,
        nome,
        tipo,
        quantidade,
        unidade_medida,
        valor,
        data_validade_fim,
        estado,
        cidade,
        usuarios (
          nome,
          telefone
        )
      `)

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
        const dataValidade = oferta.data_validade_fim
          ? new Date(oferta.data_validade_fim).toLocaleDateString('pt-BR')
          : 'Sem data'

        const fornecedor = oferta.usuarios
          ? oferta.usuarios.nome
          : 'Não informado'
        const telefone = oferta.usuarios
          ? oferta.usuarios.telefone
          : 'Não informado'

        return `${index + 1}. 🛒 *${oferta.nome}*
   📦 Tipo: ${oferta.tipo}
   🔢 Quantidade: ${oferta.quantidade} ${oferta.unidade_medida}
   💰 Valor: R$ ${oferta.valor}
   📅 Validade até: ${dataValidade}
   📍 Local: ${oferta.estado}/${oferta.cidade}
   👤 Fornecedor: ${fornecedor}
   📞 Telefone: ${telefone}`
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
    <div className="flex flex-col items-center px-4 py-8">
      {/* Campo de busca */}
      <div className="w-full max-w-md flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="text"
          placeholder="Nome do produto"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (inputValue.length <= 0) return handleClean()
              handleClick()
            }
          }}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <div className="flex gap-2 sm:flex-row">
          <button
            onClick={handleClick}
            className="rounded-lg bg-emerald-600 text-white px-4 py-2 font-medium hover:bg-emerald-700 transition w-full sm:w-auto"
          >
            Procurar
          </button>
          <button
            onClick={handleClean}
            className="rounded-lg bg-gray-400 text-white px-4 py-2 font-medium hover:bg-gray-500 transition w-full sm:w-auto"
          >
            Limpar
          </button>
        </div>
      </div>

      {ofertas && ofertas.length > 0 && (
        <div className="w-full max-w-md mb-6">
          <button
            onClick={handleCopyAllOferta}
            className="w-full rounded-lg bg-emerald-700 text-white px-4 py-3 font-semibold shadow hover:bg-emerald-800 transition"
          >
            📱 Copiar Todas as Ofertas
          </button>
        </div>
      )}

      <div className="w-full max-w-md flex flex-col gap-4">
        {ofertas && ofertas.length > 0 ? (
          ofertas.map((oferta) => (
            <div
              key={oferta.id}
              className="rounded-xl border border-gray-200 bg-white shadow-md p-4"
            >
              <h3 className="text-lg font-bold text-gray-800">{oferta.nome}</h3>
              <p className="text-gray-600">
                <b>Tipo:</b> {oferta.tipo}
              </p>
              <p className="text-gray-600">
                <b>Quantidade:</b> {oferta.quantidade} {oferta.unidade_medida}
              </p>
              <p className="text-gray-800 font-medium">
                <b>Valor:</b>{' '}
                <span className="text-emerald-600">R$ {oferta.valor}</span>
              </p>
              <p className="text-gray-600">
                <b>Validade até:</b>{' '}
                {oferta.data_validade_fim
                  ? new Date(oferta.data_validade_fim).toLocaleDateString(
                      'pt-BR'
                    )
                  : 'Sem data'}
              </p>
              <p className="text-gray-600 mb-1">
                <b>Local:</b> {oferta.estado}/{oferta.cidade}
              </p>
              <Divider className="my-2 text-gray-300" />
              <p className="text-gray-600 mt-1">
                <b>Fornecedor:</b> {oferta.usuarios && oferta.usuarios.nome}
              </p>
              <p className="text-gray-600">
                <b>Telefone:</b> {oferta.usuarios && oferta.usuarios.telefone}
              </p>

              <button
                onClick={() => handleCopyOferta(oferta)}
                className="mt-4 w-full rounded-lg bg-emerald-500 text-white px-4 py-2 font-medium hover:bg-emerald-600 transition"
              >
                📱 Copiar para WhatsApp
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">Nenhuma oferta encontrada</p>
        )}
      </div>
    </div>
  )
}
