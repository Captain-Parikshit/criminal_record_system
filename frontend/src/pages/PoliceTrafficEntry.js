// frontend/src/pages/PoliceTrafficEntry.js
import React, { useState } from "react";
import axios from "axios";

export default function PoliceTrafficEntry() {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    violationType: "",
    fineAmount: "",
    issuedBy: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/traffic/add", formData);
      alert("Fine added successfully!");
      setFormData({ vehicleNumber: "", violationType: "", fineAmount: "", issuedBy: "" });
    } catch (err) {
      console.error(err);
      alert("Error adding fine!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>👮 Police Traffic Fine Entry</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="vehicleNumber"
          placeholder="Vehicle Number"
          value={formData.vehicleNumber}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="violationType"
          placeholder="Violation Type (e.g. Signal Jump)"
          value={formData.violationType}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="number"
          name="fineAmount"
          placeholder="Fine Amount"
          value={formData.fineAmount}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="issuedBy"
          placeholder="Issued By (Officer Name)"
          value={formData.issuedBy}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">Submit Fine</button>
      </form>
    </div>
  );
}
