import React, { useState } from "react";
import ProductividadScanner from "./components/ProductividadScanner";
import ScannerInventario from "./components/ScannerInventario";

function App() {
  const [vista, setVista] = useState("productividad");

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
            backgroundColor: vista === "inventario" ? "#28a745" : "#f0f0f0",
            color: vista === "inventario" ? "#fff" : "#000",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          📦 Inventario
        </button>
      </div>

      {vista === "productividad" && <ProductividadScanner />}
      {vista === "inventario" && <ScannerInventario />}
    </div>
  );
}

export default App;
