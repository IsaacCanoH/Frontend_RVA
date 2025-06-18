import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "../components/Auth/Login"
import DashboardPage from "../components/Empleado/DashboardPage"
import PrivateRoute from "./PrivateRoute"

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
