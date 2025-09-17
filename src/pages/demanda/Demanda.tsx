import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../db/supabaseClient'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Divider } from '@mui/material'
import { formatarTelefone } from '../../utils/telefoneMask'
import Swal from 'sweetalert2'
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react'

export const Demanda = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const demandaNome = searchParams.get('demandaNome')
  const demandaEstado = searchParams.get('demandaEstado')
  const demandaCidade = searchParams.get('demandaCidade')

  const [inputNome, setInputNome] = useState('')
  const [inputCidade, setInputCidade] = useState('')
  const [inputEstado, setInputEstado] = useState('')

  const { data: demandas } = useQuery<any[]>({
    queryKey: ['demandas', demandaNome, demandaEstado, demandaCidade],
    queryFn: async () => {
      let query = supabase.from('demandas').select(`
        id,
        nome,
        tipo,
        valor,
        estado,
        cidade,
        quantidade,
        unidade_medida,
        data_validade_fim,
        usuarios (
          nome,
          telefone
        )
      `)

      if (demandaNome) {
        query = query.ilike('nome', `%${demandaNome}%`)
      }

      if (demandaEstado) {
        query = query.ilike('estado', `%${demandaEstado}%`)
      }

      if (demandaCidade) {
        query = query.ilike('cidade', `%${demandaCidade}%`)
      }

      const { data, error } = await query

      if (error) {
        Swal.fire({
          timer: 4000,
          icon: 'error',
          showCancelButton: false,
          title: 'Falha na conexão com o banco!',
          text: 'Entre em contato com o administrador ou tente novamente.',
        })
        throw new Error(error.message)
      }

      return data || []
    },
  })

  const handleClick = () => {
    const params: any = {}

    if (inputNome.trim()) {
      params.demandaNome = inputNome
    }

    if (inputEstado.trim()) {
      params.demandaEstado = inputEstado
    }

    if (inputCidade.trim()) {
      params.demandaCidade = inputCidade
    }

    setSearchParams(params)
  }

  const handleClean = () => {
    setInputNome('')
    setInputEstado('')
    setInputCidade('')
    setSearchParams({})
  }

  const handleCopyOferta = (demanda: any) => {
    const texto = `
   🛒  *${demanda.nome}*
   📦 Tipo: ${demanda.tipo}
   🔢 Quantidade: ${demanda.quantidade} ${demanda.unidade_medida}
   💰 Valor: R$ ${demanda.valor} por kg
   📅 Validade até: ${
     demanda.data_validade_fim
       ? new Date(demanda.data_validade_fim).toLocaleDateString('pt-BR')
       : 'Sem data'
   }
   📍 Local: ${demanda.estado}/${demanda.cidade}
   ------------------------------------------------------
   👤 Fornecedor: ${demanda.usuarios.nome}
   📞 Telefone: ${formatarTelefone(demanda.usuarios.telefone)}`

    navigator.clipboard
      .writeText(texto)
      .then(() => {
        Swal.fire({
          timer: 2000,
          icon: 'success',
          showCancelButton: false,
          title: 'Demanda Copiada!',
          text: 'Abra o whastapp e cole a demanda para compartilhar.',
        })
      })
      .catch(() => {
        Swal.fire({
          timer: 4000,
          icon: 'error',
          showCancelButton: false,
          title: 'Falha ao copiar!',
          text: 'Entre em contato com o administrador.',
        })
      })
  }

  const handleCopyAllOferta = () => {
    if (!demandas || demandas.length === 0) {
      Swal.fire({
        icon: 'warning',
        showCancelButton: false,
        title: '📋Nenhuma demanda para copiar!',
      })
      return
    }

    const textoCompleto = demandas
      .map((demanda, index) => {
        const dataValidade = demanda.data_validade_fim
          ? new Date(demanda.data_validade_fim).toLocaleDateString('pt-BR')
          : 'Sem data'

        const fornecedor = demanda.usuarios
          ? demanda.usuarios.nome
          : 'Não informado'
        const telefone = demanda.usuarios
          ? demanda.usuarios.telefone
          : 'Não informado'

        return `${index + 1}. 🛒 *${demanda.nome}*
   📦 Tipo: ${demanda.tipo}
   🔢 Quantidade: ${demanda.quantidade} ${demanda.unidade_medida}
   💰 Valor: R$ ${demanda.valor} por kg
   📅 Validade até: ${dataValidade}
   📍 Local: ${demanda.estado}/${demanda.cidade}
   ------------------------------------------------------
   👤 Fornecedor: ${fornecedor}
   📞 Telefone: ${formatarTelefone(telefone)}`
      })
      .join('\n\n')

    const textoFinal = `📋 *LISTA DE OFERTAS*\n\n${textoCompleto}\n\n✨ Total de ofertas: ${demandas.length}`

    navigator.clipboard
      .writeText(textoFinal)
      .then(() => {
        Swal.fire({
          timer: 2000,
          icon: 'success',
          showCancelButton: false,
          title: `📋 ${demandas.length} demandas Copiadas!`,
          text: 'Abra o whastapp e cole as demandas para compartilhar.',
        })
      })
      .catch(() => {
        Swal.fire({
          timer: 4000,
          icon: 'error',
          showCancelButton: false,
          title: 'Falha ao copiar!',
          text: 'Entre em contato com o administrador.',
        })
      })
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 bg-gradient-to-b from-blue-100 to-blue-400">
      <div className="w-full max-w-4xl flex flex-col gap-4 mb-6">
        <div className="flex justify-center gap-15">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => navigate('/menu')}
          >
            <ArrowBigLeft size={35} color="blue" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2 font-sans">
            Procurar demandas
          </h1>
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => navigate('/cadastrar-demanda')}
          >
            <ArrowBigRight size={35} color="blue" />
          </button>
        </div>
        <div className="flex sm:flex-row w-full justify-center">
          <input
            type="text"
            placeholder="Nome do produto"
            maxLength={50}
            value={inputNome}
            onChange={(e) => setInputNome(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (inputNome.length <= 0) return handleClean()
                handleClick()
              }
            }}
            className="w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
        </div>

        <div className="flex sm:flex-row gap-2 w-full justify-center">
          <input
            type="text"
            placeholder="Estado"
            maxLength={50}
            value={inputEstado}
            onChange={(e) => setInputEstado(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (inputEstado.length <= 0) return handleClean()
                handleClick()
              }
            }}
            className="w-full max-w-[225px]  bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
          />

          <input
            type="text"
            placeholder="Cidade"
            maxLength={50}
            value={inputCidade}
            onChange={(e) => setInputCidade(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (inputCidade.length <= 0) return handleClean()
                handleClick()
              }
            }}
            className="w-full max-w-[225px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
        </div>

        <div className="flex gap-2 justify-center">
          <button
            onClick={handleClick}
            className="flex-1 max-w-[225px] sm:flex-none rounded-lg bg-blue-700 text-white px-6 py-2 font-medium hover:bg-blue-800 transition"
          >
            Procurar
          </button>
          <button
            onClick={handleClean}
            className="flex-1 max-w-[225px] sm:flex-none rounded-lg bg-gray-400 text-white px-6 py-2 font-medium hover:bg-gray-500 transition"
          >
            Limpar
          </button>
        </div>
      </div>

      {demandas && demandas.length > 0 && (
        <div className="w-full max-w-md mb-6">
          <button
            onClick={handleCopyAllOferta}
            className="w-full rounded-lg bg-blue-800 text-white px-4 py-3 font-semibold shadow hover:bg-blue-900 transition"
          >
            📱 Copiar todas as demandas
          </button>
        </div>
      )}

      <div className="w-full max-w-md flex flex-col gap-4">
        {demandas && demandas.length > 0 ? (
          demandas.map((demanda) => (
            <div
              key={demanda.id}
              className="rounded-xl border border-gray-200 bg-white shadow-md p-4"
            >
              <h3 className="text-lg font-bold text-gray-800">
                {demanda.nome || 'N/A'}
              </h3>
              <p className="text-gray-600">
                <b>Tipo:</b> {demanda.tipo || 'N/A'}
              </p>
              <p className="text-gray-600">
                <b>Quantidade:</b> {demanda.quantidade || 'N/A'}{' '}
                {demanda.unidade_medida || 'N/A'}
              </p>
              <p className="text-gray-800 font-medium">
                <b>Valor:</b>{' '}
                <span className="text-blue-700">
                  R$ {demanda.valor || 'N/A'}
                </span>
              </p>
              <p className="text-gray-600">
                <b>Validade até:</b>{' '}
                {demanda.data_validade_fim
                  ? new Date(demanda.data_validade_fim).toLocaleDateString(
                      'pt-BR'
                    )
                  : 'Sem data'}
              </p>
              <p className="text-gray-600 mb-1">
                <b>Local:</b> {demanda.estado || 'N/A'}/
                {demanda.cidade || 'N/A'}
              </p>
              <Divider className="my-2 text-gray-300" />
              <p className="text-gray-600 mt-1">
                <b>Fornecedor:</b> {demanda.usuarios.nome || 'N/A'}
              </p>
              <p className="text-gray-600">
                <b>Telefone:</b>{' '}
                {formatarTelefone(demanda.usuarios.telefone) || 'N/A'}
              </p>

              <button
                onClick={() => handleCopyOferta(demanda)}
                className="mt-4 w-full rounded-lg bg-blue-700 text-white px-4 py-2 font-medium hover:bg-blue-800 transition"
              >
                📱 Copiar para WhatsApp
              </button>
            </div>
          ))
        ) : (
          <div>
            <p className="text-gray-500 text-center">
              Nenhuma demanda encontrada
            </p>
            <img
              src="picole.gif"
              alt="Picole gif"
              className="mx-auto mt-4 w-32 h-32 opacity-50"
            />
          </div>
        )}
      </div>
    </div>
  )
}
