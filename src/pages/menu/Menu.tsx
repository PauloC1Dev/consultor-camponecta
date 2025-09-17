import { Apple, Power, Sprout, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const Menu = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex-col w-full flex items-center justify-center bg-gradient-to-b from-yellow-50 to-yellow-100 p-4">
      <div className="flex w-full items-end justify-end">
        <button className="cursor-pointer" onClick={() => navigate('/')}>
          <Power color="red" size={40} />
        </button>
      </div>
      <div className="mb-10">
        <h1 className="text-5xl font-bold">Menu</h1>
      </div>
      <div className="flex w-full flex-col gap-5">
        <div className="flex flex-wrap gap-5 justify-center">
          <div
            onClick={() => navigate('/oferta')}
            className="flex flex-col justify-center items-center  w-full max-w-sm  bg-gradient-to-b from-green-100 to-green-200 rounded-2xl shadow-lg p-8 cursor-pointer"
          >
            <Apple color="red" size={40} />
            <span className="text-2xl font-semibold">Ofertas</span>
          </div>

          <div
            onClick={() => navigate('/demanda')}
            className="flex flex-col justify-center items-center  w-full max-w-sm bg-gradient-to-b from-blue-100 to-blue-400 rounded-2xl shadow-lg p-8 cursor-pointer"
          >
            <Sprout color="green" size={40} />
            <span className="text-2xl font-semibold">Demandas</span>
          </div>

          <div
            onClick={() => navigate('/cliente')}
            className="flex flex-col justify-center items-center  w-full max-w-sm bg-gradient-to-b from-purple-100 to-purple-300 rounded-2xl shadow-lg p-8 cursor-pointer"
          >
            <User color="blue" size={40} />
            <span className="text-2xl font-semibold">Clientes</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-5 justify-center">
          <div
            onClick={() => navigate('/cadastrar-oferta')}
            className="flex flex-col justify-center items-center  w-full max-w-sm bg-gradient-to-b from-green-100 to-green-200 rounded-2xl shadow-lg p-8 cursor-pointer"
          >
            <Apple color="red" size={40} />
            <span className="text-2xl font-semibold">Cadastrar ofertas</span>
          </div>

          <div
            onClick={() => navigate('/cadastrar-demanda')}
            className="flex flex-col justify-center items-center  w-full max-w-sm bg-gradient-to-b from-blue-100 to-blue-400 rounded-2xl shadow-lg p-8 cursor-pointer"
          >
            <Sprout color="green" size={40} />
            <span className="text-2xl font-semibold">Cadastrar demandas</span>
          </div>

          <div
            onClick={() => navigate('/cadastrar-cliente')}
            className="flex flex-col justify-center items-center  w-full max-w-sm bg-gradient-to-b from-purple-100 to-purple-300 rounded-2xl shadow-lg p-8 cursor-pointer"
          >
            <User color="blue" size={40} />
            <span className="text-2xl font-semibold">Cadastrar clientes</span>
          </div>
        </div>
      </div>
    </div>
  )
}
