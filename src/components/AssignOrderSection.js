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
    <div
      style={{
        border: "3px solid black",   
        borderRadius: "12px",       
        padding: "20px",
        marginTop: "20px",
      }}
    >
      <h3>Asignar Orden a Línea</h3>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="number"
          placeholder="Número de orden"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          style={{ padding: "5px", width: "150px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <select
          value={selectedLine}
          onChange={(e) => setSelectedLine(e.target.value)}
          style={{ width: "100%" }}
        >
          <option value="">Selecciona una línea</option>
          {productionLines.map((line) => (
            <option key={line.id} value={line.id}>
              {line.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleAssign} style={{ padding: "5px 10px" }}>
        Asignar
      </button>
    </div>
  );
}

export default AssignOrderSection;
