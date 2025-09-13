import { Procurar } from '../pages/procurar/Procurar.tsx'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { PrivateRoute } from './privateRoute.tsx'
import { Login } from '../pages/login/Login.tsx'

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Login />,
  },
]

const privateRoutes: RouteObject[] = [
  {
    path: '/procurar',
    element: (
      <PrivateRoute>
        <Procurar />
      </PrivateRoute>
    ),
  },
]

export const router = createBrowserRouter([...publicRoutes, ...privateRoutes])
