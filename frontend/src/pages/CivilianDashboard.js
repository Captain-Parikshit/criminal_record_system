import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

const CivilianDashboard = () => {
  const [crimes, setCrimes] = useState([]);
  const [news, setNews] = useState([]);
  const [wanted, setWanted] = useState([]);
  const navigate = useNavigate();

  const handleReportClick = () => navigate("/report");
  const handleSightingClick = () => navigate("/report-sighting");

  const fetchData = async () => {
    try {
      const [crimeRes, newsRes, wantedRes] = await Promise.all([
        axios.get("http://localhost:5000/api/crime/all"),
        axios.get("http://localhost:5000/api/news/all"),
        axios.get("http://localhost:5000/api/wanted/all"),
      ]);
      setCrimes(crimeRes.data);
      setNews(newsRes.data);
      setWanted(wantedRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const unresolvedCrimes = crimes.filter((c) => !c.resolved);

  const getLocationCoords = (location) => {
    if (!location) return [18.5204, 73.8567];
    if (location.toLowerCase().includes("pune")) return [18.5204, 73.8567];
    if (location.toLowerCase().includes("mumbai")) return [19.076, 72.8777];
    return [18.5204, 73.8567];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200 p-8 font-[Poppins] text-gray-800">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">
          👤 Civilian Dashboard
        </h1>
        <p className="text-gray-600">
          Stay informed. Report safely. Help keep your city secure.
        </p>
      </header>

      {/* Crime Map + Buttons Side by Side */}
      <section className="bg-white rounded-2xl p-6 shadow-lg mb-10">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-yellow-600">
          <span className="material-icons">map</span> Crime Map & Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Map (Left Half) */}
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <MapContainer
              center={[18.5204, 73.8567]}
              zoom={11}
              style={{ height: "350px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />
              {unresolvedCrimes.map((crime) => {
                const coords =
                  crime.lat && crime.lon
                    ? [crime.lat, crime.lon]
                    : getLocationCoords(crime.location);
                return (
                  <CircleMarker
                    key={crime._id}
                    center={coords}
                    radius={crime.severity * 3}
                    color={`rgba(255,0,0,${0.3 + crime.severity * 0.1})`}
                  >
                    <Popup>
                      <strong>{crime.type}</strong>
                      <br />
                      {crime.location}
                      <br />
                      {crime.description}
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>

          {/* Buttons (Right Half) */}
          <div className="flex flex-col justify-center items-center bg-blue-50 rounded-2xl p-6 text-center border border-gray-200 shadow-inner">
            <p className="text-lg text-gray-700 mb-6 font-semibold">
              Quick Actions
            </p>
            <button
              onClick={handleReportClick}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl shadow-md flex items-center gap-2 mb-4 transition-all duration-300 w-full justify-center"
            >
              <span className="material-icons">report</span> Report a Crime
            </button>
            <button
              onClick={handleSightingClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all duration-300 w-full justify-center"
            >
              <span className="material-icons">visibility</span> Report Wanted Sighting
            </button>
          </div>
        </div>
      </section>

      {/* Wanted Criminals */}
      <section className="bg-white rounded-2xl p-6 shadow-lg mb-10">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-red-600">
          <span className="material-icons">person_search</span> Wanted Criminals
        </h2>
        {wanted.length === 0 ? (
          <p className="text-gray-600">No wanted people reported.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {wanted.map((w) => (
              <div
                key={w._id}
                className="bg-gray-50 rounded-xl p-4 text-center hover:scale-105 transform transition-all duration-300 shadow-md border border-gray-200"
              >
                {w.image ? (
                  <div className="flex justify-center items-center mb-3 bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={`http://localhost:5000/${w.image}`}
                      alt={w.name}
                      className="max-h-60 w-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    <span className="material-icons text-5xl">person_off</span>
                  </div>
                )}
                <h3 className="font-semibold text-lg text-gray-800">{w.name}</h3>
                <p className="text-sm text-gray-600">{w.crime}</p>
                <small className="text-xs text-gray-500">
                  Last seen: {w.last_seen}
                </small>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* News Section */}
      <section className="bg-white rounded-2xl p-6 shadow-lg mb-10">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-green-600">
          <span className="material-icons">article</span> Latest News
        </h2>
        {news.length === 0 ? (
          <p className="text-gray-600">No news updates yet.</p>
        ) : (
          <div className="space-y-4">
            {news.map((n) => (
              <div
                key={n._id}
                className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-all duration-300 border border-gray-200 shadow-sm"
              >
                <strong className="block text-lg text-gray-800">{n.title}</strong>
                <span className="text-sm text-gray-500">{n.author}</span>
                <p className="text-gray-700 mt-2">{n.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm mt-8">
        © 2025 Civilian Crime Awareness System. All rights reserved.
      </footer>
    </div>
  );
};

export default CivilianDashboard;
