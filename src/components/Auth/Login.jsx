import { useState } from "react"
import LoginForm from "./LoginForm"
import LoginHeader from "./LoginHeader"
import { login } from "../../services/authService"
import "bootstrap/dist/css/bootstrap.min.css"
import styles from "../../styles/login.module.css"
import { useLoader } from "../../context/LoaderContext"

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })

  const { showLoader, hideLoader } = useLoader()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { email, password } = formData

    try {
      showLoader()
      const result = await login(email, password)

      if (result.success) {
        alert(`¡Bienvenido, ${result.usuario.nombre}!`)
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch {
      alert(`Ups... hubo un error inesperado 🐞`)
    } finally {
      hideLoader()
    }
  }

  return (
    <div className="container-fluid p-0 min-vh-100">
      <div className="row g-0 min-vh-100">
        <LoginHeader styles={styles} />
        <div className="col-lg-7 col-12 d-flex align-items-center justify-content-center py-4 py-lg-0">
          <div className="w-100 px-3 px-sm-4 px-lg-5">
            <LoginForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              styles={styles}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
