import { Navigate } from "react-router-dom"

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token")

  // Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Si hay token, muestra el componente hijo (ej. Dashboard)
  return children
}

export default PrivateRoute
