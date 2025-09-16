import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react'
import { useEstados } from '../../hooks/useEstado'
import { useCidades } from '../../hooks/useCidade'
import { useUsers } from '../../hooks/useUsers'
import { supabase } from '../../db/supabaseClient'
import Swal from 'sweetalert2'
import { validadorCadastroDemanda } from '../../utils/validadorCadastroDemanda'

export const CadastrarDemanda = () => {
  const navigate = useNavigate()

  const {
    reset,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    mode: 'onChange',
  })

  const estadoSelecionado = watch('estadoDemanda')

  const { estadosList, getEstadoById } = useEstados()
  const { usuarioList, getUsuarioeById } = useUsers('comprador')
  const { cidadeList, getCidadeById } = useCidades(estadoSelecionado)

  const onSubmit = async (demandaData: any) => {
    try {
      const validacao = validadorCadastroDemanda(
        demandaData,
        getUsuarioeById,
        getEstadoById,
        getCidadeById
      )

      if (!validacao.isValid) {
        console.log(
          '❌ Validação da criação de demanda falhou:',
          validacao.error
        )
        return
      }

      const { error } = await supabase
        .from('demandas')
        .insert([
          {
            usuario_id: parseInt(demandaData.usuarioDemanda),
            nome: demandaData.nomeDemanda,
            tipo: demandaData.tipoDemanda,
            quantidade: parseInt(demandaData.quantidadeDemanda),
            valor: parseFloat(demandaData.valorDemanda),
            data_validade_inicio: new Date().toISOString().split('T')[0],
            data_validade_fim: demandaData.dataFim,
            estado_id: parseInt(demandaData.estadoDemanda),
            cidade_id: parseInt(demandaData.cidadeDemanda),
            unidade_medida: 'kg',
            logistica_propria:
              demandaData.logisticaDemanda === 'Sim' ? true : false,
            estado: getEstadoById(parseInt(demandaData.estadoDemanda))?.nome,
            cidade: getCidadeById(parseInt(demandaData.cidadeDemanda))?.nome,
            usuario_nome: getUsuarioeById(parseInt(demandaData.usuarioDemanda))
              ?.nome,
            usuario_telefone: getUsuarioeById(
              parseInt(demandaData.usuarioDemanda)
            )?.telefone,
            deleted_at: null,
          },
        ])
        .select()

      if (error) {
        Swal.fire({
          timer: 4000,
          icon: 'error',
          showCancelButton: false,
          title: 'Falha no cadastro da demanda!',
          text: 'Entre em contato com o administrador ou tente novamente.',
        })
        throw new Error(error.message)
      }

      Swal.fire({
        timer: 2500,
        icon: 'success',
        showCancelButton: false,
        title: 'Nova demanda cadastrada!',
      })

      return navigate('/demanda')
    } catch (error) {
      Swal.fire({
        timer: 4000,
        icon: 'error',
        showCancelButton: false,
        title: 'Falha no cadastro da demanda!',
        text: 'Entre em contato com o administrador ou tente novamente.',
      })
    }
  }

  const getDateString = (daysToAdd = 0) => {
    const date = new Date()
    date.setDate(date.getDate() + daysToAdd)
    return date.toISOString().split('T')[0]
  }
  const minDate = getDateString(1)

  const clearForm = () => {
    reset()
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 bg-gradient-to-b from-blue-100 to-blue-300">
      <div className="w-full max-w-md flex flex-col justify-center gap-3 mb-6">
        <div className="flex justify-center gap-12">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => navigate('/demanda')}
          >
            <ArrowBigLeft size={35} color="blue" />
          </button>

          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2 font-sans">
            Cadastrar demanda
          </h1>

          <button type="button" onClick={() => navigate('/demanda')}>
            <ArrowBigRight size={35} color="blue" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="max-w-4xl">
            <div className="flex-col sm:flex-col w-full  mb-5">
              <p>Qual o nome do produto ?</p>
              <input
                type="text"
                placeholder="Ex: Abacaxi..."
                {...register('nomeDemanda', {
                  required: 'O nome do produto é obrigatório',
                  maxLength: {
                    value: 50,
                    message: 'Máximo de 50 caracteres permitidos',
                  },
                })}
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2
                 ${errors.nomeDemanda ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-700'}
            `}
              />
              {errors.nomeDemanda && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nomeDemanda.message as string}
                </p>
              )}
            </div>

            <div className="flex-col sm:flex-col w-full justify-center mb-5">
              <p>Quantos quilos está precisando ?</p>
              <input
                type="number"
                placeholder="Apenas números"
                {...register('quantidadeDemanda', {
                  required: 'A quantidade é obrigatória',
                  min: {
                    value: 0.01,
                    message: 'O valor deve ser maior que zero',
                  },
                  max: {
                    value: 99,
                    message: 'valor máximo de 99 kg',
                  },
                })}
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700
                 ${errors.quantidadeDemanda ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-700'}`}
              />
              {errors.quantidadeDemanda && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.quantidadeDemanda?.message as string}
                </p>
              )}
            </div>

            <div className="flex-col sm:flex-col w-full justify-center mb-5">
              <p>Quanto está disposto a pagar ?</p>
              <input
                type="number"
                placeholder="Valor R$ por quilo, apenas número"
                {...register('valorDemanda', {
                  required: 'O valor é obrigatório',
                  min: {
                    value: 0.01,
                    message: 'O valor deve ser maior que zero',
                  },
                  max: {
                    value: 99,
                    message: 'valor máximo de 99 reais por quilo',
                  },
                })}
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                 ${errors.valorDemanda ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-700'}`}
              />
              {errors.valorDemanda && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.valorDemanda?.message as string}
                </p>
              )}
            </div>

            <div className="flex-col sm:flex-col w-full justify-center mb-5">
              <p>Qual a categoria do produto ?</p>
              <input
                type="text"
                placeholder="Fruta.. Legume.. Verdura.."
                {...register('tipoDemanda', {
                  required: 'O valor é obrigatório',
                  maxLength: {
                    value: 50,
                    message: 'Máximo de 50 caracteres permitidos',
                  },
                })}
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                 ${errors.tipoDemanda ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-700'}`}
              />
              {errors.tipoDemanda && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.tipoDemanda?.message as string}
                </p>
              )}
            </div>

            <div className="flex-col sm:flex-col w-full justify-center mb-5">
              <p>Até quando precisa do produto ?</p>
              <input
                type="date"
                {...register('dataFim', {
                  required: 'A data de validade final é obrigatória',
                  validate: {
                    minDate: (value) => {
                      const selected = new Date(value)
                      const tomorrow = new Date()
                      tomorrow.setDate(tomorrow.getDate() + 1)
                      return (
                        selected >= tomorrow ||
                        'Data mínima para 2 dias a partir de hoje'
                      )
                    },
                  },
                })}
                min={minDate}
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                 ${errors.dataFim ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-700'}`}
              />
              {errors.dataFim && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.dataFim?.message as string}
                </p>
              )}
            </div>

            <div className="flex-col sm:flex-col w-full justify-center mb-5">
              <p>Qual o estado da entrega ?</p>
              <select
                {...register('estadoDemanda', {
                  required: 'O estado é obrigatório',
                })}
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                 ${errors.estadoDemanda ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-700'}`}
              >
                <option value="">Selecione um estado</option>
                {(estadosList || []).map((estado) => (
                  <option key={estado.id} value={estado.id}>
                    {estado.nome}
                  </option>
                ))}
              </select>
              {errors.estadoDemanda && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.estadoDemanda?.message as string}
                </p>
              )}
            </div>

            <div className="flex-col sm:flex-col w-full justify-center mb-5">
              <p>Qual a cidade da entrega ?</p>
              <select
                {...register('cidadeDemanda', {
                  required: 'A cidade é obrigatória',
                })}
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                 ${errors.cidadeDemanda ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-700'}`}
              >
                <option value="">Selecione uma cidade</option>
                {(cidadeList || []).map((cidade) => (
                  <option key={cidade.id} value={cidade.id}>
                    {cidade.nome}
                  </option>
                ))}
              </select>
              {errors.cidadeDemanda && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.cidadeDemanda?.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="flex-col sm:flex-col w-full justify-center mb-5">
            <p>Qual cliente solicitou a demana ?</p>
            <select
              {...register('usuarioDemanda', {
                required: 'O usuário é obrigatório',
              })}
              className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                 ${errors.cidadeDemanda ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-700'}`}
            >
              <option value="">Selecione um cliente</option>
              {(usuarioList || []).map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nome}
                </option>
              ))}
            </select>
            {errors.usuarioDemanda && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.usuarioDemanda?.message as string}
              </p>
            )}
          </div>

          <div className="flex-col sm:flex-col w-full justify-center mb-5">
            <p>Cliente fornecerá a logística ?</p>
            <select
              {...register('logisticaDemanda', {
                required: 'Sim ou não ?',
              })}
              className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                 ${errors.cidadeDemanda ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-700'}`}
            >
              <option value="">Logística</option>

              <option value={'Sim'}>Sim</option>

              <option value={'Não'}>Não</option>
            </select>
            {errors.logisticaDemanda && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.logisticaDemanda?.message as string}
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => clearForm()}
              className="flex-1 max-w-[225px] sm:flex-none rounded-lg bg-gray-400 text-white px-6 py-2 font-medium hover:bg-gray-500 transition cursor-pointer"
            >
              Limpar
            </button>

            <button className="flex-1 max-w-[225px] sm:flex-none rounded-lg bg-blue-700 text-white px-6 py-2 font-medium hover:bg-blue-800 transition cursor-pointer">
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
