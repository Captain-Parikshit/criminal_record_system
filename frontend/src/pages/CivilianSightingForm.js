import React, { useState, useEffect } from "react";
import axios from "axios";

const CivilianSightingForm = () => {
  const [wantedList, setWantedList] = useState([]);
  const [formData, setFormData] = useState({
    wanted_id: "",
    civilian_name: "",
    location: "",
    note: "",
    image: null,
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/wanted/active")
      .then((res) => setWantedList(res.data))
      .catch((err) => console.error("Error fetching wanted list:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    try {
      await axios.post("http://localhost:5000/api/sightings", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("✅ Sighting report submitted successfully!");
      setFormData({
        wanted_id: "",
        civilian_name: "",
        location: "",
        note: "",
        image: null,
      });
    } catch (err) {
      console.error(err);
      setStatus("❌ Error submitting sighting report. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 flex flex-col items-center justify-center text-white font-[Poppins] px-6 py-10">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-lg animate__animated animate__fadeIn">
        <h2 className="text-3xl font-[Orbitron] text-center mb-6 tracking-wide text-blue-400 flex items-center justify-center gap-2">
          <span className="material-icons text-blue-300">visibility</span>
          Report Wanted Sighting
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-blue-200 uppercase tracking-wider">
              Wanted Person
            </label>
            <select
              name="wanted_id"
              value={formData.wanted_id}
              onChange={handleChange}
              required
              className="w-full bg-white/10 text-white rounded-lg p-3 border border-white/30 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Wanted Person</option>
              {wantedList.map((person) => (
                <option
                  key={person._id}
                  value={person._id}
                  className="bg-gray-900"
                >
                  {person.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-blue-200 uppercase tracking-wider">
              Your Name
            </label>
            <input
              type="text"
              name="civilian_name"
              value={formData.civilian_name}
              onChange={handleChange}
              required
              className="w-full bg-white/10 text-white rounded-lg p-3 border border-white/30 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-blue-200 uppercase tracking-wider">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full bg-white/10 text-white rounded-lg p-3 border border-white/30 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-blue-200 uppercase tracking-wider">
              Note
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              required
              className="w-full bg-white/10 text-white rounded-lg p-3 border border-white/30 h-28 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm mb-1 text-blue-200 uppercase tracking-wider">
              Upload Image (optional)
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full bg-white/10 text-white rounded-lg p-2 border border-white/30 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-800/50 hover:shadow-blue-500/70"
          >
            Submit Report
          </button>
        </form>

        {status && (
          <p
            className={`mt-5 text-center font-semibold ${
              status.includes("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default CivilianSightingForm;

