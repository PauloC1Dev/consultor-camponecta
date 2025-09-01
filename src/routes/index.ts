import { publicRoutes } from './publicRoutes'
import { privateRoutes } from './privateRoutes'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([...publicRoutes, ...privateRoutes])
