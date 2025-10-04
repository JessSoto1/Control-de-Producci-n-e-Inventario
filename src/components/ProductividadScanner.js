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

function ProductividadScanner() {
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

    const codigoDuplicado = historial.some(
      (registro) => registro.codigo === codigo.trim()
    );
    if (codigoDuplicado) {
      setError("Este código ya fue escaneado.");
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
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>📦 Escáner de Tarimas</h1>

      <form onSubmit={manejarEscaneo} style={{ marginBottom: 20 }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Escanea o escribe el código aquí..."
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          style={{
            padding: 10,
            fontSize: 16,
            width: 300,
            textAlign: "center",
            border: "3px solid black",
            borderRadius: 5,
          }}
          autoComplete="off"
          autoFocus
        />
        <button
          type="submit"
          style={{
            marginLeft: 10,
            padding: "10px 20px",
            fontSize: 16,
            cursor: "pointer",
            border: "3px solid black",
            borderRadius: 5,
          }}
        >
          Escanear
        </button>
      </form>

      {error && (
        <div
          style={{
            marginBottom: 20,
            color: "white",
            backgroundColor: "#e74c3c",
            padding: 10,
            borderRadius: 5,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <div style={{ marginBottom: 30 }}>
        <button
          onClick={reiniciarConteo}
          style={{
            marginRight: 10,
            padding: "10px 20px",
            fontSize: 16,
            cursor: "pointer",
            border: "3px solid black",
            borderRadius: 5,
            backgroundColor: "#3498db",
            color: "white",
          }}
        >
          Reiniciar Conteo
        </button>
        <button
          onClick={reiniciarHistorial}
          style={{
            marginRight: 10,
            padding: "10px 20px",
            fontSize: 16,
            cursor: "pointer",
            border: "3px solid black",
            borderRadius: 5,
            backgroundColor: "#e67e22",
            color: "white",
          }}
        >
          Reiniciar Historial
        </button>

        <button
          onClick={toggleModal}
          style={{
            padding: "10px 20px",
            fontSize: 16,
            cursor: "pointer",
            border: "3px solid black",
            borderRadius: 5,
            backgroundColor: "#2ecc71",
            color: "white",
          }}
        >
          {modalVisible ? "Cerrar Datos Guardados" : "Mostrar Datos Guardados"}
        </button>
      </div>

      <h2>📊 Productividad por Línea</h2>
      <table
        border="1"
        cellPadding="10"
        style={{
          borderCollapse: "collapse",
          marginBottom: 30,
          textAlign: "center",
          border: "3px solid black",
          borderRadius: 5,
          width: "100%",
          maxWidth: 600,
          margin: "0 auto 30px",
        }}
      >
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
                <td
                  style={{
                    backgroundColor,
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {porcentaje.toFixed(0)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2>📜 Historial de Escaneos</h2>
      {historial.length === 0 ? (
        <p style={{ textAlign: "center", fontStyle: "italic" }}>
          No hay escaneos realizados.
        </p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            borderCollapse: "collapse",
            width: "100%",
            maxWidth: 900,
            border: "3px solid black",
            borderRadius: 5,
            margin: "0 auto",
          }}
        >
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
      )}

      {modalVisible && (
        <div
          style={{
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
          }}
          onClick={toggleModal}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 8,
              maxWidth: "90%",
              maxHeight: "80%",
              overflowY: "auto",
              boxShadow: "0 0 15px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Datos Guardados en localStorage</h3>
            <h4>Conteo</h4>
            <pre
              style={{
                backgroundColor: "#f0f0f0",
                padding: 10,
                borderRadius: 5,
              }}
            >
              {JSON.stringify(conteo, null, 2)}
            </pre>
            <h4>Historial</h4>
            <pre
              style={{
                backgroundColor: "#f0f0f0",
                padding: 10,
                borderRadius: 5,
                maxHeight: 300,
                overflowY: "auto",
              }}
            >
              {JSON.stringify(historial, null, 2)}
            </pre>
            <button
              onClick={toggleModal}
              style={{
                marginTop: 10,
                padding: "8px 15px",
                fontSize: 16,
                cursor: "pointer",
                border: "3px solid black",
                borderRadius: 5,
                backgroundColor: "#e74c3c",
                color: "white",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductividadScanner;
