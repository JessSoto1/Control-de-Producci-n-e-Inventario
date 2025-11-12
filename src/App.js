import React, { useState } from "react";
import ProductividadScanner from "./components/ProductividadScanner";
import ScannerInventario from "./components/ScannerInventario";
import AssignOrderPage from "./components/AssignOrderPage"; // ✅ nueva sección

function App() {
  const [vista, setVista] = useState("productividad");
  const [inventario, setInventario] = useState({});

  // ✅ Función global para actualizar inventario
  const actualizarInventario = (codigo) => {
    setInventario((prev) => ({
      ...prev,
      [codigo]: (prev[codigo] || 0) + 1, // Suma 1 por cada escaneo
    }));
  };

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h1>📋 Sistema de Control</h1>

      <div style={{ marginBottom: 30 }}>
        <button
          onClick={() => setVista("productividad")}
          style={{
            padding: "10px 20px",
            marginRight: 10,
            backgroundColor: vista === "productividad" ? "#007bff" : "#f0f0f0",
            color: vista === "productividad" ? "#fff" : "#000",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          📈 Productividad
        </button>

        <button
          onClick={() => setVista("inventario")}
          style={{
            padding: "10px 20px",
            marginRight: 10,
            backgroundColor: vista === "inventario" ? "#28a745" : "#f0f0f0",
            color: vista === "inventario" ? "#fff" : "#000",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          📦 Inventario
        </button>

        {/* ✅ Nuevo botón para sección Asignar Órdenes */}
        <button
          onClick={() => setVista("asignarOrden")}
          style={{
            padding: "10px 20px",
            backgroundColor: vista === "asignarOrden" ? "#ffc107" : "#f0f0f0",
            color: vista === "asignarOrden" ? "#000" : "#000",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          🏭 Asignar Órdenes
        </button>
      </div>

      {/* 🔹 Pasamos props a cada vista */}
      {vista === "productividad" && (
        <ProductividadScanner onActualizarInventario={actualizarInventario} />
      )}

      {vista === "inventario" && <ScannerInventario inventario={inventario} />}

      {/* ✅ Renderizamos la nueva sección solo cuando se selecciona */}
      {vista === "asignarOrden" && <AssignOrderPage />}
    </div>
  );
}

export default App;

