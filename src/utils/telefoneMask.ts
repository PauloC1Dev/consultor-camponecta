export const formatarTelefone = (telefone: any) => {
  if (!telefone) return 'N/A'

  // Remove todos os caracteres não numéricos
  const numeros = telefone.replace(/\D/g, '')

  // Verifica se tem 11 dígitos (celular com DDD)
  if (numeros.length === 11) {
    return `(${numeros.slice(0, 2)})${numeros.slice(2, 7)}-${numeros.slice(7)}`
  }

  // Se não tem o formato esperado, retorna como está
  return telefone
}
