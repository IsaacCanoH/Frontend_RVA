import { Camera } from "lucide-react"

const QRModal = ({ handleOpenCamera, handleCloseCamera, cameraActive, videoRef }) => {
  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-0 bg-primary text-white">
            <h5 className="modal-title fw-semibold d-flex align-items-center">
              <Camera size={20} className="me-2" />
              Registrar Asistencia
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={handleCloseCamera}></button>
          </div>
          <div className="modal-body p-4 text-center">
            {!cameraActive ? (
              <div className="py-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-4 align-items-center justify-content-center">
                  <Camera size={48} className="text-primary" />
                </div>
                <h6 className="fw-semibold mb-3">Escanear Código QR</h6>
                <p className="text-muted mb-4">Activa tu cámara para escanear el código QR de asistencia</p>
                <button
                  className="btn btn-primary px-4 py-2 d-flex align-items-center mx-auto"
                  onClick={handleOpenCamera}
                >
                  <Camera size={16} className="me-2" />
                  Activar Cámara
                </button>
              </div>
            ) : (
              <div>
                <video
                  ref={videoRef}
                  autoPlay
                  className="w-100 rounded-3 mb-3"
                  style={{ maxHeight: "300px" }}
                />
                <div className="bg-light rounded-3 p-3">
                  <p className="text-muted mb-0 small d-flex align-items-center justify-content-center">
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Buscando código QR...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRModal
