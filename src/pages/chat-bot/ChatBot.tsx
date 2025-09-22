import { Mail } from 'lucide-react'

const ChatBot = () => {
  return (
    <>
      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mensagem
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="Digite seu usuário"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none pl-10"
            />
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <button
          type="button"
          className="w-full font-semibold py-2 rounded-lg shadow-md transition-colors"
        >
          Enviar Mensagem
        </button>
      </form>
    </>
  )
}

export default ChatBot
