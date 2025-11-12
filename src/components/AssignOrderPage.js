import React, { useState } from "react";
import AssignOrderSection from "./AssignOrderSection";

// Colores por estado
const statusColors = {
  "Por hacer": "#d3d3d3",
  "En proceso": "#f9d342",
  "Terminada": "#4caf50"
};

function AssignOrderPage() {
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null); // número de orden que se está editando
  const [editLine, setEditLine] = useState("");
  const [editNumber, setEditNumber] = useState("");

  // Asignar línea a una orden
  const handleAssign = (orderNum, lineId) => {
    setOrders((prevOrders) => {
      const existing = prevOrders.find((o) => o.number === orderNum);
      if (existing) {
        return prevOrders.map((o) =>
          o.number === orderNum ? { ...o, line: lineId } : o
        );
      } else {
        return [...prevOrders, { number: orderNum, line: lineId, status: "Por hacer" }];
      }
    });
  };

  // Cambiar estado de la orden
  const handleStatusChange = (orderNum, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.number === orderNum ? { ...o, status: newStatus } : o
      )
    );
  };

  // Eliminar orden
  const handleDelete = (orderNum) => {
    setOrders((prevOrders) => prevOrders.filter((o) => o.number !== orderNum));
  };

  // Iniciar edición
  const handleEdit = (order) => {
    setEditingOrder(order.number);
    setEditNumber(order.number);
    setEditLine(order.line || "");
  };

  // Guardar edición
  const handleSaveEdit = () => {
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.number === editingOrder
          ? { ...o, number: parseInt(editNumber, 10), line: editLine }
          : o
      )
    );
    setEditingOrder(null);
    setEditLine("");
    setEditNumber("");
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingOrder(null);
    setEditLine("");
    setEditNumber("");
  };

  // Generamos 11 líneas
  const productionLines = Array.from({ length: 11 }, (_, i) => i + 1);

  // Guardar cambios (simula backend)
  const handleSaveChanges = () => {
    console.log("Guardando cambios...", orders);
    alert("Cambios guardados correctamente!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Control de Asignación de Órdenes</h2>

      <AssignOrderSection onAssign={handleAssign} />

      <div style={{ marginTop: "20px" }}>
        <h4>Órdenes Asignadas:</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          {orders.map((o) => (
            <div
              key={o.number}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                width: "220px",
                backgroundColor: statusColors[o.status],
              }}
            >
              {editingOrder === o.number ? (
                <>
                  <input
                    type="number"
                    value={editNumber}
                    onChange={(e) => setEditNumber(e.target.value)}
                    style={{ width: "100px", marginBottom: "5px" }}
                  />
                  <select
                    value={editLine}
                    onChange={(e) => setEditLine(parseInt(e.target.value, 10))}
                    style={{ width: "100%", marginBottom: "5px" }}
                  >
                    <option value="">Selecciona línea</option>
                    {productionLines.map((line) => (
                      <option key={line} value={line}>
                        Línea {line}
                      </option>
                    ))}
                  </select>
                  <button onClick={handleSaveEdit} style={{ marginRight: "5px" }}>
                    Guardar
                  </button>
                  <button onClick={handleCancelEdit}>Cancelar</button>
                </>
              ) : (
                <>
                  <h5>Orden {o.number}</h5>
                  <p>Línea: {o.line ? `Línea ${o.line}` : "No asignada"}</p>
                  <p>
                    Estado:{" "}
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.number, e.target.value)}
                    >
                      <option value="Por hacer">Por hacer</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Terminada">Terminada</option>
                    </select>
                  </p>
                  <div style={{ marginTop: "10px" }}>
                    <button onClick={() => handleEdit(o)} style={{ marginRight: "5px" }}>
                      Modificar
                    </button>
                    <button onClick={() => handleDelete(o.number)}>Eliminar</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveChanges}
          style={{ marginTop: "20px", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}

export default AssignOrderPage;
