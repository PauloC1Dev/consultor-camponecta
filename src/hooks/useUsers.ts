import Swal from 'sweetalert2'
import { supabase } from '../db/supabaseClient'
import { useQuery } from '@tanstack/react-query'

export const useUsers = () => {
  const aaa = 'aaaaa'

  const { data: usuarioList } = useQuery<any[]>({
    queryKey: ['usuarios'],
    queryFn: async () => {
      let query = supabase.from('usuarios').select(`
        id,
        tipo,
        nome,
        telefone
      `)

      query = query.eq('tipo', 'comprador')

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

  const getUsuarioeById = (id: any) => {
    return usuarioList?.find((usuario) => usuario.id === id) || null
  }

  return { aaa, usuarioList, getUsuarioeById }
}
