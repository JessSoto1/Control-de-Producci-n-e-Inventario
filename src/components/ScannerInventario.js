import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";

function ScannerInventario({ inventario }) {
  const [tipoInventario, setTipoInventario] = useState("productos"); // 🔹 Ahora inicia en Producto Terminado
  const [modo, setModo] = useState("entrada");
  const [codigo, setCodigo] = useState("");
  const [inventarioMaterias, setInventarioMaterias] = useState([]);
  const [inventarioProductos, setInventarioProductos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  // FUNCIONES DE INVENTARIO ACTIVO
  const getInventarioActivo = () =>
    tipoInventario === "materias" ? inventarioMaterias : inventarioProductos;

  const setInventarioActivo = (data) => {
    if (tipoInventario === "materias") {
      setInventarioMaterias(data);
    } else {
      setInventarioProductos(data);
    }
  };

  // Nombre legible para inventario
  const obtenerTituloInventario = () =>
    tipoInventario === "materias" ? "Materias Primas" : "Producto Terminado";

  // Log y título del navegador
  useEffect(() => {
    console.log("📢 Tipo de inventario cambió a:", obtenerTituloInventario());
    document.title = `Inventario - ${obtenerTituloInventario()}`;
  }, [tipoInventario]);

  // Cargar inventarios desde localStorage
  useEffect(() => {
    const materias = localStorage.getItem("inventarioMaterias");
    const productos = localStorage.getItem("inventarioProductos");
    const historialGuardado = localStorage.getItem("historial");

    if (materias) setInventarioMaterias(JSON.parse(materias));
    if (productos) setInventarioProductos(JSON.parse(productos));
    if (historialGuardado) setHistorial(JSON.parse(historialGuardado));
  }, []);

  // Guardar inventarios y historial en localStorage
  useEffect(() => {
    localStorage.setItem("inventarioMaterias", JSON.stringify(inventarioMaterias));
  }, [inventarioMaterias]);

  useEffect(() => {
    localStorage.setItem("inventarioProductos", JSON.stringify(inventarioProductos));
  }, [inventarioProductos]);

  useEffect(() => {
    localStorage.setItem("historial", JSON.stringify(historial));
  }, [historial]);

  // 🔄 Sincronizar inventario con datos de productividad
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

  // Enfocar input al cambiar código, modo o tipo de inventario
  useEffect(() => {
    inputRef.current?.focus();
  }, [codigo, modo, tipoInventario]);

  // Leer archivo Excel y cargar datos
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

  // Escanear y actualizar inventario
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

  // Reiniciar inventario actual
  const reiniciarInventario = () => {
    if (window.confirm("¿Seguro que quieres borrar este inventario?")) {
      setInventarioActivo([]);
      localStorage.removeItem(
        tipoInventario === "materias" ? "inventarioMaterias" : "inventarioProductos"
      );
    }
  };

  const inventarioActual = getInventarioActivo();

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>📦 Sistema de Inventario</h1>

      {/* Selector tipo de inventario */}
      <div style={{ marginBottom: 10 }}>
        <label><strong>Tipo de Inventario:</strong></label>
        <select
          value={tipoInventario}
          onChange={(e) => {
            setTipoInventario(e.target.value);
            console.log("🟢 Nuevo tipo de inventario:", e.target.value);
          }}
          style={{ marginLeft: 10 }}
        >
          <option value="materias">Materias Primas</option>
          <option value="productos">Producto Terminado</option>
        </select>
      </div>

      {/* Selector modo */}
      <div style={{ marginBottom: 20 }}>
        <label><strong>Modo de operación:</strong></label>
        <select
          value={modo}
          onChange={(e) => setModo(e.target.value)}
          style={{ marginLeft: 10 }}
        >
          <option value="entrada">🟢 Entrada</option>
          <option value="salida">🔴 Salida</option>
        </select>
      </div>

      {/* Input escaneo */}
      <form onSubmit={manejarEscaneo} style={{ marginBottom: 20 }}>
        <input
          type="text"
          ref={inputRef}
          value={codigo}
          placeholder="Escanea el código de barras"
          onChange={(e) => setCodigo(e.target.value)}
          style={{
            padding: 10,
            fontSize: 16,
            width: 300,
            textAlign: "center",
            border: "2px solid black",
            borderRadius: 5,
          }}
        />
        <button type="submit" style={{ marginLeft: 10, padding: "10px 20px" }}>
          Escanear
        </button>
      </form>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={manejarArchivo}
        style={{ marginBottom: 20 }}
      />

      {error && <div style={{ color: "red", marginBottom: 20 }}>{error}</div>}

      {/* Título Inventario Actual */}
      <h2 style={{ fontSize: 28, marginBottom: 20 }}>
        📋 Inventario Actual: <span style={{ color: "#007BFF" }}>{obtenerTituloInventario()}</span>
      </h2>

      {/* Tabla inventario */}
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%", marginBottom: 30 }}
      >
        <thead>
          <tr>
            <th>SKU</th>
            <th>Código de Barras</th>
            <th>Descripción</th>
            <th>Existencia</th>
            <th>Costo</th>
            <th>Ubicación</th>
          </tr>
        </thead>
        <tbody>
          {inventarioActual.map((item, index) => (
            <tr key={index}>
              <td>{item.SKU}</td>
              <td>{item["CODIGO DE BARRAS"]}</td>
              <td>{item.DESCRIPCION}</td>
              <td>{item.EXISTENCIA}</td>
              {/* 🔹 Agregado: Mostrar el signo de pesos si hay valor */}
              <td>
                {item.COSTO
                  ? `$${Number(item.COSTO).toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : "$0.00"}
              </td>
              <td>{item.UBICACIÓN}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Historial */}
      <h2>📜 Historial de Movimientos</h2>
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Código</th>
            <th>SKU</th>
            <th>Descripción</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((reg, idx) => (
            <tr key={idx}>
              <td>{reg.fecha}</td>
              <td>{reg.tipo}</td>
              <td>{reg.codigo}</td>
              <td>{reg.sku}</td>
              <td>{reg.descripcion}</td>
              <td>{reg.accion}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botón reiniciar */}
      <button
        onClick={reiniciarInventario}
        style={{
          marginTop: 30,
          padding: "10px 20px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
        }}
      >
        🔄 Reiniciar Inventario Actual
      </button>
    </div>
  );
}

export default ScannerInventario;
