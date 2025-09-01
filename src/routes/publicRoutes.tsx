import { Login } from '../pages/login/Login'
import { type RouteObject } from 'react-router-dom'

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Login />,
  },
]
