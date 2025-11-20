import React, { useState, useEffect, useRef } from "react";

const inicialConteo = () => ({
  "Linea 1": 0,
  "Linea 2": 0,
  "Linea 3": 0,
  "Linea 4": 0,
  "Linea 5": 0,
  "Linea 6": 0,
  "Linea 7": 0,
  "Linea 8": 0,
  "Linea 9": 0,
  "Linea 10": 0,
  "Linea 11": 0,
});

const TARIMAS_POR_TURNO = 30;

function ProductividadScanner({ onActualizarInventario }) {
  const [codigo, setCodigo] = useState("");
  const [conteo, setConteo] = useState(inicialConteo);
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const conteoGuardado = localStorage.getItem("conteoTarimas");
    const historialGuardado = localStorage.getItem("historialTarimas");

    if (conteoGuardado) setConteo(JSON.parse(conteoGuardado));
    if (historialGuardado) setHistorial(JSON.parse(historialGuardado));

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("conteoTarimas", JSON.stringify(conteo));
  }, [conteo]);

  useEffect(() => {
    localStorage.setItem("historialTarimas", JSON.stringify(historial));
  }, [historial]);

  const manejarEscaneo = (e) => {
    e.preventDefault();
    setError("");

    if (codigo.trim() === "") {
      setError("Por favor, ingresa un código.");
      return;
    }

    const ultimoChar = codigo[codigo.length - 1];
    const ultimoDigito = parseInt(ultimoChar, 10);

    if (isNaN(ultimoDigito) || ultimoDigito < 1 || ultimoDigito > 11) {
      setError("El código escaneado no corresponde a ninguna línea (1-11).");
      setCodigo("");
      inputRef.current.focus();
      return;
    }

    const lineaAsignada = "Linea " + ultimoDigito;

    setConteo((prevConteo) => ({
      ...prevConteo,
      [lineaAsignada]: (prevConteo[lineaAsignada] || 0) + 1,
    }));

    const nuevoRegistro = {
      codigo: codigo.trim(),
      linea: lineaAsignada,
      fecha: new Date().toLocaleString(),
    };

    setHistorial((prevHistorial) => [nuevoRegistro, ...prevHistorial]);

    if (onActualizarInventario) {
      onActualizarInventario(codigo.trim());
    }

    setCodigo("");
    inputRef.current.focus();
  };

  const reiniciarConteo = () => {
    setConteo(inicialConteo());
    setError("");
    inputRef.current.focus();
  };

  const reiniciarHistorial = () => {
    setHistorial([]);
    setError("");
    inputRef.current.focus();
  };

  const toggleModal = () => setModalVisible((v) => !v);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.mainTitle}>Escáner de tarimas</h1>

        <form onSubmit={manejarEscaneo} style={styles.scanForm}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Escanea o escribe el código aquí..."
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            style={styles.scanInput}
            autoComplete="off"
            autoFocus
          />
          <button
            type="submit"
            style={styles.scanButton}
          >
            Escanear
          </button>
        </form>

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        <div style={styles.controlButtons}>
          <button
            onClick={reiniciarConteo}
            style={styles.controlButton}
          >
            Reiniciar conteo
          </button>
          <button
            onClick={reiniciarHistorial}
            style={styles.controlButton}
          >
            Reiniciar historial
          </button>
          <button
            onClick={toggleModal}
            style={styles.controlButton}
          >
            {modalVisible ? "Cerrar Datos Guardados" : "Mostrar Datos Guardados"}
          </button>
        </div>
      </div>

      <h2 style={styles.sectionTitle}>Productividad por Línea</h2>

      <div style={styles.tableContainer}>
        <table style={styles.productivityTable}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Línea</th>
              <th style={styles.tableHeader}>Tarimas Escaneadas</th>
              <th style={styles.tableHeader}>Productividad</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(conteo).map(([linea, cantidad]) => {
              const porcentaje = (cantidad / TARIMAS_POR_TURNO) * 100;
              const backgroundColor = porcentaje >= 85 ? "#27ae60" : "#e74c3c";

              return (
                <tr key={linea} style={styles.tableRow}>
                  <td style={styles.tableCell}>{linea}</td>
                  <td style={styles.tableCell}>{cantidad}</td>
                  <td style={{
                    ...styles.tableCell,
                    ...styles.productivityCell,
                    backgroundColor
                  }}>
                    {porcentaje.toFixed(0)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 style={styles.sectionTitle}>Historial de Escaneos</h2>
      {historial.length === 0 ? (
        <p style={styles.emptyMessage}>
          No hay escaneos realizados.
        </p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.historyTable}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Código</th>
                <th style={styles.tableHeader}>Línea</th>
                <th style={styles.tableHeader}>Fecha y Hora</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((registro, index) => (
                <tr key={index} style={styles.tableRow}>
                  <td style={styles.tableCell}>{registro.codigo}</td>
                  <td style={styles.tableCell}>{registro.linea}</td>
                  <td style={styles.tableCell}>{registro.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalVisible && (
        <div
          style={styles.modalOverlay}
          onClick={toggleModal}
        >
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={styles.modalTitle}>Datos Guardados en localStorage</h3>
            <h4 style={styles.modalSubtitle}>Conteo</h4>
            <pre style={styles.modalPre}>
              {JSON.stringify(conteo, null, 2)}
            </pre>
            <h4 style={styles.modalSubtitle}>Historial</h4>
            <pre style={styles.modalPre}>
              {JSON.stringify(historial, null, 2)}
            </pre>
            <button
              onClick={toggleModal}
              style={styles.modalCloseButton}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "25px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    marginTop: "20px"
  },
  header: {
    textAlign: "center",
    marginBottom: "30px"
  },
  mainTitle: {
    color: "#2c3e50",
    fontSize: "32px",
    fontWeight: "600",
    marginBottom: "25px"
  },
  scanForm: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px"
  },
  scanInput: {
    padding: "12px 15px",
    fontSize: "16px",
    width: "350px",
    textAlign: "center",
    border: "2px solid #3498db",
    borderRadius: "8px",
    backgroundColor: "white",
    transition: "border-color 0.2s ease"
  },
  scanButton: {
    padding: "12px 24px",
    fontSize: "16px",
    cursor: "pointer",
    border: "2px solid #3498db",
    borderRadius: "8px",
    backgroundColor: "#3498db",
    color: "white",
    fontWeight: "600",
    transition: "background-color 0.2s ease"
  },
  errorMessage: {
    marginBottom: "20px",
    color: "white",
    backgroundColor: "#e74c3c",
    padding: "12px",
    borderRadius: "8px",
    textAlign: "center",
    fontWeight: "600"
  },
  controlButtons: {
    marginBottom: "30px",
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    flexWrap: "wrap"
  },
  controlButton: {
    padding: "12px 20px",
    fontSize: "14px",
    cursor: "pointer",
    border: "2px solid #2c3e50",
    borderRadius: "8px",
    backgroundColor: "#2c3e50",
    color: "white",
    fontWeight: "500",
    transition: "background-color 0.2s ease"
  },
  sectionTitle: {
    color: "#34495e",
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
    textAlign: "center"
  },
  tableContainer: {
    overflowX: "auto",
    marginBottom: "40px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  productivityTable: {
    borderCollapse: "collapse",
    width: "100%",
    maxWidth: "700px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden"
  },
  historyTable: {
    borderCollapse: "collapse",
    width: "100%",
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden"
  },
  tableHeader: {
    backgroundColor: "#34495e",
    color: "white",
    padding: "15px",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "14px"
  },
  tableRow: {
    borderBottom: "1px solid #ecf0f1"
  },
  tableCell: {
    padding: "12px 15px",
    textAlign: "center",
    fontSize: "14px",
    color: "#2c3e50"
  },
  productivityCell: {
    color: "white",
    fontWeight: "600",
    textAlign: "center"
  },
  emptyMessage: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#7f8c8d",
    fontSize: "16px",
    padding: "40px"
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modalContent: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    maxWidth: "90%",
    maxHeight: "80%",
    overflowY: "auto",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
  },
  modalTitle: {
    color: "#2c3e50",
    marginBottom: "20px",
    fontSize: "20px",
    fontWeight: "600"
  },
  modalSubtitle: {
    color: "#34495e",
    margin: "15px 0 10px 0",
    fontSize: "16px",
    fontWeight: "600"
  },
  modalPre: {
    backgroundColor: "#f8f9fa",
    padding: "15px",
    borderRadius: "6px",
    fontSize: "12px",
    overflow: "auto",
    border: "1px solid #e0e0e0"
  },
  modalCloseButton: {
    marginTop: "15px",
    padding: "10px 20px",
    fontSize: "14px",
    cursor: "pointer",
    border: "2px solid #e74c3c",
    borderRadius: "6px",
    backgroundColor: "#e74c3c",
    color: "white",
    fontWeight: "500"
  }
};

export default ProductividadScanner;