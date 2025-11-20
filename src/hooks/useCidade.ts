const cidadesCeara = [
  { id: 1, nome: 'Fortaleza' },
  { id: 2, nome: 'Caucaia' },
  { id: 3, nome: 'Juazeiro do Norte' },
  { id: 4, nome: 'Sobral' },
  { id: 5, nome: 'Maracanaú' },
  { id: 6, nome: 'Crato' },
  { id: 7, nome: 'Itapipoca' },
  { id: 8, nome: 'Maranguape' },
  { id: 9, nome: 'Iguatu' },
  { id: 10, nome: 'Quixadá' },
  { id: 11, nome: 'São Benedito' },
]

export const useCidades = () => {
  const getCidadeById = (id: any) => {
    return cidadesCeara?.find((cidade) => cidade.id === id) || null
  }

  return { cidadesCeara, getCidadeById }
}
