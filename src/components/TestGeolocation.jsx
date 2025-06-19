import { useState } from "react"

const TestGeolocation = () => {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const obtenerUbicacion = () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("La geolocalización no es compatible con este navegador.")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy, // en metros
        })
        setLoading(false)
      },
      (err) => {
        setError(`Error: ${err.message}`)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>📍 Prueba de Precisión GPS</h2>
      <button onClick={obtenerUbicacion} disabled={loading}>
        {loading ? "Obteniendo ubicación..." : "Obtener Ubicación Precisa"}
      </button>

      {location && (
        <div style={{ marginTop: "1rem" }}>
          <p><strong>Latitud:</strong> {location.latitude}</p>
          <p><strong>Longitud:</strong> {location.longitude}</p>
          <p><strong>Precisión:</strong> {location.accuracy} metros</p>
        </div>
      )}

      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
      )}
    </div>
  )
}

export default TestGeolocation
