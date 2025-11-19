import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../db/supabaseClient'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Divider } from '@mui/material'
import { formatarTelefone } from '../../utils/telefoneMask'
import Swal from 'sweetalert2'
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react'

export const Oferta = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const ofertaNome = searchParams.get('ofertaNome')
  const ofertaEstado = searchParams.get('ofertaEstado')
  const ofertaCidade = searchParams.get('ofertaCidade')

  const [inputNome, setInputNome] = useState('')
  const [inputEstado, setInputEstado] = useState('')
  const [inputCidade, setInputCidade] = useState('')

  const { data: ofertas } = useQuery<any[]>({
    queryKey: ['ofertas', ofertaNome, ofertaEstado, ofertaCidade],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'

      let query = supabase
        .from('ofertas')
        .select(
          `
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
      `
        )
        .lte('data_validade_inicio', today)
        .gte('data_validade_fim', today)
        .is('deleted_at', null)

      if (ofertaNome) {
        query = query.ilike('nome', `%${ofertaNome}%`)
      }

      if (ofertaEstado) {
        query = query.ilike('estado', `%${ofertaEstado}%`)
      }

      if (ofertaCidade) {
        query = query.ilike('cidade', `%${ofertaCidade}%`)
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
      params.ofertaNome = inputNome
    }

    if (inputEstado.trim()) {
      params.ofertaEstado = inputEstado
    }

    if (inputCidade.trim()) {
      params.ofertaCidade = inputCidade
    }

    setSearchParams(params)
  }

  const handleClean = () => {
    setInputNome('')
    setInputEstado('')
    setInputCidade('')
    setSearchParams({})
  }

  const handleCopyOferta = (oferta: any) => {
    const texto = `
   🛒  *${oferta?.nome}*
   📦 Tipo: ${oferta.tipo}
   🔢 Quantidade: ${oferta.quantidade} ${oferta.unidade_medida}
   💰 Valor: R$ ${oferta.valor} por kg
   📅 Validade até: ${
     oferta.data_validade_fim
       ? new Date(oferta.data_validade_fim).toLocaleDateString('pt-BR')
       : 'Sem data'
   }
   📍 Local: ${oferta.estado}/${oferta.cidade}
   ------------------------------------------------------
   👤 Fornecedor: ${oferta?.usuarios?.nome}
   📞 Telefone: ${formatarTelefone(oferta.usuarios.telefone)}`

    navigator.clipboard
      .writeText(texto)
      .then(() => {
        Swal.fire({
          timer: 2000,
          icon: 'success',
          showCancelButton: false,
          title: '📋Oferta Copiada!',
          text: 'Abra o whastapp e cole a oferta para compartilhar.',
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
    if (!ofertas || ofertas.length === 0) {
      Swal.fire({
        icon: 'warning',
        showCancelButton: false,
        title: '📋Nenhuma oferta para copiar!',
      })
      return
    }

    const textoCompleto = ofertas
      .map((oferta, index) => {
        const dataValidade = oferta.data_validade_fim
          ? new Date(oferta.data_validade_fim).toLocaleDateString('pt-BR')
          : 'Sem data'

        const fornecedor = oferta.usuarios
          ? oferta.usuarios?.nome
          : 'Não informado'
        const telefone = oferta.usuarios
          ? oferta.usuarios.telefone
          : 'Não informado'

        return `${index + 1}. 🛒 *${oferta?.nome}*
   📦 Tipo: ${oferta.tipo}
   🔢 Quantidade: ${oferta.quantidade} ${oferta.unidade_medida}
   💰 Valor: R$ ${oferta.valor} por kg
   📅 Validade até: ${dataValidade}
   📍 Local: ${oferta.estado}/${oferta.cidade}
   ------------------------------------------------------
   👤 Fornecedor: ${fornecedor}
   📞 Telefone: ${formatarTelefone(telefone)}`
      })
      .join('\n\n')

    const textoFinal = `📋 *LISTA DE OFERTAS*\n\n${textoCompleto}\n\n✨ Total de ofertas: ${ofertas.length}`

    navigator.clipboard
      .writeText(textoFinal)
      .then(() => {
        Swal.fire({
          timer: 2000,
          icon: 'success',
          showCancelButton: false,
          title: `📋 ${ofertas.length} Ofertas Copiadas!`,
          text: 'Abra o whastapp e cole as ofertas para compartilhar.',
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
    <div className="min-h-screen flex flex-col items-center px-4 py-8 bg-gradient-to-b from-green-100 to-green-200">
      <div className="w-full max-w-4xl flex flex-col gap-4 mb-6">
        <div className="flex justify-center gap-21">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => navigate('/menu')}
          >
            <ArrowBigLeft size={35} className=" text-emerald-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2 font-sans">
            Procurar ofertas
          </h1>
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => navigate('/cadastrar-oferta')}
          >
            <ArrowBigRight size={35} className=" text-emerald-600" />
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
            className="w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            className="w-full max-w-[225px]  bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            className="w-full max-w-[225px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-2 justify-center">
          <button
            onClick={handleClick}
            className="flex-1 max-w-[225px] sm:flex-none rounded-lg bg-emerald-600 text-white px-6 py-2 font-medium hover:bg-emerald-700 transition"
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

      {ofertas && ofertas.length > 0 && (
        <div className="w-full max-w-md mb-6">
          <button
            onClick={handleCopyAllOferta}
            className="w-full rounded-lg bg-emerald-700 text-white px-4 py-3 font-semibold shadow hover:bg-emerald-800 transition"
          >
            📱 Copiar todas as ofertas
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
              <h3 className="text-lg font-bold text-gray-800">
                {oferta?.nome || 'N/A'}
              </h3>
              <p className="text-gray-600">
                <b>Tipo:</b> {oferta?.tipo || 'N/A'}
              </p>
              <p className="text-gray-600">
                <b>Quantidade:</b> {oferta?.quantidade || 'N/A'}{' '}
                {oferta?.unidade_medida || 'N/A'}
              </p>
              <p className="text-gray-800 font-medium">
                <b>Valor:</b>{' '}
                <span className="text-emerald-600">
                  R$ {oferta?.valor || 'N/A'}
                </span>
              </p>
              <p className="text-gray-600">
                <b>Validade até:</b>{' '}
                {oferta?.data_validade_fim
                  ? new Date(oferta?.data_validade_fim).toLocaleDateString(
                      'pt-BR'
                    )
                  : 'Sem data'}
              </p>
              <p className="text-gray-600 mb-1">
                <b>Local:</b> {oferta?.estado || 'N/A'}/
                {oferta?.cidade || 'N/A'}
              </p>
              <Divider className="my-2 text-gray-300" />
              <p className="text-gray-600 mt-1">
                <b>Fornecedor:</b> {oferta?.usuarios?.nome || 'N/A'}
              </p>
              <p className="text-gray-600">
                <b>Telefone:</b>{' '}
                {formatarTelefone(oferta?.usuarios?.telefone) || 'N/A'}
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
          <div>
            <p className="text-gray-500 text-center">
              Nenhuma oferta encontrada
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
