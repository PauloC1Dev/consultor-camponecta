import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react'
import { useEstados } from '../../hooks/useEstado'
import { useCidades } from '../../hooks/useCidade'
import { useUsers } from '../../hooks/useUsers'
import { supabase } from '../../db/supabaseClient'
import Swal from 'sweetalert2'
import { validadorCadastroOferta } from '../../utils/validadorCadastroOferta'

export const CadastrarOferta = () => {
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

  const estadoSelecionado = watch('estadoOferta')

  const { estadosList, getEstadoById } = useEstados()
  const { usuarioList, getUsuarioeById } = useUsers('produtor')
  const { cidadeList, getCidadeById } = useCidades(estadoSelecionado)

  const onSubmit = async (ofertaData: any) => {
    try {
      const validacao = validadorCadastroOferta(
        ofertaData,
        getUsuarioeById,
        getEstadoById,
        getCidadeById
      )

      if (!validacao.isValid) {
        console.log(
          '❌ Validação da criação de oferta falhou:',
          validacao.error
        )
        return
      }

      const { error } = await supabase
        .from('ofertas')
        .insert([
          {
            usuario_id: parseInt(ofertaData.usuarioOferta),
            nome: ofertaData.nomeOferta,
            tipo: ofertaData.tipoOferta,
            quantidade: parseInt(ofertaData.quantidadeOferta),
            valor: parseFloat(ofertaData.valorOferta),
            data_validade_inicio: new Date().toISOString().split('T')[0],
            data_validade_fim: ofertaData.dataFim,
            estado_id: parseInt(ofertaData.estadoOferta),
            cidade_id: parseInt(ofertaData.cidadeOferta),
            unidade_medida: 'kg',
            logistica_propria:
              ofertaData.logisticaOferta === 'Sim' ? true : false,
            estado: getEstadoById(parseInt(ofertaData.estadoOferta))?.nome,
            cidade: getCidadeById(parseInt(ofertaData.cidadeOferta))?.nome,
            usuario_nome: getUsuarioeById(parseInt(ofertaData.usuarioOferta))
              ?.nome,
            usuario_telefone: getUsuarioeById(
              parseInt(ofertaData.usuarioOferta)
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
          title: 'Falha no cadastro da oferta!',
          text: 'Entre em contato com o administrador ou tente novamente.',
        })
        throw new Error(error.message)
      }

      Swal.fire({
        timer: 2500,
        icon: 'success',
        showCancelButton: false,
        title: 'Nova oferta cadastrada!',
      })

      return navigate('/oferta')
    } catch (error) {
      Swal.fire({
        timer: 4000,
        icon: 'error',
        showCancelButton: false,
        title: 'Falha no cadastro da oferta!',
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
    <div className="min-h-screen flex flex-col items-center px-4 py-8 bg-gradient-to-b from-green-100 to-green-200">
      <div className="w-full max-w-md flex flex-col justify-center gap-4 mb-6">
        <div className="flex justify-center gap-18">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => navigate('/menu')}
          >
            <ArrowBigLeft size={35} className=" text-emerald-600" />
          </button>

          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2 font-sans">
            Cadastrar oferta
          </h1>

          <button
            type="button"
            className="cursor-pointer"
            onClick={() => navigate('/oferta')}
          >
            <ArrowBigRight size={35} className=" text-emerald-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="max-w-4xl">
            <div className="flex-col sm:flex-col w-full  mb-5">
              <p>Qual o nome do produto ?</p>
              <input
                type="text"
                placeholder="Ex: Abacaxi..."
                {...register('nomeOferta', {
                  required: 'O nome do produto é obrigatório',
                  maxLength: {
                    value: 50,
                    message: 'Máximo de 50 caracteres permitidos',
                  },
                })}
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2
                 ${errors.nomeOferta ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'}
            `}
              />
              {errors.nomeOferta && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nomeOferta.message as string}
                </p>
              )}
            </div>

            <div className="flex-col sm:flex-col w-full justify-center mb-5">
              <p>Quantos quilos está precisando ?</p>
              <input
                type="number"
                placeholder="Apenas números"
                {...register('quantidadeOferta', {
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
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500
                 ${errors.quantidadeOferta ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'}`}
              />
              {errors.quantidadeOferta && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.quantidadeOferta?.message as string}
                </p>
              )}
            </div>

            <div className="flex-col sm:flex-col w-full justify-center mb-5">
              <p>Quanto está disposto a pagar ?</p>
              <input
                type="number"
                placeholder="Valor R$ por quilo, apenas número"
                {...register('valorOferta', {
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
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                 ${errors.valorOferta ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'}`}
              />
              {errors.valorOferta && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.valorOferta?.message as string}
                </p>
              )}
            </div>

            <div className="flex-col sm:flex-col w-full justify-center mb-5">
              <p>Qual a categoria do produto ?</p>
              <input
                type="text"
                placeholder="Fruta.. Legume.. Verdura.."
                {...register('tipoOferta', {
                  required: 'O valor é obrigatório',
                  maxLength: {
                    value: 50,
                    message: 'Máximo de 50 caracteres permitidos',
                  },
                })}
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                 ${errors.tipoOferta ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'}`}
              />
              {errors.tipoOferta && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.tipoOferta?.message as string}
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
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                 ${errors.dataFim ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'}`}
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
                {...register('estadoOferta', {
                  required: 'O estado é obrigatório',
                })}
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                 ${errors.estadoOferta ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'}`}
              >
                <option value="">Selecione um estado</option>
                {(estadosList || []).map((estado) => (
                  <option key={estado.id} value={estado.id}>
                    {estado.nome}
                  </option>
                ))}
              </select>
              {errors.estadoOferta && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.estadoOferta?.message as string}
                </p>
              )}
            </div>

            <div className="flex-col sm:flex-col w-full justify-center mb-5">
              <p>Qual a cidade da entrega ?</p>
              <select
                {...register('cidadeOferta', {
                  required: 'A cidade é obrigatória',
                })}
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                 ${errors.cidadeOferta ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'}`}
              >
                <option value="">Selecione uma cidade</option>
                {(cidadeList || []).map((cidade) => (
                  <option key={cidade.id} value={cidade.id}>
                    {cidade.nome}
                  </option>
                ))}
              </select>
              {errors.cidadeOferta && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.cidadeOferta?.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="flex-col sm:flex-col w-full justify-center mb-5">
            <p>Qual cliente solicitou a demana ?</p>
            <select
              {...register('usuarioOferta', {
                required: 'O usuário é obrigatório',
              })}
              className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                 ${errors.cidadeOferta ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'}`}
            >
              <option value="">Selecione um cliente</option>
              {(usuarioList || []).map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nome}
                </option>
              ))}
            </select>
            {errors.usuarioOferta && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.usuarioOferta?.message as string}
              </p>
            )}
          </div>

          <div className="flex-col sm:flex-col w-full justify-center mb-5">
            <p>Cliente fornecerá a logística ?</p>
            <select
              {...register('logisticaOferta', {
                required: 'Sim ou não ?',
              })}
              className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                 ${errors.cidadeOferta ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'}`}
            >
              <option value="">Logística</option>

              <option value={'Sim'}>Sim</option>

              <option value={'Não'}>Não</option>
            </select>
            {errors.logisticaOferta && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.logisticaOferta?.message as string}
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

            <button className="flex-1 max-w-[225px] sm:flex-none rounded-lg cursor-pointer bg-green-700 hover:bg-green-800 text-white px-6 py-2 font-medium focus:ring-green-900 transition">
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
