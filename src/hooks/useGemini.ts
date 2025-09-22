import Swal from 'sweetalert2'
import { useQuery } from '@tanstack/react-query'

export const useGemini = () => {
  const aaa = 'aaaaa'

  const { data: respostaIA } = useQuery({
    queryKey: ['gemini', prompt],
    queryFn: async () => {
      const resp = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt:
            'Qual fruta do texto abaixo a pessoa ta querendo comprar ? me retorne apena o nome da fruta e quando a pessoa quer pagar nesse formato {fruta: , valor, quantidade}:  a menina caiu de bicicleta que ralou o joelho, a mãe gosta de novo carro, quero banana, o dolar ta caro. pago até 3 reais',
        }),
      })

      if (!resp.ok) {
        const err = await resp.json()
        Swal.fire({
          timer: 4000,
          icon: 'error',
          showCancelButton: false,
          title: 'Erro na API Gemini!',
          text:
            err.error ||
            'Entre em contato com o administrador ou tente novamente.',
        })
        throw new Error(err.error || 'Erro na API Gemini')
      }

      const { text } = await resp.json()
      return text
    },
    enabled: !!prompt, // só dispara se houver prompt
  })

  return { aaa, respostaIA }
}
