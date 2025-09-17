import Swal from 'sweetalert2'

export const validadorCadastroCliente = (clienteData: any) => {
  // Validação nome
  if (!clienteData.nomeCliente || clienteData.nomeCliente.trim() === '') {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Nome obrigatório!',
      text: 'Informe o nome do cliente.',
    })
    return { isValid: false, error: 'Nome obrigatório' }
  }

  if (clienteData.nomeCliente.length < 2) {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Nome muito curto!',
      text: 'O nome deve ter pelo menos 2 caracteres.',
    })
    return { isValid: false, error: 'Nome muito curto' }
  }

  if (clienteData.nomeCliente.length > 100) {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Nome muito longo!',
      text: 'O nome deve ter no máximo 100 caracteres.',
    })
    return { isValid: false, error: 'Nome muito longo' }
  }

  // Validação telefone
  if (
    !clienteData.telefoneCliente ||
    clienteData.telefoneCliente.trim() === ''
  ) {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Telefone obrigatório!',
      text: 'Informe o telefone do cliente.',
    })
    return { isValid: false, error: 'Telefone obrigatório' }
  }

  const telefoneNumerico = clienteData.telefoneCliente.replace(/\D/g, '')
  if (telefoneNumerico.length < 10 || telefoneNumerico.length > 11) {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Telefone inválido!',
      text: 'O telefone deve ter 10 ou 11 dígitos.',
    })
    return { isValid: false, error: 'Telefone inválido' }
  }

  // Validação CPF/CNPJ
  if (
    !clienteData.documentoCliente ||
    clienteData.documentoCliente.trim() === ''
  ) {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'CPF/CNPJ obrigatório!',
      text: 'Informe o CPF ou CNPJ do cliente.',
    })
    return { isValid: false, error: 'CPF/CNPJ obrigatório' }
  }

  const documento = clienteData.documentoCliente.replace(/\D/g, '')

  if (documento.length === 11) {
    if (!validarCPF(documento)) {
      Swal.fire({
        timer: 3000,
        icon: 'warning',
        title: 'CPF inválido!',
        text: 'Verifique os dígitos do CPF informado.',
      })
      return { isValid: false, error: 'CPF inválido' }
    }
  } else if (documento.length === 14) {
    if (!validarCNPJ(documento)) {
      Swal.fire({
        timer: 3000,
        icon: 'warning',
        title: 'CNPJ inválido!',
        text: 'Verifique os dígitos do CNPJ informado.',
      })
      return { isValid: false, error: 'CNPJ inválido' }
    }
  } else {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Documento inválido!',
      text: 'Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.',
    })
    return { isValid: false, error: 'Documento inválido' }
  }

  // Validação tipo de cliente
  if (!clienteData.tipoCliente || clienteData.tipoCliente.trim() === '') {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Tipo de cliente obrigatório!',
      text: 'Selecione o tipo de cliente.',
    })
    return { isValid: false, error: 'Tipo de cliente obrigatório' }
  }

  const tiposValidos = ['comprador', 'vendedor', 'ambos']
  if (!tiposValidos.includes(clienteData.tipoCliente)) {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Tipo de cliente inválido!',
      text: 'O tipo deve ser: comprador, vendedor ou ambos.',
    })
    return { isValid: false, error: 'Tipo de cliente inválido' }
  }

  // Validação tipo de licença
  if (!clienteData.licencaCliente || clienteData.licencaCliente.trim() === '') {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Tipo de licença obrigatório!',
      text: 'Selecione o tipo de licença.',
    })
    return { isValid: false, error: 'Tipo de licença obrigatório' }
  }

  const licencasValidas = ['gratuito', 'recorrente', 'cancelado']
  if (!licencasValidas.includes(clienteData.licencaCliente)) {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Tipo de licença inválido!',
      text: 'A licença deve ser: gratuito, recorrente ou cancelado.',
    })
    return { isValid: false, error: 'Tipo de licença inválido' }
  }

  return {
    isValid: true,
    dadosLimpos: {
      nome: clienteData.nomeCliente.trim(),
      telefone: telefoneNumerico,
      cpf_cnpj: documento,
      tipo: clienteData.tipoCliente,
      tipo_licenca: clienteData.licencaCliente,
      deleted_at: null,
    },
  }
}

// Função auxiliar para validar CPF
const validarCPF = (cpf: string): boolean => {
  const numeros = cpf.replace(/\D/g, '')

  if (numeros.length !== 11) return false
  if (/^(\d)\1{10}$/.test(numeros)) return false

  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += parseInt(numeros[i]) * (10 - i)
  }
  let resto = soma % 11
  let digitoVerificador1 = resto < 2 ? 0 : 11 - resto

  if (parseInt(numeros[9]) !== digitoVerificador1) return false

  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += parseInt(numeros[i]) * (11 - i)
  }
  resto = soma % 11
  let digitoVerificador2 = resto < 2 ? 0 : 11 - resto

  return parseInt(numeros[10]) === digitoVerificador2
}

// Função auxiliar para validar CNPJ
const validarCNPJ = (cnpj: string): boolean => {
  const numeros = cnpj.replace(/\D/g, '')

  if (numeros.length !== 14) return false
  if (/^(\d)\1{13}$/.test(numeros)) return false

  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let soma = 0
  for (let i = 0; i < 12; i++) {
    soma += parseInt(numeros[i]) * pesos1[i]
  }
  let resto = soma % 11
  let digitoVerificador1 = resto < 2 ? 0 : 11 - resto

  if (parseInt(numeros[12]) !== digitoVerificador1) return false

  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  soma = 0
  for (let i = 0; i < 13; i++) {
    soma += parseInt(numeros[i]) * pesos2[i]
  }
  resto = soma % 11
  let digitoVerificador2 = resto < 2 ? 0 : 11 - resto

  return parseInt(numeros[13]) === digitoVerificador2
}
