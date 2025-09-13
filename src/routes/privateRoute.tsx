import { Navigate } from 'react-router-dom'

export const PrivateRoute = ({ children }: any) => {
  const authData = JSON.parse(localStorage.getItem('authCampoData') || '') || ''
  const isAuthenticated =
    authData &&
    authData.isCampoAuthenticated &&
    authData.expiration > Date.now()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return children
}
