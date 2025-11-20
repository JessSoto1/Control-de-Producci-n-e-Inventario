import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";

function ScannerInventario({ inventario }) {
  const [tipoInventario, setTipoInventario] = useState("productos");
  const [modo, setModo] = useState("entrada");
  const [codigo, setCodigo] = useState("");
  const [inventarioMaterias, setInventarioMaterias] = useState([]);
  const [inventarioProductos, setInventarioProductos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState("");
  const [mostrarAlertaSolicitud, setMostrarAlertaSolicitud] = useState(false);
  const [solicitudesRegistro, setSolicitudesRegistro] = useState([]);
  const inputRef = useRef(null);

  const getInventarioActivo = () =>
    tipoInventario === "materias" ? inventarioMaterias : inventarioProductos;

  const setInventarioActivo = (data) => {
    if (tipoInventario === "materias") {
      setInventarioMaterias(data);
    } else {
      setInventarioProductos(data);
    }
  };

  const obtenerTituloInventario = () =>
    tipoInventario === "materias" ? "Materias Primas" : "Producto Terminado";

  useEffect(() => {
    console.log("📢 Tipo de inventario cambió a:", obtenerTituloInventario());
    document.title = `Inventario - ${obtenerTituloInventario()}`;
  }, [tipoInventario]);

  // Cargar datos iniciales y verificar solicitudes
  useEffect(() => {
    const materias = localStorage.getItem("inventarioMaterias");
    const productos = localStorage.getItem("inventarioProductos");
    const historialGuardado = localStorage.getItem("historial");
    const solicitudes = JSON.parse(localStorage.getItem("solicitudesMaterial")) || [];

    if (materias) setInventarioMaterias(JSON.parse(materias));
    if (productos) setInventarioProductos(JSON.parse(productos));
    if (historialGuardado) setHistorial(JSON.parse(historialGuardado));
    
    // Cargar solicitudes para el registro
    setSolicitudesRegistro(solicitudes);
    
    // Mostrar alerta si hay solicitudes recientes (menos de 1 hora)
    const ahora = new Date().getTime();
    const solicitudesRecientes = solicitudes.filter(s => 
      (ahora - s.timestamp) < 3600000 // 1 hora en milisegundos
    );
    
    if (solicitudesRecientes.length > 0) {
      setMostrarAlertaSolicitud(true);
    }
  }, []);

  // Escuchar cambios en localStorage para solicitudes
  useEffect(() => {
    const manejarCambioStorage = (e) => {
      if (e.key === "solicitudesMaterial") {
        const nuevasSolicitudes = JSON.parse(e.newValue) || [];
        setSolicitudesRegistro(nuevasSolicitudes);
        
        // Mostrar alerta cuando se agregue una nueva solicitud
        if (e.oldValue !== e.newValue && nuevasSolicitudes.length > 0) {
          const ahora = new Date().getTime();
          const ultimaSolicitud = nuevasSolicitudes[nuevasSolicitudes.length - 1];
          if ((ahora - ultimaSolicitud.timestamp) < 60000) { // 1 minuto
            setMostrarAlertaSolicitud(true);
          }
        }
      }
    };

    window.addEventListener("storage", manejarCambioStorage);
    
    // También verificar periódicamente
    const intervalo = setInterval(() => {
      const solicitudes = JSON.parse(localStorage.getItem("solicitudesMaterial")) || [];
      setSolicitudesRegistro(solicitudes);
    }, 5000);

    return () => {
      window.removeEventListener("storage", manejarCambioStorage);
      clearInterval(intervalo);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("inventarioMaterias", JSON.stringify(inventarioMaterias));
  }, [inventarioMaterias]);

  useEffect(() => {
    localStorage.setItem("inventarioProductos", JSON.stringify(inventarioProductos));
  }, [inventarioProductos]);

  useEffect(() => {
    localStorage.setItem("historial", JSON.stringify(historial));
  }, [historial]);

  useEffect(() => {
    if (!inventario) return;

    console.log("🔁 Sincronizando inventario desde Productividad:", inventario);

    setInventarioProductos((prevInventario) =>
      prevInventario.map((item) => {
        const codigo = String(item["CODIGO DE BARRAS"]).trim();
        const cantidadProductividad = inventario[codigo] || 0;
        return {
          ...item,
          EXISTENCIA: Number(item.EXISTENCIA || 0) + cantidadProductividad,
        };
      })
    );
  }, [inventario]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [codigo, modo, tipoInventario]);

  const manejarArchivo = (e) => {
    const archivo = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setInventarioActivo(jsonData);
      localStorage.setItem(
        tipoInventario === "materias" ? "inventarioMaterias" : "inventarioProductos",
        JSON.stringify(jsonData)
      );
    };

    reader.readAsArrayBuffer(archivo);
  };

  const manejarEscaneo = (e) => {
    e.preventDefault();
    if (!codigo.trim()) return;

    const inventario = getInventarioActivo();
    const encontrado = inventario.find(
      (item) => String(item["CODIGO DE BARRAS"]).trim() === codigo.trim()
    );

    if (!encontrado) {
      setError(`Código ${codigo} no encontrado.`);
    } else {
      const nuevoInventario = inventario.map((item) => {
        if (String(item["CODIGO DE BARRAS"]).trim() === codigo.trim()) {
          let nuevaCantidad = Number(item.EXISTENCIA || 0);
          nuevaCantidad = modo === "entrada" ? nuevaCantidad + 1 : Math.max(0, nuevaCantidad - 1);
          return { ...item, EXISTENCIA: nuevaCantidad };
        }
        return item;
      });

      setInventarioActivo(nuevoInventario);
      setHistorial((prev) => [
        {
          codigo,
          sku: encontrado.SKU,
          descripcion: encontrado.DESCRIPCION,
          accion: modo === "entrada" ? "Entrada" : "Salida",
          tipo: obtenerTituloInventario(),
          fecha: new Date().toLocaleString(),
        },
        ...prev,
      ]);
      setError("");
    }

    setCodigo("");
    inputRef.current?.focus();
  };

  const reiniciarInventario = () => {
    if (window.confirm("¿Seguro que quieres borrar este inventario?")) {
      setInventarioActivo([]);
      localStorage.removeItem(
        tipoInventario === "materias" ? "inventarioMaterias" : "inventarioProductos"
      );
    }
  };

  const cerrarAlertaSolicitud = () => {
    setMostrarAlertaSolicitud(false);
  };

  const eliminarSolicitudRegistro = (id) => {
    const nuevasSolicitudes = solicitudesRegistro.filter(s => s.id !== id);
    setSolicitudesRegistro(nuevasSolicitudes);
    localStorage.setItem("solicitudesMaterial", JSON.stringify(nuevasSolicitudes));
  };

  const inventarioActual = getInventarioActivo();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Sistema de inventario</h1>

      {/* Alerta de Solicitud de Material */}
      {mostrarAlertaSolicitud && (
        <div style={styles.alertaContainer}>
          <div style={styles.alertaContent}>
            <span style={styles.alertaText}>
              ⚠️ Hay solicitudes de material pendientes del contenedor de Solicitud de Materiales
            </span>
            <button
              onClick={cerrarAlertaSolicitud}
              style={styles.cerrarAlertaButton}
              title="Cerrar alerta"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div style={styles.controls}>
        <div style={styles.controlGroup}>
          <label style={styles.label}><strong>Tipo de inventario:</strong></label>
          <select
            value={tipoInventario}
            onChange={(e) => {
              setTipoInventario(e.target.value);
              console.log("🟢 Nuevo tipo de inventario:", e.target.value);
            }}
            style={styles.select}
          >
            <option value="materias">Materias primas</option>
            <option value="productos">Producto terminado</option>
          </select>
        </div>

        <div style={styles.controlGroup}>
          <label style={styles.label}><strong>Modo de operación:</strong></label>
          <select
            value={modo}
            onChange={(e) => setModo(e.target.value)}
            style={styles.select}
          >
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </div>
      </div>

      <form onSubmit={manejarEscaneo} style={styles.scanForm}>
        <input
          type="text"
          ref={inputRef}
          value={codigo}
          placeholder="Escanea el código de barras"
          onChange={(e) => setCodigo(e.target.value)}
          style={styles.scanInput}
        />
        <button type="submit" style={styles.scanButton}>
          Escanear
        </button>
      </form>

      <div style={styles.fileUpload}>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={manejarArchivo}
          style={styles.fileInput}
        />
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}

      <h2 style={styles.inventoryTitle}>
        Inventario Actual: <span style={styles.inventoryType}>{obtenerTituloInventario()}</span>
      </h2>

      <div style={styles.tableContainer}>
        <table style={styles.inventoryTable}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>SKU</th>
              <th style={styles.tableHeader}>Código de Barras</th>
              <th style={styles.tableHeader}>Descripción</th>
              <th style={styles.tableHeader}>Existencia</th>
              <th style={styles.tableHeader}>Costo</th>
              <th style={styles.tableHeader}>Ubicación</th>
            </tr>
          </thead>
          <tbody>
            {inventarioActual.map((item, index) => (
              <tr key={index} style={styles.tableRow}>
                <td style={styles.tableCell}>{item.SKU}</td>
                <td style={styles.tableCell}>{item["CODIGO DE BARRAS"]}</td>
                <td style={styles.tableCell}>{item.DESCRIPCION}</td>
                <td style={styles.tableCell}>{item.EXISTENCIA}</td>
                <td style={styles.tableCell}>
                  {item.COSTO
                    ? `$${Number(item.COSTO).toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "$0.00"}
                </td>
                <td style={styles.tableCell}>{item.UBICACIÓN}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={styles.sectionTitle}>Historial de movimientos</h2>
      <div style={styles.tableContainer}>
        <table style={styles.historyTable}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Fecha</th>
              <th style={styles.tableHeader}>Tipo</th>
              <th style={styles.tableHeader}>Código</th>
              <th style={styles.tableHeader}>SKU</th>
              <th style={styles.tableHeader}>Descripción</th>
              <th style={styles.tableHeader}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((reg, idx) => (
              <tr key={idx} style={styles.tableRow}>
                <td style={styles.tableCell}>{reg.fecha}</td>
                <td style={styles.tableCell}>{reg.tipo}</td>
                <td style={styles.tableCell}>{reg.codigo}</td>
                <td style={styles.tableCell}>{reg.sku}</td>
                <td style={styles.tableCell}>{reg.descripcion}</td>
                <td style={styles.tableCell}>{reg.accion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Registro de Solicitudes de Material */}
      <h2 style={styles.sectionTitle}>Registro de Solicitudes de Material</h2>
      <div style={styles.tableContainer}>
        <table style={styles.historyTable}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Fecha</th>
              <th style={styles.tableHeader}>Orden #</th>
              <th style={styles.tableHeader}>Descripción</th>
              <th style={styles.tableHeader}>Cantidad</th>
              <th style={styles.tableHeader}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {solicitudesRegistro.length === 0 ? (
              <tr>
                <td colSpan="5" style={{...styles.tableCell, textAlign: "center"}}>
                  No hay solicitudes registradas
                </td>
              </tr>
            ) : (
              solicitudesRegistro.map((solicitud) => (
                <tr key={solicitud.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{solicitud.fecha}</td>
                  <td style={styles.tableCell}>#{solicitud.numeroOrden}</td>
                  <td style={styles.tableCell}>{solicitud.descripcion}</td>
                  <td style={styles.tableCell}>{solicitud.cantidad}</td>
                  <td style={styles.tableCell}>
                    <button
                      onClick={() => eliminarSolicitudRegistro(solicitud.id)}
                      style={styles.deleteSmallButton}
                      title="Eliminar solicitud"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={reiniciarInventario}
        style={styles.resetButton}
      >
        Reiniciar inventario actual
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    marginTop: "20px"
  },
  title: {
    color: "#2c3e50",
    fontSize: "32px",
    fontWeight: "600",
    marginBottom: "25px",
    textAlign: "center"
  },
   
  alertaContainer: {
    backgroundColor: "#fff3cd",
    border: "1px solid #ffeaa7",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "25px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  alertaContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  alertaText: {
    color: "#856404",
    fontSize: "16px",
    fontWeight: "500"
  },
  cerrarAlertaButton: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#856404",
    fontWeight: "bold",
    padding: "5px 10px",
    borderRadius: "4px",
    transition: "background-color 0.2s ease"
  },
  controls: {
    display: "flex",
    gap: "30px",
    marginBottom: "25px",
    flexWrap: "wrap"
  },
  controlGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    color: "#34495e",
    fontSize: "14px",
    fontWeight: "600"
  },
  select: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    backgroundColor: "white",
    fontSize: "14px",
    minWidth: "200px"
  },
  scanForm: {
    marginBottom: "20px",
    display: "flex",
    gap: "10px",
    alignItems: "center"
  },
  scanInput: {
    padding: "12px 15px",
    fontSize: "16px",
    width: "300px",
    textAlign: "center",
    border: "2px solid #3498db",
    borderRadius: "8px",
    backgroundColor: "white"
  },
  scanButton: {
    padding: "12px 24px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600"
  },
  fileUpload: {
    marginBottom: "20px"
  },
  fileInput: {
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    backgroundColor: "white"
  },
  errorMessage: {
    color: "#e74c3c",
    marginBottom: "20px",
    padding: "12px",
    backgroundColor: "#fadbd8",
    borderRadius: "6px",
    fontWeight: "500"
  },
  inventoryTitle: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#2c3e50",
    fontWeight: "600"
  },
  inventoryType: {
    color: "#3498db"
  },
  sectionTitle: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#2c3e50",
    fontWeight: "600",
    marginTop: "40px"
  },
  tableContainer: {
    overflowX: "auto",
    marginBottom: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  inventoryTable: {
    borderCollapse: "collapse",
    width: "100%",
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
    padding: "15px 12px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "14px"
  },
  tableRow: {
    borderBottom: "1px solid #ecf0f1"
  },
  tableCell: {
    padding: "12px 12px",
    textAlign: "left",
    fontSize: "14px",
    color: "#2c3e50"
  },
  deleteSmallButton: {
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    color: "#e74c3c",
    fontWeight: "bold",
    padding: "5px 10px",
    borderRadius: "4px",
    transition: "background-color 0.2s ease"
  },
  resetButton: {
    marginTop: "30px",
    padding: "12px 24px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "background-color 0.2s ease"
  }
};

export default ScannerInventario;