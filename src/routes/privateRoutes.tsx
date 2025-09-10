import { type RouteObject } from 'react-router-dom'
import { Procurar } from '../pages/procurar/Procurar'
import { PrivateRoute } from './privateRoute'

export const privateRoutes: RouteObject[] = [
  {
    path: '/procurar',
    element: (
      <PrivateRoute>
        <Procurar />
      </PrivateRoute>
    ),
  },
]
