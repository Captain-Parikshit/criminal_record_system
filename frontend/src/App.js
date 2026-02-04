import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CivilianDashboard from "./pages/CivilianDashboard";
import PoliceDashboard from "./pages/PoliceDashboard";
import TrafficFines from "./pages/TrafficFines";
import PoliceTrafficEntry from "./pages/PoliceTrafficEntry";
import ReportCrime from "./components/ReportCrime";
import CivilianSightingForm from "./pages/CivilianSightingForm";
import LoginPage from "./LoginPage";

function App() {
  return (
    <Router>
      {/* <nav style={{ padding: "10px", background: "#222" }}>
        <Link to="/" style={{ color: "white", marginRight: "20px" }}>
          Civilian
        </Link>
        <Link to="/police" style={{ color: "white" }}>
          Police
        </Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/civilian" element={<CivilianDashboard />} />
        <Route path="/police" element={<PoliceDashboard />} />
        <Route path="/traffic-fines" element={<TrafficFines />} />
        <Route path="/police-traffic" element={<PoliceTrafficEntry />} />
        <Route path="/report" element={<ReportCrime />} />
        <Route path="/report-sighting" element={<CivilianSightingForm />} />

      </Routes>
    </Router>
  );
}

export default App;
