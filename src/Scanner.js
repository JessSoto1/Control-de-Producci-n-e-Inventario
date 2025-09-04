import React, { useState } from "react";

// Conteo inicial para 11 líneas
const inicialConteo = {
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
  "Linea 11": 0
};

// Tarimas objetivo por turno
const TARIMAS_POR_TURNO = 30;

function Scanner() {
  const [codigo, setCodigo] = useState("");
  const [conteo, setConteo] = useState(inicialConteo);
  const [historial, setHistorial] = useState([]);

  const manejarEscaneo = (e) => {
    e.preventDefault();
    if (codigo.trim() === "") return;

    // Último dígito determina la línea
    const ultimoChar = codigo[codigo.length - 1];
    const ultimoDigito = parseInt(ultimoChar, 10);

    if (!isNaN(ultimoDigito) && ultimoDigito >= 1 && ultimoDigito <= 11) {
      const lineaAsignada = "Linea " + ultimoDigito;

      // Actualizar conteo
      setConteo((prevConteo) => ({
        ...prevConteo,
        [lineaAsignada]: prevConteo[lineaAsignada] + 1
      }));

      // Agregar al historial
      const nuevoRegistro = {
        codigo: codigo,
        linea: lineaAsignada,
        fecha: new Date().toLocaleString()
      };
      setHistorial((prevHistorial) => [nuevoRegistro, ...prevHistorial]);
    } else {
      alert("El código escaneado no corresponde a ninguna línea (1-11).");
    }

    setCodigo(""); // limpiar input
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", fontFamily: "Arial" }}>
      <h1>📦 Escáner de Tarimas</h1>

      {/* Campo de entrada para escaneo */}
      <form onSubmit={manejarEscaneo} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Escanea o escribe el código aquí..."
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          style={{ padding: "10px", fontSize: "16px", width: "300px", textAlign: "center", border:"3px solid black", borderRadius: "5px" }}
        />
        <button
          type="submit"
          style={{ marginLeft: "10px", padding: "10px 20px", fontSize: "16px", cursor: "pointer", border:"3px solid black", borderRadius: "5px" }}
        >
          Escanear
        </button>
      </form>

      {/* Tabla de productividad con 3 columnas */}
      <h2>📊 Productividad por Línea</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", marginBottom: "30px", textAlign: "center", border:"3px solid black", borderRadius: "5px" }}>
        <thead>
          <tr>
            <th>Línea</th>
            <th>Tarimas Escaneadas</th>
            <th>Productividad</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(conteo).map(([linea, cantidad]) => {
            const porcentaje = (cantidad / TARIMAS_POR_TURNO) * 100;
            const backgroundColor = porcentaje >= 85 ? "#7CFC00" : "#f7492aff";

            return (
              <tr key={linea}>
                <td>{linea}</td>
                <td>{cantidad}</td>
                <td style={{ backgroundColor: backgroundColor, color: "black", fontWeight: "bold", textAlign: "center" }}>
                  {porcentaje.toFixed(0)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Historial de escaneos */}
      <h2>📜 Historial de Escaneos</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "80%", border:"3px solid black", borderRadius: "5px" }}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Línea</th>
            <th>Fecha y Hora</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((registro, index) => (
            <tr key={index}>
              <td>{registro.codigo}</td>
              <td>{registro.linea}</td>
              <td>{registro.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Scanner;
