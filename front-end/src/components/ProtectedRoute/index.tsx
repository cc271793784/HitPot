import { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'

import userStore from 'stores/user'

interface Props {
  children: ReactElement
}

export const ProtectedRoute = ({ children }: Props) => {
  if (userStore.isLoggedIn === false) {
    return <Navigate to='/' />
  }
  return children
}
