import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const PoliceDashboard = () => {
  // ---------- Crime State ----------
  const [crimes, setCrimes] = useState([]);
  const [loadingCrimes, setLoadingCrimes] = useState(true);
  const [wanted, setWanted] = useState([]);
  // ---------- Traffic State ----------
  const [traffic, setTraffic] = useState([]);
  const [loadingTraffic, setLoadingTraffic] = useState(true);
  const [news, setNews] = useState([]);
  const [vehicleNo, setVehicleNo] = useState("");
  const [owner, setOwner] = useState("");
  const [violation, setViolation] = useState("");
  const [fine, setFine] = useState("");
  const [sightings, setSightings] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/sightings").then((res) => {
      setSightings(res.data);
    });
  }, []);

  // ---------- Wanted Person Form State ----------
  const [wantedForm, setWantedForm] = useState({
    name: "",
    crime: "",
    last_seen: "",
    image: null,
  });

  // ---------- Traffic Entry Form State ----------
  const [trafficForm, setTrafficForm] = useState({
    vehicle_no: "",
    civilian_name: "",
    violation: "",
    fine: "",
    date: "",
  });

  // ---------- Fetch Data ----------
  useEffect(() => {
    // Crimes
    axios
      .get("http://localhost:5000/api/crime/all")
      .then((res) => {
        setCrimes(res.data);
        setLoadingCrimes(false);
      })
      .catch((err) => console.error("Error fetching crimes:", err));

    // Traffic Fines
    axios
      .get("http://localhost:5000/api/traffic/all")
      .then((res) => {
        setTraffic(res.data);
        setLoadingTraffic(false);
      })
      .catch((err) => console.error("Error fetching traffic:", err));

    axios
      .get("http://localhost:5000/api/wanted/all")
      .then((res) => setWanted(res.data))
      .catch((err) => console.error(err));
    // 	.finally(() => setLoading(false));

    //News
    axios
      .get("http://localhost:5000/api/news/all") // fetch news
      .then((res) => setNews(res.data))
      .catch((err) => console.error("Error fetching news:", err));
  }, []);

  // ---------- Crime Handlers ----------
  const handleResolve = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/crime/resolve/${id}`);
      alert("✅ Crime marked as resolved!");
      setCrimes(crimes.filter((c) => c._id !== id));
    } catch (err) {
      alert("❌ Failed to update crime.");
    }
  };
  const handleResolveWanted = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/wanted/resolve/${id}`);
      setWanted(wanted.filter((w) => w._id !== id));
    } catch (err) {
      alert("Failed to resolve wanted person");
    }
  };
  // 	if (loading) return <p>Loading dashboard...</p>;

  // ---------- Traffic Form Handlers ----------
  // 	const handleTrafficChange = (e) => {
  // 		setTrafficForm({ ...trafficForm, [e.target.name]: e.target.value });
  // 	};

  const handleTrafficSubmit = async (e) => {
    e.preventDefault();

    if (!vehicleNo || !violation || !fine) {
      alert("❌ All fields are required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/traffic/add", {
        vehicleNumber: vehicleNo,
        owner,
        offense: violation,
        fineAmount: Number(fine),
      });

      alert("✅ Traffic record added!");

      // Clear the form
      setVehicleNo("");
      setViolation("");
      setFine("");

      // Add new record to traffic table state
      setTraffic((prev) => [
        ...prev,
        {
          _id: res.data._id || new Date().getTime().toString(),
          vehicleNumber: vehicleNo,
          offense: violation,
          fineAmount: Number(fine),
          date: new Date(),
        },
      ]);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add traffic record.");
    }
  };

  // ---------- Wanted Form Handlers ----------
  const handleWantedChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setWantedForm({ ...wantedForm, image: files[0] });
    } else {
      setWantedForm({ ...wantedForm, [name]: value });
    }
  };

  const handleWantedSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", wantedForm.name);
      formData.append("crime", wantedForm.crime);
      formData.append("last_seen", wantedForm.last_seen);
      if (wantedForm.image) formData.append("image", wantedForm.image);

      await axios.post("http://localhost:5000/api/wanted/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Wanted person added!");
      setWantedForm({ name: "", crime: "", last_seen: "", image: null });
    } catch (err) {
      alert("❌ Failed to add wanted person.");
      console.error(err);
    }
  };
  // ✅ Export and Clear Traffic Fine Data
  const handleExportAndClearTraffic = async () => {
    try {
      if (traffic.length === 0) {
        alert("No traffic records to export!");
        return;
      }

      // 1️⃣ Convert JSON data → Excel sheet
      const worksheet = XLSX.utils.json_to_sheet(traffic);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "TrafficFines");

      // 2️⃣ Save Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(blob, "Traffic_Fines_Report.xlsx");

      // 3️⃣ Delete all traffic data from backend
      await axios.delete("http://localhost:5000/api/traffic/clear");

      // 4️⃣ Clear table on frontend
      setTraffic([]);
      alert("✅ Excel downloaded & traffic records cleared!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to export or clear traffic records.");
    }
  };

  // ✅ Export Reported Crimes to Excel
  const handleExportCrimes = () => {
    if (crimes.length === 0) {
      alert("No reported crimes to export!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(crimes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ReportedCrimes");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, "Reported_Crimes.xlsx");

    alert("✅ Crime data exported to Excel!");
  };

  // ✅ Export Wanted Sightings to Excel
  const handleExportSightings = () => {
    if (sightings.length === 0) {
      alert("No sightings to export!");
      return;
    }

    // Optional: Format data for cleaner Excel
    const formattedSightings = sightings.map((s) => ({
      Civilian: s.civilian_name,
      Location: s.location,
      Note: s.note,
      Date: new Date(s.date).toLocaleString(),
      Criminal_Name: s.wanted_id ? s.wanted_id.name : "Unknown",
      Criminal_Image: s.wanted_id?.image
        ? `http://localhost:5000/${s.wanted_id.image}`
        : "N/A",
      Uploaded_Image: s.image
        ? `http://localhost:5000/uploads/${s.image}`
        : "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedSightings);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "WantedSightings");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, "Wanted_Sightings.xlsx");

    alert("✅ Wanted sightings exported to Excel!");
  };

  return (
    <div
      className="police-dashboard min-h-screen bg-gray-100 font-sans p-4"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="container mx-auto p-4 md:p-8 bg-white shadow-xl rounded-lg">
        <h1 className="text-4xl font-bold text-center text-red-700 mb-10 border-b-4 border-red-500 pb-3 animate__animated animate__fadeInDown">
          <span className="material-icons text-4xl mr-2 align-middle">
            local_police
          </span>
          Police Dashboard
        </h1>

        {/* --- Crime Management Section --- */}
        <section className="mb-10 p-6 bg-red-50 border-l-4 border-red-600 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-red-700 mb-6 flex items-center">
            <span className="material-icons mr-2 text-3xl">report_problem</span>
            Reported Crimes
          </h2>
          {loadingCrimes ? (
            <p className="text-gray-600 text-lg">Loading crimes...</p>
          ) : crimes.length === 0 ? (
            <p className="text-gray-600 text-lg animate__animated animate__fadeIn">
              No active crime reports.
            </p>
          ) : (
            <div className="overflow-x-auto shadow-lg rounded-lg animate__animated animate__fadeIn">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-red-700 text-white sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Reported By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {crimes.map((crime) => (
                    <tr
                      key={crime._id}
                      className="hover:bg-red-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {crime.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {crime.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {crime.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            crime.severity === "High"
                              ? "bg-red-100 text-red-800"
                              : crime.severity === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {crime.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {crime.reported_by}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleResolve(crime._id)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-full text-xs transition duration-150"
                        >
                          <span className="material-icons text-sm align-middle mr-1">
                            check_circle
                          </span>
                          Resolved
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            onClick={handleExportCrimes}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
          >
            <span className="material-icons mr-2 text-lg">download</span>
            Download Crimes Excel
          </button>
        </section>

        {/* --- Wanted Persons Table --- */}
        <section className="mb-10 p-6 bg-red-50 border-l-4 border-red-600 rounded-lg shadow-md">
          <h3 className="text-3xl font-semibold text-red-700 mb-6 flex items-center">
            <span className="material-icons mr-2 text-3xl">person_search</span>
            Wanted Persons
          </h3>
          {wanted.length === 0 ? (
            <p className="text-gray-600 text-lg">No wanted persons.</p>
          ) : (
            <div className="overflow-x-auto shadow-lg rounded-lg animate__animated animate__fadeIn">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-red-700 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Crime
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Last Seen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {wanted.map((w) => (
                    <tr
                      key={w._id}
                      className="hover:bg-red-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {w.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {w.crime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {w.last_seen}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {w.image ? (
                          <img
                            src={`http://localhost:5000/${w.image}`}
                            alt={w.name}
                            className="w-16 h-16 object-cover rounded-md shadow"
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleResolveWanted(w._id)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-full text-xs transition duration-150"
                        >
                          <span className="material-icons text-sm align-middle mr-1">
                            check_circle
                          </span>
                          Resolved
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* --- Wanted Sightings Table --- */}
        <section className="mb-10 p-6 bg-purple-50 border-l-4 border-purple-600 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-purple-700 mb-6 flex items-center">
            <span className="material-icons mr-2 text-3xl">visibility</span>
            Wanted Sightings
          </h2>
          {sightings.length === 0 ? (
            <p className="text-gray-600 text-lg">No sightings reported.</p>
          ) : (
            <div className="overflow-x-auto shadow-lg rounded-lg animate__animated animate__fadeIn">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-purple-700 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Civilian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Note
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Criminal Name
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sightings.map((sighting, index) => (
                    <tr
                      key={index}
                      className="hover:bg-purple-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {sighting.civilian_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sighting.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {sighting.note}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {sighting.image ? (
                          <img
                            src={`http://localhost:5000/uploads/${sighting.image}`}
                            alt="Sighting"
                            className="w-16 h-16 object-cover rounded-md shadow"
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(sighting.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sighting.wanted_id
                          ? sighting.wanted_id.name
                          : "Unknown"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button
            onClick={handleExportSightings}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150"
          >
            <span className="material-icons mr-2 text-lg">download</span>
            Download Sightings Excel
          </button>
        </section>

        {/* --- Traffic Management Section --- */}
        <section className="mb-10 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-blue-700 mb-6 flex items-center">
            <span className="material-icons mr-2 text-3xl">traffic</span>
            Traffic Fine Lookup
          </h2>
          {loadingTraffic ? (
            <p className="text-gray-600 text-lg">Loading traffic fines...</p>
          ) : traffic.length === 0 ? (
            <p className="text-gray-600 text-lg animate__animated animate__fadeIn">
              No traffic records.
            </p>
          ) : (
            <div className="overflow-x-auto shadow-lg rounded-lg animate__animated animate__fadeIn">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Vehicle No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Violation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Fine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {traffic.map((t) => (
                    <tr
                      key={t._id}
                      className="hover:bg-blue-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {t.vehicleNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {t.offense}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${t.fineAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(t.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button
            onClick={handleExportAndClearTraffic}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150"
          >
            <span className="material-icons mr-2 text-lg">
              delete_sweep
            </span>
            Download Excel & Clear Table
          </button>
        </section>

        {/* --- Traffic Entry Form --- */}
        <section className="mb-10 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-blue-700 mb-6 flex items-center">
            <span className="material-icons mr-2 text-3xl">add_circle</span>
            Add Traffic Record
          </h2>
          <form
            onSubmit={handleTrafficSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <input
              type="text"
              name="vehicleNo"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              placeholder="Vehicle Number"
              required
              className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {/* Owner input is commented out in your original logic, keeping it visually commented */}
            {/* <input
							type="text"
							name="owner"
							value={owner}
							onChange={(e) => setOwner(e.target.value)}
							placeholder="Civilian Name"
							required
							className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/> */}

            <input
              type="text"
              name="violation"
              value={violation}
              onChange={(e) => setViolation(e.target.value)}
              placeholder="Violation"
              required
              className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="number"
              name="fine"
              value={fine}
              onChange={(e) => setFine(e.target.value)}
              placeholder="Fine Amount ($)"
              required
              className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />

            <button
              type="submit"
              className="col-span-1 md:col-span-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
            >
              <span className="material-icons text-xl align-middle mr-1">
                note_add
              </span>
              Add Record
            </button>
          </form>
        </section>

        {/* --- Add Wanted Person Form --- */}
        <section className="mb-10 p-6 bg-red-50 border-l-4 border-red-600 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-red-700 mb-6 flex items-center">
            <span className="material-icons mr-2 text-3xl">person_add</span>
            Add Wanted Person
          </h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData();
              formData.append("name", e.target.name.value);
              formData.append("crime", e.target.crime.value);
              formData.append("last_seen", e.target.last_seen.value);
              if (e.target.image.files[0]) {
                formData.append("image", e.target.image.files[0]);
              }

              try {
                await axios.post(
                  "http://localhost:5000/api/wanted/add",
                  formData,
                  {
                    headers: { "Content-Type": "multipart/form-data" },
                  }
                );
                alert("✅ Wanted person added successfully!");
                e.target.reset();
              } catch (err) {
                console.error("AxiosError", err);
                alert("❌ Failed to add wanted person.");
              }
            }}
            encType="multipart/form-data"
            className="grid grid-cols-1 md:grid-cols-5 gap-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="p-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 col-span-2"
            />
            <input
              type="text"
              name="crime"
              placeholder="Crime"
              required
              className="p-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 col-span-1"
            />
            <input
              type="text"
              name="last_seen"
              placeholder="Last Seen Location"
              required
              className="p-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 col-span-1"
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              className="p-3 border border-gray-300 rounded-md col-span-2"
            />
            <button
              type="submit"
              className="col-span-3 md:col-span-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
            >
              <span className="material-icons text-xl align-middle mr-1">
                upload
              </span>
              Add Person
            </button>
          </form>
        </section>

        {/* --- News Management --- */}
        <section className="p-6 bg-yellow-50 border-l-4 border-yellow-600 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-yellow-700 mb-6 flex items-center">
            <span className="material-icons mr-2 text-3xl">article</span>
            Manage 
          </h2>

          {/* Add News Form */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const title = e.target.title.value;
              const content = e.target.content.value;
              const author = e.target.author.value;
              try {
                const res = await axios.post(
                  "http://localhost:5000/api/news/add",
                  { title, content, author }
                );
                setNews([res.data, ...news]); // add new news to state
                e.target.reset();
                alert("✅ News added successfully");
              } catch (err) {
                console.error(err);
                alert("❌ Failed to add news");
              }
            }}
            className="space-y-4 mb-6 p-4 border border-yellow-300 rounded-lg bg-white"
          >
            <input
              type="text"
              name="title"
              placeholder="Title"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            />
            <textarea
              name="content"
              placeholder="Content"
              required
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 resize-none"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-md shadow-md transition duration-150"
            >
              <span className="material-icons text-xl align-middle mr-1">
                send
              </span>
              Add News Post
            </button>
          </form>

          {/* Display News */}
          {news.length === 0 ? (
            <p className="text-gray-600 text-lg">No news available.</p>
          ) : (
            <ul className="space-y-4">
              {news.map((n) => (
                <li
                  key={n._id}
                  className="p-4 border border-yellow-300 rounded-lg bg-white shadow-sm hover:shadow-md transition duration-150"
                >
                  <strong className="text-xl text-gray-800">{n.title}</strong>
                  <span className="text-sm text-gray-500 block">
                    — {n.author}
                  </span>
                  <p className="mt-2 text-gray-700">{n.content}</p>
                  <div className="mt-3 space-x-2">
                    <button
                      onClick={async () => {
                        const newTitle = prompt("New title", n.title);
                        const newContent = prompt("New content", n.content);
                        if (!newTitle || !newContent) return;
                        try {
                          const res = await axios.put(
                            `http://localhost:5000/api/news/update/${n._id}`,
                            {
                              title: newTitle,
                              content: newContent,
                              author: n.author,
                            }
                          );
                          setNews(
                            news.map((item) =>
                              item._id === n._id ? res.data : item
                            )
                          );
                          alert("✅ News updated!");
                        } catch (err) {
                          console.error(err);
                          alert("❌ Failed to update news");
                        }
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded text-sm transition duration-150"
                    >
                      <span className="material-icons text-sm align-middle">
                        edit
                      </span>
                      Update
                    </button>
                    <button
                      onClick={async () => {
                        if (!window.confirm("Are you sure to delete this news?"))
                          return;
                        try {
                          await axios.delete(
                            `http://localhost:5000/api/news/delete/${n._id}`
                          );
                          setNews(news.filter((item) => item._id !== n._id));
                          alert("✅ News deleted!");
                        } catch (err) {
                          console.error(err);
                          alert("❌ Failed to delete news");
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm transition duration-150"
                    >
                      <span className="material-icons text-sm align-middle">
                        delete
                      </span>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default PoliceDashboard;