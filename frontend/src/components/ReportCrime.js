import React, { useState } from "react";
import axios from "axios";
import { AlertCircle, MapPin, Shield, FileText, User } from "lucide-react";

const ReportCrime = () => {
  const [formData, setFormData] = useState({
    location: "",
    type: "",
    severity: 1,
    description: "",
    reported_by: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const res = await axios.post("http://localhost:5000/api/crime/report", {
            ...formData,
            lat,
            lon,
          });
          setStatus("✅ Crime successfully reported.");
          setFormData({
            location: "",
            type: "",
            severity: 1,
            description: "",
            reported_by: "",
          });
        } catch (err) {
          setStatus("❌ Failed to report crime. Check the server connection.");
        }
      },
      () => setStatus("❌ Location access denied. Please enable GPS.")
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-red-500 mb-6 flex items-center justify-center gap-2">
          <AlertCircle className="w-8 h-8" />
          Report a Crime
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Please provide accurate information to help authorities take action swiftly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/20">
            <MapPin className="text-red-400" />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full bg-transparent outline-none text-white placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/20">
            <Shield className="text-yellow-400" />
            <input
              type="text"
              name="type"
              placeholder="Type of Crime (e.g. Theft, Assault)"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full bg-transparent outline-none text-white placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/20">
            <FileText className="text-blue-400" />
            <input
              type="number"
              name="severity"
              min="1"
              max="5"
              placeholder="Severity (1–5)"
              value={formData.severity}
              onChange={handleChange}
              required
              className="w-full bg-transparent outline-none text-white placeholder-gray-400"
            />
          </div>

          <div className="flex items-start gap-2 bg-white/5 p-3 rounded-lg border border-white/20">
            <FileText className="text-green-400 mt-1" />
            <textarea
              name="description"
              placeholder="Describe the incident clearly..."
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full bg-transparent outline-none text-white placeholder-gray-400 resize-none"
              rows="4"
            />
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/20">
            <User className="text-purple-400" />
            <input
              type="text"
              name="reported_by"
              placeholder="Your Name (optional)"
              value={formData.reported_by}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-white placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 transition-all duration-300 text-white py-3 rounded-lg font-semibold shadow-lg uppercase tracking-wider"
          >
            Submit Report
          </button>
        </form>

        {status && (
          <p
            className={`mt-5 text-center font-medium ${
              status.startsWith("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReportCrime;
