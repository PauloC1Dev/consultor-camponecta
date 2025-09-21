import { GoogleGenerativeAI } from '@google/generative-ai'

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Método não permitido.' })
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY // NÃO use VITE_ aqui
    if (!apiKey)
      return response.status(500).json({ message: 'GEMINI_API_KEY ausente.' })

    const { prompt, messages } = request.body || {}
    const genAI = new GoogleGenerativeAI(apiKey)

    // Modelo bom e gratuito pra testes
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const input =
      messages?.map((m) => `${m.role}: ${m.content}`).join('\n') ||
      prompt ||
      'Escreva um haicai sobre café.'

    const result = await model.generateContent(input)
    const text = result.response.text()

    return response.status(200).json({ text })
  } catch (err) {
    console.error('Gemini erro:', err)
    return response.status(500).json({ error: err?.message || 'Erro interno' })
  }
}
