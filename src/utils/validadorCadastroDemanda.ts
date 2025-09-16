import Swal from 'sweetalert2'

export const validadorCadastroDemanda = (
  demandaData: any,
  getCidadeById: any,
  getEstadoById: any,
  getUsuarioeById: any
) => {
  if (!demandaData.usuarioDemanda || demandaData.usuarioDemanda.trim() === '') {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Usuário obrigatório!',
      text: 'Selecione um usuário para continuar.',
    })
    return { isValid: false, error: 'Usuário obrigatório' }
  }

  if (!demandaData.nomeDemanda || demandaData.nomeDemanda.trim() === '') {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Nome da demanda obrigatório!',
      text: 'Informe o nome do produto.',
    })
    return { isValid: false, error: 'Nome da demanda obrigatório' }
  }

  if (!demandaData.estadoDemanda || demandaData.estadoDemanda === '') {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Estado obrigatório!',
      text: 'Selecione um estado.',
    })
    return { isValid: false, error: 'Estado obrigatório' }
  }

  if (!demandaData.cidadeDemanda || demandaData.cidadeDemanda === '') {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Cidade obrigatória!',
      text: 'Selecione uma cidade.',
    })
    return { isValid: false, error: 'Cidade obrigatória' }
  }

  if (!demandaData.dataFim || demandaData.dataFim === '') {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Data de validade obrigatória!',
      text: 'Selecione a data de validade final.',
    })
    return { isValid: false, error: 'Data de validade obrigatória' }
  }

  const quantidade = parseInt(demandaData.quantidadeDemanda)
  if (isNaN(quantidade) || quantidade <= 0) {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Quantidade inválida!',
      text: 'A quantidade deve ser um número maior que zero.',
    })
    return { isValid: false, error: 'Quantidade inválida' }
  }

  const valor = parseFloat(demandaData.valorDemanda)
  if (isNaN(valor) || valor <= 0) {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Valor inválido!',
      text: 'O valor deve ser um número maior que zero.',
    })
    return { isValid: false, error: 'Valor inválido' }
  }

  const usuarioId = parseInt(demandaData.usuarioDemanda)
  const estadoId = parseInt(demandaData.estadoDemanda)
  const cidadeId = parseInt(demandaData.cidadeDemanda)

  if (isNaN(usuarioId) || usuarioId <= 0) {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Usuário inválido!',
      text: 'Selecione um usuário válido.',
    })
    return { isValid: false, error: 'Usuário inválido' }
  }

  if (isNaN(estadoId) || estadoId <= 0) {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Estado inválido!',
      text: 'Selecione um estado válido.',
    })
    return { isValid: false, error: 'Estado inválido' }
  }

  if (isNaN(cidadeId) || cidadeId <= 0) {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Cidade inválida!',
      text: 'Selecione uma cidade válida.',
    })
    return { isValid: false, error: 'Cidade inválida' }
  }

  if (!usuarioId) {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Usuário não encontrado!',
      text: 'O usuário selecionado não existe.',
    })
    return { isValid: false, error: 'Usuário não encontrado' }
  }

  const estadoEncontrado = getEstadoById(estadoId)
  if (!estadoEncontrado) {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Estado não encontrado!',
      text: 'O estado selecionado não existe.',
    })
    return { isValid: false, error: 'Estado não encontrado' }
  }

  const cidadeEncontrada = getCidadeById(cidadeId)
  if (!cidadeEncontrada) {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Cidade não encontrada!',
      text: 'A cidade selecionada não existe.',
    })
    return { isValid: false, error: 'Cidade não encontrada' }
  }

  const dataFim = new Date(demandaData.dataFim)
  const amanha = new Date()
  amanha.setDate(amanha.getDate() + 1)

  if (dataFim < amanha) {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Data de validade inválida!',
      text: 'A data de validade deve ser a partir de amanhã.',
    })
    return { isValid: false, error: 'Data de validade inválida' }
  }

  if (demandaData.nomeDemanda.length > 255) {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Nome muito longo!',
      text: 'O nome da demanda deve ter no máximo 255 caracteres.',
    })
    return { isValid: false, error: 'Nome muito longo' }
  }

  if (demandaData.tipoDemanda && demandaData.tipoDemanda.length > 100) {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Tipo muito longo!',
      text: 'O tipo da demanda deve ter no máximo 100 caracteres.',
    })
    return { isValid: false, error: 'Tipo muito longo' }
  }

  if (quantidade > 999999 || quantidade <= 0) {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Quantidade muito alta ou negativa!',
      text: 'A quantidade deve ser menor que 1.000.000.',
    })
    return { isValid: false, error: 'Quantidade muito alta ou baixa' }
  }

  if (valor > 999999.99 || valor <= 0) {
    Swal.fire({
      timer: 3000,
      icon: 'warning',
      title: 'Valor muito alto ou negativo!',
      text: 'O valor deve ser menor que R$ 999.999,99.',
    })
    return { isValid: false, error: 'Valor muito alto ou baixo' }
  }

  return {
    isValid: true,
  }
}
