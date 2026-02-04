import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [role, setRole] = useState("civilian");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        role,
        id,
        password,
      });

      if (res.data.success) {
        if (res.data.role === "civilian") navigate("/civilian");
        else navigate("/police");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 animate__animated animate__fadeIn">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-md text-white border border-white/20 animate__animated animate__zoomIn">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          🔐 Login Portal
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm mb-2 font-medium">Login As:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="civilian" className="text-black">
                Civilian
              </option>
              <option value="police" className="text-black">
                Police
              </option>
            </select>
          </div>

          <div>
            <input
              type="text"
              placeholder={
                role === "civilian" ? "Enter Aadhaar No" : "Enter Police ID"
              }
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 py-3 rounded-lg font-semibold text-lg shadow-md"
          >
            Login
          </button>

          {error && (
            <p className="text-red-300 text-center font-medium animate__animated animate__shakeX">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
