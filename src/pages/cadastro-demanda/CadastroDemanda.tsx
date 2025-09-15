import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../db/supabaseClient'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react'
import { Autocomplete, TextField } from '@mui/material'

export const CadastrarDemanda = () => {
  const navigate = useNavigate()
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    mode: 'onChange',
  })

  const estadoSelecionado = watch('estadoDemanda')

  const onSubmit = (data: any) => {
    console.log('data')
    console.log(data)
  }

  const cidadesPorEstado: Record<string, string[]> = {
    'sao-paulo': ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto'],
    'rio de janeiro': ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Cabo Frio'],
    'minas-gerais': [
      'Belo Horizonte',
      'Uberlândia',
      'Ouro Preto',
      'Juiz de Fora',
    ],
    bahia: ['Salvador', 'Feira de Santana', 'Ilhéus', 'Vitória da Conquista'],
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 bg-gradient-to-b from-blue-100 to-blue-200">
      <div className="w-full max-w-4xl flex flex-col gap-4 mb-6">
        <div className="flex justify-center gap-15">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => navigate('/oferta')}
          >
            <ArrowBigLeft size={35} color="blue" />
          </button>

          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2 font-sans">
            Cadastrar demandas
          </h1>

          <button type="button" disabled={true}>
            <ArrowBigRight size={35} color="grey" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="flex sm:flex-col w-full justify-center mb-5">
              <input
                type="text"
                placeholder="Nome do produto"
                {...register('nomeDemanda', {
                  required: 'O nome é obrigatório',
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

            <div className="flex sm:flex-col w-full justify-center mb-5">
              <input
                type="text"
                placeholder="Quantidade do produto"
                {...register('quantidadeDemanda', {
                  required: 'A quantidade é obrigatória',
                  maxLength: {
                    value: 50,
                    message: 'Máximo de 50 caracteres permitidos',
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

            <div className="flex sm:flex-col w-full justify-center mb-5">
              <input
                type="text"
                placeholder="Valor do produto"
                {...register('valorDemanda', {
                  required: 'O valor é obrigatório',
                  maxLength: {
                    value: 50,
                    message: 'Máximo de 50 caracteres permitidos',
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

            <div className="flex sm:flex-col w-full justify-center mb-5">
              <select
                {...register('tipoDemanda', {
                  required: 'O tipo é obrigatório',
                })}
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                 ${errors.tipoDemanda ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-700'}`}
              >
                <option value="">Selecione o tipo do produto</option>
                <option value="sao-paulo">São Paulo</option>
                <option value="rio de janeiro">Rio de Janeiro</option>
                <option value="minas-gerais">Minas Gerais</option>
                <option value="bahia">Bahia</option>
              </select>
              {errors.tipoDemanda && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.tipoDemanda?.message as string}
                </p>
              )}
            </div>

            <div className="flex sm:flex-col w-full justify-center mb-5">
              <select
                {...register('estadoDemanda', {
                  required: 'O estado é obrigatório',
                })}
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                 ${errors.estadoDemanda ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-700'}`}
              >
                <option value="">Selecione um estado</option>
                <option value="sao-paulo">São Paulo</option>
                <option value="rio de janeiro">Rio de Janeiro</option>
                <option value="minas-gerais">Minas Gerais</option>
                <option value="bahia">Bahia</option>
              </select>
              {errors.estadoDemanda && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.estadoDemanda?.message as string}
                </p>
              )}
            </div>

            <div className="flex sm:flex-col w-full justify-center mb-5">
              <select
                {...register('cidadeDemanda', {
                  required: 'A cidade é obrigatória',
                })}
                className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                 ${errors.cidadeDemanda ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-700'}`}
              >
                <option value="">Selecione uma cidade</option>
                {cidadesPorEstado[estadoSelecionado]?.map((cidade) => (
                  <option key={cidade} value={cidade}>
                    {cidade}
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

          <div className="flex sm:flex-col w-full justify-center mb-5">
            <select
              {...register('usuarioDemanda', {
                required: 'O usuário é obrigatório',
              })}
              className={`w-full max-w-[455px] bg-amber-50 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                 ${errors.cidadeDemanda ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-700'}`}
            >
              <option value="">Selecione um cliente</option>
              <option value="sao-paulo">São Paulo</option>
              <option value="rio de janeiro">Rio de Janeiro</option>
              <option value="minas-gerais">Minas Gerais</option>
              <option value="bahia">Bahia</option>
            </select>

            {errors.usuarioDemanda && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.usuarioDemanda?.message as string}
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-center">
            <button className="flex-1 max-w-[225px] sm:flex-none rounded-lg bg-blue-700 text-white px-6 py-2 font-medium hover:bg-blue-800 transition">
              Cadastrar
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="flex-1 max-w-[225px] sm:flex-none rounded-lg bg-gray-400 text-white px-6 py-2 font-medium hover:bg-gray-500 transition"
            >
              Limpar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
