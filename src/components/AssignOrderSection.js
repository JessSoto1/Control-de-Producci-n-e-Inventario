import React, { useState } from "react";

function AssignOrderSection({ onAssign }) {
  const [orderNumber, setOrderNumber] = useState("");
  const [selectedLine, setSelectedLine] = useState("");

  const productionLines = Array.from({ length: 11 }, (_, i) => ({
    id: i + 1,
    name: `Línea ${i + 1}`,
  }));

  const handleAssign = () => {
    const orderNum = parseInt(orderNumber, 10);
    if (!orderNum || !selectedLine) {
      alert("Ingresa un número de orden y selecciona una línea.");
      return;
    }
    onAssign(orderNum, parseInt(selectedLine, 10));
    setOrderNumber("");
    setSelectedLine("");
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Asignar Orden a Línea</h3>
      <div style={styles.inputGroup}>
        <input
          type="number"
          placeholder="Número de orden"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={styles.inputGroup}>
        <select
          value={selectedLine}
          onChange={(e) => setSelectedLine(e.target.value)}
          style={styles.select}
        >
          <option value="">Selecciona una línea</option>
          {productionLines.map((line) => (
            <option key={line.id} value={line.id}>
              {line.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleAssign} style={styles.assignButton}>
        Asignar
      </button>
    </div>
  );
}

const styles = {
  container: {
    border: "2px solid #3498db",
    borderRadius: "12px",
    padding: "25px",
    marginTop: "20px",
    backgroundColor: "white",
    boxShadow: "0 4px 6px rgba(52, 152, 219, 0.1)",
    maxWidth: "400px"
  },
  title: {
    color: "#2c3e50",
    marginBottom: "20px",
    fontSize: "22px",
    fontWeight: "600"
  },
  inputGroup: {
    marginBottom: "15px"
  },
  input: {
    padding: "12px 15px",
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    boxSizing: "border-box",
    backgroundColor: "#f8f9fa",
    transition: "border-color 0.2s ease"
  },
  select: {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    backgroundColor: "#f8f9fa",
    transition: "border-color 0.2s ease"
  },
  assignButton: {
    padding: "12px 24px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    width: "100%",
    transition: "background-color 0.2s ease"
  }
};

export default AssignOrderSection;