export const useEstados = () => {
  const estadosList = [{ id: 1, nome: 'Ceará' }]

  const getEstadoById = (id: any) => {
    return estadosList?.find((estado) => estado.id === id) || null
  }

  return { estadosList, getEstadoById }
}
