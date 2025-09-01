import { type RouteObject } from 'react-router-dom'
import { Procurar } from '../pages/procurar/Procurar'

export const privateRoutes: RouteObject[] = [
  {
    path: '/procurar',
    element: <Procurar />,
  },
]
