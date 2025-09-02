import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../db/supabaseClient'
import { Autocomplete, Box, Input, TextField } from '@mui/material'
import GenericSelect from '../../components/SelectInput'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export const Procurar = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedOfer, setSelectedOfer] = useState(null)

  const { data: ofertas, error } = useQuery({
    queryKey: ['ofertas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ofertas')
        .select('id, nome, tipo, quantidade, valor')

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  useEffect(() => {
    if (selectedOfer) {
      const params = new URLSearchParams(searchParams)
      params.set('ofertaNome', selectedOfer)
      navigate(`?${params.toString()}`, { replace: true })
    }
  }, [selectedOfer, navigate, searchParams])

  return (
    <>
      <Autocomplete
        value={selectedOfer?.nome || null}
        onChange={(event, newValue) => {
          setSelectedOfer(newValue.nome)
        }}
        options={ofertas}
        getOptionLabel={(option) => option.nome}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
        renderInput={(params) => <TextField {...params} label="Teste Nativo" />}
      />
      <div>Procurar</div>
    </>
  )
}
