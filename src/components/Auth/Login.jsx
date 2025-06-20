import { useState } from "react"
import LoginForm from "./LoginForm"
import LoginHeader from "./LoginHeader"
import { login } from "../../services/authService"
import "bootstrap/dist/css/bootstrap.min.css"
import styles from "../../styles/login.module.css"
import { useLoader } from "../../context/LoaderContext"
import { useNavigate } from "react-router-dom"

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    usuario: "",
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

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { usuario, password } = formData

    try {
      showLoader()
      const result = await login(usuario, password)

      if (result.success) {
        navigate("/dashboard")
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
        <div className="col-lg-7 col-12 d-flex justify-content-center py-3 py-lg-0 align-items-start align-items-lg-center">
          <div className="w-100 pt-0 px-3 px-sm-4 px-lg-5">
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
