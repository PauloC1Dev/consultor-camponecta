export default function authHandler(request, response) {
  const ADMIN_EMAIL = process.env.VITE_ADMINISTRADOR
  const ADMIN_PASSWORD = process.env.VITE_CHAVE_DE_ACESSO

  console.log('cheguei aqui')

  if (request.method === 'POST') {
    const { email, password } = request.body

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      response.status(200).json({ success: true })
    } else {
      response
        .status(401)
        .json({ success: false, message: 'Credenciais inválidas.' })
    }
  } else {
    response.status(405).json({ message: 'Requisição não permitida.' })
  }
}
