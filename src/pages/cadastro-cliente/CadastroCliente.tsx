import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react'
import { supabase } from '../../db/supabaseClient'
import Swal from 'sweetalert2'
import { validadorCadastroCliente } from '../../utils/validadorCadastroCliente'

export const CadastroCliente = () => {
  const navigate = useNavigate()

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    mode: 'onChange',
  })

  const onSubmit = async (clienteData: any) => {
    try {
      const validacao = validadorCadastroCliente(clienteData)

      if (!validacao.isValid) {
        return
      }
      const { error } = await supabase
        .from('usuarios')
        .insert([
          {
            nome: clienteData.nomeCliente || 'N/A',
            telefone: clienteData.telefoneCliente || 'N/A',
            cpf_cnpj: clienteData.documentoCliente || 'N/A',
            tipo: clienteData.tipoCliente,
            tipo_licenca: clienteData.licencaCliente,
            deleted_at: null,
          },
        ])
        .select()

      if (error) {
        Swal.fire({
          timer: 4000,
          icon: 'error',
          showCancelButton: false,
          title: 'Falha no cadastro do cliente!',
          text: 'Entre em contato com o administrador ou tente novamente.',
        })
        throw new Error(error.message)
      }

      Swal.fire({
        timer: 2500,
        icon: 'success',
        showCancelButton: false,
        title: 'Novo cliente cadastrado!',
      })

      return navigate('/cliente')
    } catch (error) {
      Swal.fire({
        timer: 4000,
        icon: 'error',
        showCancelButton: false,
        title: 'Falha no cadastro do cliente!',
        text: 'Entre em contato com o administrador ou tente novamente.',
      })
    }
  }

  const clearForm = () => {
    reset()
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 bg-gradient-to-b from-purple-100 to-purple-300">
      <div className="w-full max-w-md flex flex-col justify-center gap-4 mb-6">
        <div className="flex justify-center gap-17">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => navigate('/cliente')}
          >
            <ArrowBigLeft size={35} className=" text-purple-600" />
          </button>

          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2 font-sans">
            Cadastrar cliente
          </h1>

          <button
            type="button"
            className="cursor-pointer"
            onClick={() => navigate('/cliente')}
          >
            <ArrowBigRight size={35} className=" text-purple-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="max-w-4xl">
            <div className="flex-col sm:flex-col w-full  mb-5">
              <p>Qual o nome do cliente ?</p>
              <input
                type="text"
                placeholder="Ex: José..."
                {...register('nomeCliente', {
                  required: 'O nome do cliente é obrigatório',
                  maxLength: {
                    value: 50,
                    message: 'Máximo de 50 caracteres permitidos',
                  },
                })}
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2
                 ${errors.nomeCliente ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}
            `}
              />
              {errors.nomeCliente && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nomeCliente.message as string}
                </p>
              )}
            </div>

            <div className="flex-col sm:flex-col w-full justify-center mb-5">
              <p>Qual o telefone ?</p>
              <input
                type="number"
                placeholder="Apenas números"
                {...register('telefoneCliente', {
                  required: 'O telefone é obrigatório',
                  min: {
                    value: 8,
                    message: 'O telefone deve ter no mínimo 8 números',
                  },
                  maxLength: {
                    value: 13,
                    message: 'O telefone deve ter no máximo 11 números',
                  },
                })}
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500
                 ${errors.telefoneCliente ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
              />
              {errors.telefoneCliente && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.telefoneCliente?.message as string}
                </p>
              )}
            </div>

            <div className="flex-col sm:flex-col w-full justify-center mb-5">
              <p>Qual o CPF ou CNPJ ?</p>
              <input
                type="number"
                placeholder="04455555555"
                {...register('documentoCliente', {
                  required: 'O documento é obrigatório',
                  min: {
                    value: 8,
                    message: 'O documento deve ter no mínimo 8 números',
                  },
                  maxLength: {
                    value: 16,
                    message: 'O documento deve ter no máximo 16 números',
                  },
                })}
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                 ${errors.documentoCliente ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
              />
              {errors.documentoCliente && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.documentoCliente?.message as string}
                </p>
              )}
            </div>

            <div className="flex-col sm:flex-col w-full justify-center mb-5">
              <p>Qual o tipo do cliente ?</p>
              <select
                {...register('tipoCliente', {
                  required: 'O é obrigatório',
                })}
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                 ${errors.tipoCliente ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
              >
                <option value="">Selecione um tipo</option>
                <option value="comprador">Comprador</option>
                <option value="produtor">Produtor</option>
              </select>
              {errors.tipoCliente && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.tipoCliente?.message as string}
                </p>
              )}
            </div>

            <div className="flex-col sm:flex-col w-full justify-center mb-5">
              <p>Qual a licença do cliente ?</p>
              <select
                {...register('licencaCliente', {
                  required: 'A licença é obrigatória',
                })}
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                 ${errors.licencaCliente ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
              >
                <option value="">Selecione uma licença</option>
                <option value="gratuito">Gratuito</option>
                <option value="recorrente">Recorrente</option>
                <option value="cancelado">Cancelado</option>
              </select>
              {errors.licencaCliente && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.licencaCliente?.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => clearForm()}
              className="flex-1 max-w-[225px] sm:flex-none rounded-lg bg-gray-400 text-white px-6 py-2 font-medium hover:bg-gray-500 transition cursor-pointer"
            >
              Limpar
            </button>

            <button className="flex-1 max-w-[225px] sm:flex-none rounded-lg cursor-pointer bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 font-medium focus:ring-purple-900 transition">
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
