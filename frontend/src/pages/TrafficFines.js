// frontend/src/pages/TrafficFines.js
import React, { useState } from "react";
import axios from "axios";

export default function TrafficFines() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [fines, setFines] = useState([]);

  const fetchFines = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/traffic/${vehicleNumber}`);
      setFines(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching fines!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🚦 Traffic Fine Lookup</h2>
      <input
        type="text"
        placeholder="Enter Vehicle Number (e.g. MH12AB1234)"
        value={vehicleNumber}
        onChange={(e) => setVehicleNumber(e.target.value)}
        style={{
          padding: "8px",
          width: "250px",
          marginRight: "10px",
        }}
      />
      <button onClick={fetchFines}>Search</button>

      <div style={{ marginTop: "20px" }}>
        {fines.length > 0 ? (
          fines.map((fine) => (
            <div key={fine._id} style={{ borderBottom: "1px solid #ccc", marginBottom: "10px" }}>
              <p><b>Violation:</b> {fine.violationType}</p>
              <p><b>Fine:</b> ₹{fine.fineAmount}</p>
              <p><b>Issued By:</b> {fine.issuedBy}</p>
              <p><b>Date:</b> {new Date(fine.date).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No fines found.</p>
        )}
      </div>
    </div>
  );
}
