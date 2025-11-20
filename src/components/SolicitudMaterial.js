import React, { useState } from "react";

function SolicitudMaterial() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [numeroOrden, setNumeroOrden] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidad, setCantidad] = useState("");

  const handleEnviarSolicitud = (e) => {
    e.preventDefault();
    
    if (!numeroOrden || !descripcion || !cantidad) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const nuevaSolicitud = {
      id: Date.now(),
      numeroOrden: parseInt(numeroOrden, 10),
      descripcion,
      cantidad: parseInt(cantidad, 10),
      fecha: new Date().toLocaleString(),
      timestamp: new Date().getTime()
    };

    // Guardar en localStorage para que ScannerInventario pueda acceder
    const solicitudesExistentes = JSON.parse(localStorage.getItem("solicitudesMaterial")) || [];
    const todasSolicitudes = [...solicitudesExistentes, nuevaSolicitud];
    localStorage.setItem("solicitudesMaterial", JSON.stringify(todasSolicitudes));
    
    // Actualizar estado local
    setSolicitudes(todasSolicitudes);
    
    // Limpiar formulario
    setNumeroOrden("");
    setDescripcion("");
    setCantidad("");
    
    alert("Solicitud enviada correctamente!");
  };

  const handleImprimirSolicitud = (solicitud) => {
    const ventanaImpresion = window.open("", "_blank");
    ventanaImpresion.document.write(`
      <html>
        <head>
          <title>Solicitud de Material - Orden ${solicitud.numeroOrden}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .info { margin-bottom: 15px; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Solicitud de Material</h1>
            <p>Fecha: ${solicitud.fecha}</p>
          </div>
          <div class="info">
            <span class="label">Número de Orden:</span> ${solicitud.numeroOrden}
          </div>
          <div class="info">
            <span class="label">Descripción:</span> ${solicitud.descripcion}
          </div>
          <div class="info">
            <span class="label">Cantidad:</span> ${solicitud.cantidad}
          </div>
        </body>
      </html>
    `);
    ventanaImpresion.document.close();
    ventanaImpresion.print();
  };

  const handleEliminarSolicitud = (id) => {
    const nuevasSolicitudes = solicitudes.filter(s => s.id !== id);
    setSolicitudes(nuevasSolicitudes);
    localStorage.setItem("solicitudesMaterial", JSON.stringify(nuevasSolicitudes));
  };

  // Cargar solicitudes existentes al montar el componente
  React.useEffect(() => {
    const solicitudesGuardadas = JSON.parse(localStorage.getItem("solicitudesMaterial")) || [];
    setSolicitudes(solicitudesGuardadas);
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Solicitud de Materiales</h2>

      <div style={styles.formContainer}>
        <h3 style={styles.subtitle}>Nueva Solicitud</h3>
        <form onSubmit={handleEnviarSolicitud} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Número de Orden:</label>
            <input
              type="number"
              value={numeroOrden}
              onChange={(e) => setNumeroOrden(e.target.value)}
              style={styles.input}
              placeholder="Ingrese el número de orden"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Descripción del Producto:</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              style={styles.textarea}
              placeholder="Descripción del producto requerido"
              rows="3"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Cantidad:</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              style={styles.input}
              placeholder="Cantidad requerida"
            />
          </div>

          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.primaryButton}>
              Enviar Solicitud
            </button>
          </div>
        </form>
      </div>

      <div style={styles.historialContainer}>
        <h3 style={styles.subtitle}>Historial de Solicitudes</h3>
        {solicitudes.length === 0 ? (
          <p style={styles.emptyMessage}>No hay solicitudes registradas.</p>
        ) : (
          <div style={styles.solicitudesGrid}>
            {solicitudes.map((solicitud) => (
              <div key={solicitud.id} style={styles.solicitudCard}>
                <div style={styles.solicitudHeader}>
                  <h4 style={styles.solicitudTitle}>Orden #{solicitud.numeroOrden}</h4>
                  <button
                    onClick={() => handleEliminarSolicitud(solicitud.id)}
                    style={styles.deleteButton}
                    title="Eliminar solicitud"
                  >
                    ✕
                  </button>
                </div>
                <p style={styles.solicitudText}><strong>Descripción:</strong> {solicitud.descripcion}</p>
                <p style={styles.solicitudText}><strong>Cantidad:</strong> {solicitud.cantidad}</p>
                <p style={styles.solicitudText}><strong>Fecha:</strong> {solicitud.fecha}</p>
                <button
                  onClick={() => handleImprimirSolicitud(solicitud)}
                  style={styles.secondaryButton}
                >
                  Imprimir Solicitud
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  title: {
    color: "#2c3e50",
    marginBottom: "25px",
    fontSize: "28px",
    fontWeight: "600",
    borderBottom: "2px solid #3498db",
    paddingBottom: "10px"
  },
  subtitle: {
    color: "#34495e",
    marginBottom: "20px",
    fontSize: "20px",
    fontWeight: "500"
  },
  formContainer: {
    border: "2px solid #3498db",
    borderRadius: "12px",
    padding: "25px",
    marginBottom: "30px",
    backgroundColor: "white",
    boxShadow: "0 4px 6px rgba(52, 152, 219, 0.1)"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    color: "#2c3e50",
    fontSize: "14px",
    fontWeight: "600"
  },
  input: {
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    backgroundColor: "#f8f9fa",
    transition: "border-color 0.2s ease"
  },
  textarea: {
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    backgroundColor: "#f8f9fa",
    transition: "border-color 0.2s ease",
    resize: "vertical",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  buttonGroup: {
    display: "flex",
    gap: "15px",
    marginTop: "10px"
  },
  primaryButton: {
    padding: "12px 24px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "background-color 0.2s ease"
  },
  secondaryButton: {
    padding: "8px 16px",
    backgroundColor: "#95a5a6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s ease"
  },
  historialContainer: {
    border: "2px solid #34495e",
    borderRadius: "12px",
    padding: "25px",
    backgroundColor: "white",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  },
  emptyMessage: {
    textAlign: "center",
    color: "#7f8c8d",
    fontStyle: "italic",
    padding: "20px"
  },
  solicitudesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px"
  },
  solicitudCard: {
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "20px",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    position: "relative"
  },
  solicitudHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px"
  },
  solicitudTitle: {
    color: "#2c3e50",
    margin: "0",
    fontSize: "18px",
    fontWeight: "600"
  },
  deleteButton: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#e74c3c",
    fontWeight: "bold",
    padding: "0",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "background-color 0.2s ease"
  },
  solicitudText: {
    color: "#5d6d7e",
    margin: "8px 0",
    fontSize: "14px",
    lineHeight: "1.4"
  }
};

export default SolicitudMaterial;