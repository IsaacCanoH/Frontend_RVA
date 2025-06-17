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

  // Estado para manejar los errores de validación
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  const { showLoader, hideLoader } = useLoader()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Limpiar el error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  // Función para validar el formato del email
  const validateEmail = (email) => {
    // Esta expresión regular verifica que el formato sea usuario@inaeba.edu.mx
    const emailRegex = /^[^\s@]+@inaeba\.edu\.mx$/
    return emailRegex.test(email)
  }

  // Función para validar la contraseña
  const validatePassword = (password) => {
    return password.length >= 6
  }

  // Función para validar todos los campos antes del envío
  const validateForm = () => {
    const newErrors = {}

    // Validación del email
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Por favor ingresa un correo electrónico válido"
    }

    // Validación de la contraseña
    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es obligatoria"
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar el formulario antes de enviar
    if (!validateForm()) {
      return
    }

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
        <div className="col-lg-7 col-12 d-flex justify-content-center py-3 py-lg-0 align-items-start align-items-lg-center">
          <div className="w-100 pt-0 px-3 px-sm-4 px-lg-5">
            <LoginForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              styles={styles}
              errors={errors} // Pasar los errores al componente LoginForm
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
