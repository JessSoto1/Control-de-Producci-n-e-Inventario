import React, { useState } from "react";
import ProductividadScanner from "./components/ProductividadScanner";
import ScannerInventario from "./components/ScannerInventario";
import AssignOrderPage from "./components/AssignOrderPage";
import SolicitudMaterial from "./components/SolicitudMaterial";

function App() {
  const [vista, setVista] = useState("productividad");
  const [inventario, setInventario] = useState({});

  const actualizarInventario = (codigo) => {
    setInventario((prev) => ({
      ...prev,
      [codigo]: (prev[codigo] || 0) + 1,
    }));
  };

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h1 style={styles.appTitle}>Sistema de control</h1>
      </header>

      <nav style={styles.navigation}>
        <button
          onClick={() => setVista("productividad")}
          style={{
            ...styles.navButton,
            ...(vista === "productividad" ? styles.navButtonActive : {})
          }}
        >
          Productividad
        </button>

        <button
          onClick={() => setVista("inventario")}
          style={{
            ...styles.navButton,
            ...(vista === "inventario" ? styles.navButtonActive : {})
          }}
        >
          Inventario
        </button>

        <button
          onClick={() => setVista("asignarOrden")}
          style={{
            ...styles.navButton,
            ...(vista === "asignarOrden" ? styles.navButtonActive : {})
          }}
        >
          Asignar órdenes
        </button>

        <button
          onClick={() => setVista("solicitudMaterial")}
          style={{
            ...styles.navButton,
            ...(vista === "solicitudMaterial" ? styles.navButtonActive : {})
          }}
        >
          Solicitud de Material
        </button>
      </nav>

      <main style={styles.mainContent}>
        {vista === "productividad" && (
          <ProductividadScanner onActualizarInventario={actualizarInventario} />
        )}

        {vista === "inventario" && <ScannerInventario inventario={inventario} />}

        {vista === "asignarOrden" && <AssignOrderPage />}

        {vista === "solicitudMaterial" && <SolicitudMaterial />}
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>Sistema de control</p>
      </footer>
    </div>
  );
}

const styles = {
  appContainer: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: "100vh",
    backgroundColor: "#ecf0f1",
    display: "flex",
    flexDirection: "column"
  },
  header: {
    backgroundColor: "#2c3e50",
    padding: "20px 0",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  },
  appTitle: {
    color: "white",
    textAlign: "center",
    margin: 0,
    fontSize: "32px",
    fontWeight: "600"
  },
  navigation: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    padding: "20px",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    flexWrap: "wrap"
  },
  navButton: {
    padding: "12px 24px",
    backgroundColor: "#f8f9fa",
    color: "#2c3e50",
    border: "2px solid #bdc3c7",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    minWidth: "140px"
  },
  navButtonActive: {
    backgroundColor: "#3498db",
    color: "white",
    borderColor: "#3498db",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(52, 152, 219, 0.3)"
  },
  mainContent: {
    flex: 1,
    padding: "20px"
  },
  footer: {
    backgroundColor: "#34495e",
    padding: "20px",
    textAlign: "center",
    marginTop: "auto"
  },
  footerText: {
    color: "white",
    margin: 0,
    fontSize: "14px",
    fontWeight: "500"
  }
};

export default App;