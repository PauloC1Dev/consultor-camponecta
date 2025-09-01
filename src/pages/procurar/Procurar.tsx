import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../db/supabaseClient'

export const Procurar = () => {
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

  console.log("oferta")
  console.log(ofertas)

  return <div>Procurar</div>
}
