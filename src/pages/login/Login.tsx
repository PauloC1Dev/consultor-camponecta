import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import Swal from 'sweetalert2'

export const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        const expirationTime = Date.now() + 30 * 60 * 1000
        localStorage.setItem(
          'authCampoData',
          JSON.stringify({
            isCampoAuthenticated: true,
            expiration: expirationTime,
          })
        )
        navigate('/oferta')
      } else {
        Swal.fire({
          timer: 4000,
          icon: 'error',
          showCancelButton: false,
          title: 'Falha de acesso!',
          text: `${data.message}`,
        })
      }
    } catch (error) {
      Swal.fire({
        timer: 4000,
        icon: 'error',
        showCancelButton: false,
        title: 'Falha de acesso!',
        text: `Dados inválidos, tente novamente.`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-100 to-green-200 p-4">
      <div className="w-full max-w-sm bg-white/50 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo_campo.png"
            alt="Camponecta"
            className="h-[20%] w-[25%] mb-2"
          />
        </div>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuário
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Digite seu usuário"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none pl-10"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <input
                placeholder="Digite sua senha"
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none pl-10 pr-10"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full font-semibold py-2 rounded-lg shadow-md transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
