import React, { useState } from "react";
import AssignOrderSection from "./AssignOrderSection";


const statusColors = {
  "Por hacer": "#d3d3d3",
  "En proceso": "#f9d342",
  "Terminada": "#4caf50"
};


function AssignOrderPage() {
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editLine, setEditLine] = useState("");
  const [editNumber, setEditNumber] = useState("");

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

  const handleStatusChange = (orderNum, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.number === orderNum ? { ...o, status: newStatus } : o
      )
    );
  };

  const handleDelete = (orderNum) => {
    setOrders((prevOrders) => prevOrders.filter((o) => o.number !== orderNum));
  };

  const handleEdit = (order) => {
    setEditingOrder(order.number);
    setEditNumber(order.number);
    setEditLine(order.line || "");
  };

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

  const handleCancelEdit = () => {
    setEditingOrder(null);
    setEditLine("");
    setEditNumber("");
  };

  const productionLines = Array.from({ length: 11 }, (_, i) => i + 1);

  const handleSaveChanges = () => {
    console.log("Guardando cambios...", orders);
    alert("Cambios guardados correctamente!");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Control de asignación de órdenes</h2>

      <AssignOrderSection onAssign={handleAssign} />

      <div style={styles.ordersSection}>
        <h4 style={styles.subtitle}>Órdenes Asignadas:</h4>
        <div style={styles.ordersGrid}>
          {orders.map((o) => (
            <div
              key={o.number}
              style={{
                ...styles.orderCard,
                backgroundColor: statusColors[o.status],
              }}
            >
              {editingOrder === o.number ? (
                <>
                  <input
                    type="number"
                    value={editNumber}
                    onChange={(e) => setEditNumber(e.target.value)}
                    style={styles.editInput}
                  />
                  <select
                    value={editLine}
                    onChange={(e) => setEditLine(parseInt(e.target.value, 10))}
                    style={styles.editSelect}
                  >
                    <option value="">Selecciona línea</option>
                    {productionLines.map((line) => (
                      <option key={line} value={line}>
                        Línea {line}
                      </option>
                    ))}
                  </select>
                  <div style={styles.editButtons}>
                    <button onClick={handleSaveEdit} style={styles.primaryButton}>
                      Guardar
                    </button>
                    <button onClick={handleCancelEdit} style={styles.secondaryButton}>
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h5 style={styles.orderTitle}>Orden {o.number}</h5>
                  <p style={styles.orderText}>Línea: {o.line ? `Línea ${o.line}` : "No asignada"}</p>
                  <p style={styles.orderText}>
                    Estado:{" "}
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.number, e.target.value)}
                      style={styles.statusSelect}
                    >
                      <option value="Por hacer">Por hacer</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Terminada">Terminada</option>
                    </select>
                  </p>
                  <div style={styles.actionButtons}>
                    <button onClick={() => handleEdit(o)} style={styles.primaryButton}>
                      Modificar
                    </button>
                    <button onClick={() => handleDelete(o.number)} style={styles.dangerButton}>
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveChanges}
          style={styles.saveButton}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  title: {
    color: "#2c3e50",
    marginBottom: "25px",
    fontSize: "28px",
    fontWeight: "600",
    borderBottom: "2px solid #3498db",
    paddingBottom: "10px"
  },
  ordersSection: {
    marginTop: "30px"
  },
  subtitle: {
    color: "#34495e",
    marginBottom: "20px",
    fontSize: "20px",
    fontWeight: "500"
  },
  ordersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "30px"
  },
  orderCard: {
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "20px",
    backgroundColor: "white",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease"
  },
  orderTitle: {
    color: "#2c3e50",
    margin: "0 0 10px 0",
    fontSize: "18px",
    fontWeight: "600"
  },
  orderText: {
    color: "#5d6d7e",
    margin: "8px 0",
    fontSize: "14px"
  },
  statusSelect: {
    padding: "5px 8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    backgroundColor: "white",
    fontSize: "14px"
  },
  actionButtons: {
    marginTop: "15px",
    display: "flex",
    gap: "8px"
  },
  editInput: {
    width: "100%",
    marginBottom: "10px",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px"
  },
  editSelect: {
    width: "100%",
    marginBottom: "15px",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px"
  },
  editButtons: {
    display: "flex",
    gap: "8px"
  },
  primaryButton: {
    padding: "8px 16px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s ease"
  },
  secondaryButton: {
    padding: "8px 16px",
    backgroundColor: "#95a5a6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s ease"
  },
  dangerButton: {
    padding: "8px 16px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s ease"
  },
  saveButton: {
    marginTop: "20px",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    transition: "background-color 0.2s ease"
  }
};

export default AssignOrderPage;