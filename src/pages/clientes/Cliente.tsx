import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../db/supabaseClient'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { formatarTelefone } from '../../utils/telefoneMask'
import Swal from 'sweetalert2'
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react'

export const Cliente = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const clienteDoc = searchParams.get('clienteDoc')
  const clienteNome = searchParams.get('clienteNome')
  const clienteTelefone = searchParams.get('clienteTelefone')

  const [inputDoc, setInputDoc] = useState('')
  const [inputTel, setInputtel] = useState('')
  const [inputNome, setInputNome] = useState('')

  const { data: usuarios } = useQuery<any[]>({
    queryKey: ['usuarios', clienteNome, clienteDoc, clienteTelefone],
    queryFn: async () => {
      let query = supabase.from('usuarios').select(`
        id,
        nome,
        telefone,
        cpf_cnpj,
        tipo,
        assinatura_status
      `)

      if (clienteNome) {
        query = query.ilike('nome', `%${clienteNome}%`)
      }

      if (clienteDoc) {
        query = query.ilike('cpf_cnpj', `%${clienteDoc}%`)
      }

      if (clienteTelefone) {
        query = query.ilike('telefone', `%${clienteTelefone}%`)
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
      params.clienteNome = inputNome
    }

    if (inputDoc.trim()) {
      params.clienteDoc = inputDoc
    }

    if (inputTel.trim()) {
      params.clienteTelefone = inputTel
    }

    setSearchParams(params)
  }

  const handleClean = () => {
    setInputDoc('')
    setInputtel('')
    setInputNome('')
    setSearchParams({})
  }

  const handleCopyOferta = (usuario: any) => {
    const texto = `
    👤 *${usuario.nome}*
   📞 Telefone: ${formatarTelefone(usuario.telefone)}
   📦 Tipo: ${usuario.tipo}
   📋 cpf/cnpj: ${usuario.cpf_cnpj}
   ⚖️ Licença: ${usuario.assinatura_status}
   ------------------------------------------------------
   `
    navigator.clipboard
      .writeText(texto)
      .then(() => {
        Swal.fire({
          timer: 2000,
          icon: 'success',
          showCancelButton: false,
          title: 'Usuário Copiado!',
          text: 'Abra o whastapp e cole o usuário para compartilhar.',
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
    <div className="min-h-screen flex flex-col items-center px-4 py-8 bg-gradient-to-b from-purple-100 to-purple-300">
      <div className="w-full max-w-4xl flex flex-col gap-4 mb-6">
        <div className="flex justify-center gap-19">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => navigate('/menu')}
          >
            <ArrowBigLeft size={35} className=" text-purple-600" />
          </button>

          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2 font-sans">
            Procurar clientes
          </h1>

          <button
            type="button"
            className="cursor-pointer"
            onClick={() => navigate('/cadastrar-cliente')}
          >
            <ArrowBigRight size={35} className=" text-purple-600" />
          </button>
        </div>

        <div className="flex sm:flex-row w-full justify-center">
          <input
            type="text"
            placeholder="Nome do cliente"
            maxLength={50}
            value={inputNome}
            onChange={(e) => setInputNome(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (inputNome.length <= 0) return handleClean()
                handleClick()
              }
            }}
            className="w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex sm:flex-row gap-2 w-full justify-center">
          <input
            type="text"
            placeholder="CPF/CNPJ sem pontuação"
            maxLength={16}
            value={inputDoc}
            onChange={(e) => setInputDoc(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (inputDoc.length <= 0) return handleClean()
                handleClick()
              }
            }}
            className="w-full max-w-[225px]  bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="number"
            placeholder="Telefone"
            maxLength={15}
            value={inputTel}
            onChange={(e) => setInputtel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (inputTel.length <= 0) return handleClean()
                handleClick()
              }
            }}
            className="w-full max-w-[225px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex gap-2 justify-center">
          <button
            onClick={handleClick}
            className="flex-1 max-w-[225px] sm:flex-none rounded-lg bg-purple-600 text-white px-6 py-2 font-medium hover:bg-purple-700 transition"
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

      <div className="w-full max-w-md flex flex-col gap-4">
        {usuarios && usuarios.length > 0 ? (
          usuarios.map((usuario) => (
            <div
              key={usuario.id}
              className="rounded-xl border border-gray-200 bg-white shadow-md p-4"
            >
              <h3 className="text-lg font-bold text-gray-800">
                {usuario.nome || 'N/A'}
              </h3>
              <p className="text-gray-600">
                <b>Tipo:</b> {usuario.tipo || 'N/A'}
              </p>
              <p className="text-gray-600">
                <b>Cpf/Cnpj:</b> {usuario.cpf_cnpj || 'N/A'}
              </p>

              <p className="text-gray-600">
                <b>Telefone:</b> {formatarTelefone(usuario.telefone) || 'N/A'}
              </p>

              <button
                onClick={() => handleCopyOferta(usuario)}
                className="mt-4 w-full rounded-lg bg-purple-500 text-white px-4 py-2 font-medium hover:bg-purple-600 transition"
              >
                📱 Copiar para WhatsApp
              </button>
            </div>
          ))
        ) : (
          <div>
            <p className="text-gray-500 text-center">
              Nenhum cliente encontrado
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
