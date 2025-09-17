import { Oferta } from '../pages/oferta/Oferta.tsx'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { PrivateRoute } from './privateRoute.tsx'
import { Login } from '../pages/login/Login.tsx'
import { Demanda } from '../pages/demanda/Demanda.tsx'
import { CadastrarDemanda } from '../pages/cadastro-demanda/CadastroDemanda.tsx'
import { CadastrarOferta } from '../pages/cadastro-oferta/CadastrarOferta.tsx'
import { Cliente } from '../pages/clientes/Cliente.tsx'
import { CadastroCliente } from '../pages/cadastro-cliente/CadastroCliente.tsx'
import { Menu } from '../pages/menu/Menu.tsx'

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Login />,
  },
]

const privateRoutes: RouteObject[] = [
  {
    path: '/menu',
    element: (
      <PrivateRoute>
        <Menu />
      </PrivateRoute>
    ),
  },

  {
    path: '/oferta',
    element: (
      <PrivateRoute>
        <Oferta />
      </PrivateRoute>
    ),
  },

  {
    path: '/demanda',
    element: (
      <PrivateRoute>
        <Demanda />
      </PrivateRoute>
    ),
  },

  {
    path: '/cliente',
    element: (
      <PrivateRoute>
        <Cliente />,
      </PrivateRoute>
    ),
  },

  {
    path: '/cadastrar-demanda',
    element: (
      <PrivateRoute>
        <CadastrarDemanda />,
      </PrivateRoute>
    ),
  },

  {
    path: '/cadastrar-oferta',
    element: (
      <PrivateRoute>
        <CadastrarOferta />,
      </PrivateRoute>
    ),
  },

  {
    path: '/cadastrar-cliente',
    element: (
      <PrivateRoute>
        <CadastroCliente />,
      </PrivateRoute>
    ),
  },
]

export const router = createBrowserRouter([...publicRoutes, ...privateRoutes])
