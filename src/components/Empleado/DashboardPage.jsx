import { useState, useRef, useEffect } from "react"
import DashboardHeader from "./DashboardHeader"
import DashboardTabs from "./DashboardTabs"
import QRModal from "./QRModal"
import IncidenciaModal from "./IncidenciaModal"
import styles from "../../styles/dashboard.module.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { useNavigate } from "react-router-dom"

import {
  Camera,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  Calendar,
  AlertCircle,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  X,
  Check,
  Info,
  AlertTriangle,
} from "lucide-react"

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("asistencias")
  const [showQRModal, setShowQRModal] = useState(false)
  const [showIncidenciaModal, setShowIncidenciaModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef(null)
  const notificationRef = useRef(null)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
    navigate("/login")
  }

  const [incidenciaForm, setIncidenciaForm] = useState({
    tipo: "",
    descripcion: "",
    fecha_incidencia: "",
    evidencias: [],
  })

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      tipo: "success",
      titulo: "Asistencia Registrada",
      mensaje: "Tu asistencia del día de hoy ha sido registrada correctamente",
      fecha: "2024-01-10 08:00",
      leida: false,
    },
    {
      id: 2,
      tipo: "warning",
      titulo: "Incidencia Pendiente",
      mensaje: "Tu solicitud de justificación de falta está en revisión",
      fecha: "2024-01-09 14:30",
      leida: false,
    },
    {
      id: 3,
      tipo: "info",
      titulo: "Recordatorio",
      mensaje: "No olvides registrar tu salida al finalizar tu jornada laboral",
      fecha: "2024-01-09 16:45",
      leida: true,
    },
    {
      id: 4,
      tipo: "error",
      titulo: "Incidencia Rechazada",
      mensaje: "Tu solicitud de justificación requiere documentación adicional",
      fecha: "2024-01-08 10:15",
      leida: true,
    },
    {
      id: 5,
      tipo: "success",
      titulo: "Incidencia Aprobada",
      mensaje: "Tu justificación de retardo ha sido aprobada por tu supervisor",
      fecha: "2024-01-07 09:20",
      leida: true,
    },
  ])

  const storedUser = localStorage.getItem("usuario")
  const usuario = storedUser ? JSON.parse(storedUser) : { nombre: "Invitado", cargo: "", avatar: "" }


  const historialAsistencias = [
    { fecha: "2024-01-10", entrada: "08:00", salida: "17:00", estado: "completo", horas: "9h 00m" },
    { fecha: "2024-01-09", entrada: "08:15", salida: "17:00", estado: "retardo", horas: "8h 45m" },
    { fecha: "2024-01-08", entrada: "08:00", salida: "17:00", estado: "completo", horas: "9h 00m" },
    { fecha: "2024-01-07", entrada: "-", salida: "-", estado: "falta", horas: "0h 00m" },
    { fecha: "2024-01-06", entrada: "08:00", salida: "17:00", estado: "completo", horas: "9h 00m" },
  ]

  const estadisticas = {
    asistencias: 22,
    retardos: 3,
    faltas: 1,
    porcentaje: 92,
  }

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

  const unreadCount = notifications.filter((n) => !n.leida).length

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
