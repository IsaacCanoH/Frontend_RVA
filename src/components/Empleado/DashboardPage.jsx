import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardHeader from "./DashboardHeader"
import DashboardTabs from "./DashboardTabs"
import QRModal from "./QRModal"
import IncidenciaModal from "./IncidenciaModal"
import styles from "../../styles/dashboard.module.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { Camera, FileText, Clock, CheckCircle, XCircle, Upload, Calendar, AlertCircle, BarChart3, Settings, Bell, LogOut, X, Check, Info, AlertTriangle } from "lucide-react"

const DashboardPage = () => {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const notificationRef = useRef(null)

  // Estado general del usuario
  const storedUser = localStorage.getItem("usuario")
  const usuario = storedUser ? JSON.parse(storedUser) : { nombre: "Invitado", cargo: "", avatar: "" }

  // ----------------------------- Header / Notificaciones -----------------------------
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])

  const unreadCount = notifications.filter((n) => !n.leida).length

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })))
  }

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getNotificationIcon = (tipo) => {
    switch (tipo) {
      case "success": return <CheckCircle size={18} className="text-success" />
      case "warning": return <AlertTriangle size={18} className="text-warning" />
      case "error": return <XCircle size={18} className="text-danger" />
      case "info": return <Info size={18} className="text-info" />
      default: return <Bell size={18} className="text-muted" />
    }
  }

  const getNotificationBadgeColor = (tipo) => {
    switch (tipo) {
      case "success": return "bg-success"
      case "warning": return "bg-warning"
      case "error": return "bg-danger"
      case "info": return "bg-info"
      default: return "bg-secondary"
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
    navigate("/login")
  }

  // ----------------------------- Tabs / Panel Principal -----------------------------
  const [activeTab, setActiveTab] = useState("asistencias")
  const historialAsistencias = []
  const estadisticas = {}

  // ----------------------------- QR Modal -----------------------------
  const [showQRModal, setShowQRModal] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraActive(true)
    } catch {
      alert("No se pudo acceder a la cámara")
    }
  }

  const handleCloseCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach((track) => track.stop())
    }
    setCameraActive(false)
    setShowQRModal(false)
  }

  // ----------------------------- Incidencia Modal -----------------------------
  const [showIncidenciaModal, setShowIncidenciaModal] = useState(false)
  const [incidenciaForm, setIncidenciaForm] = useState({
    tipo: "",
    descripcion: "",
    fecha_incidencia: "",
    evidencias: [],
  })

  const handleIncidenciaChange = (e) => {
    const { name, value } = e.target
    setIncidenciaForm({ ...incidenciaForm, [name]: value })
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    setIncidenciaForm({ ...incidenciaForm, evidencias: [...incidenciaForm.evidencias, ...files] })
  }

  const handleSubmitIncidencia = (e) => {
    e.preventDefault()
    console.log("Incidencia submitted:", incidenciaForm)
    setShowIncidenciaModal(false)
    setIncidenciaForm({ tipo: "", descripcion: "", fecha_incidencia: "", evidencias: [] })
  }

  // ----------------------------- Render -----------------------------
  return (
    <div className="bg-light min-vh-100">
      <DashboardHeader
        usuario={usuario}
        unreadCount={unreadCount}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        notificationRef={notificationRef}
        notifications={notifications}
        markAllAsRead={markAllAsRead}
        markAsRead={markAsRead}
        deleteNotification={deleteNotification}
        getNotificationIcon={getNotificationIcon}
        getNotificationBadgeColor={getNotificationBadgeColor}
        styles={styles}
        handleLogout={handleLogout}
      />

      <div className="container-fluid px-4 py-4">
        <DashboardTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          historialAsistencias={historialAsistencias}
          estadisticas={estadisticas}
          setShowQRModal={setShowQRModal}
          setShowIncidenciaModal={setShowIncidenciaModal}
          usuario={usuario}
          styles={styles}
        />
      </div>

      {showQRModal && (
        <QRModal
          handleCloseCamera={handleCloseCamera}
          handleOpenCamera={handleOpenCamera}
          cameraActive={cameraActive}
          videoRef={videoRef}
          styles={styles}
        />
      )}

      {showIncidenciaModal && (
        <IncidenciaModal
          incidenciaForm={incidenciaForm}
          handleIncidenciaChange={handleIncidenciaChange}
          handleFileUpload={handleFileUpload}
          handleSubmitIncidencia={handleSubmitIncidencia}
          setShowIncidenciaModal={setShowIncidenciaModal}
          styles={styles}
        />
      )}
    </div>
  )
}

export default DashboardPage
