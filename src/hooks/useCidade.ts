import Swal from 'sweetalert2'
import { supabase } from '../db/supabaseClient'
import { useQuery } from '@tanstack/react-query'

export const useCidades = (estadoId?: string | number) => {
  const aaa = 'aaaaa'

  const { data: cidadeList } = useQuery<any[]>({
    queryKey: ['cidades', estadoId],
    queryFn: async () => {
      let query = supabase.from('cidades').select(`
        id,
        estado_id,
        nome
      `)

      if (estadoId) {
        query = query.eq('estado_id', estadoId)
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
    enabled: !!estadoId,
  })

  const getCidadeById = (id: any) => {
    return cidadeList?.find((cidade) => cidade.id === id) || null
  }

  return { aaa, cidadeList, getCidadeById }
}
