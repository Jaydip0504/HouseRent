import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const storedRole = (user?.userType || user?.type || "").toLowerCase();
  const [currentRole, setCurrentRole] = useState(
    storedRole.includes("owner") || storedRole.includes("landlord") ? "owner" : "renter"
  );

  const isOwner = currentRole === "owner";

  const [ownerTab, setOwnerTab] = useState("add");
  const [renterTab, setRenterTab] = useState("properties");

  const [myProperties, setMyProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [propertyType, setPropertyType] = useState("Residential");
  const [propertyAdType, setPropertyAdType] = useState("Rent");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("No file chosen");

  const [searchAddress, setSearchAddress] = useState("");
  const [adTypeFilter, setAdTypeFilter] = useState("All");
  const [propTypeFilter, setPropTypeFilter] = useState("All");

  useEffect(() => {
    fetchData();
  }, [isOwner]);

  const fetchData = async () => {
    try {
      if (isOwner) {
        const pRes = await api.get("/properties/my-properties", config).catch(() => ({ data: [] }));
        setMyProperties(Array.isArray(pRes.data) ? pRes.data : []);

        const bRes = await api.get("/bookings/owner-bookings", config).catch(() => ({ data: [] }));
        setOwnerBookings(Array.isArray(bRes.data) ? bRes.data : []);
      } else {
        const pRes = await api.get("/properties").catch(() => ({ data: [] }));
        setAllProperties(Array.isArray(pRes.data) ? pRes.data : []);

        const bRes = await api.get("/bookings/my-bookings", config).catch(() => ({ data: [] }));
        setMyBookings(Array.isArray(bRes.data) ? bRes.data : []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const switchRole = (role) => {
    setCurrentRole(role);
    if (user) {
      user.userType = role === "owner" ? "Owner" : "Renter";
      user.type = role === "owner" ? "Owner" : "Renter";
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImageFileName(e.target.files[0].name);
    } else {
      setImageFileName("No file chosen");
    }
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: `${propertyType} in ${address.split(",")[0] || "City"}`,
        propertyType,
        propertyAdType,
        location: address,
        propertyAddress: address,
        ownerContact: contact,
        price: Number(amount) || 0,
        rentAmount: Number(amount) || 0,
        description: details,
        imageUrl: imageFile
          ? URL.createObjectURL(imageFile)
          : "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=60",
      };

      await api.post("/properties", payload, config);
      alert("Property submitted successfully!");

      setAddress("");
      setContact("");
      setAmount("");
      setDetails("");
      setImageFile(null);
      setImageFileName("No file chosen");

      fetchData();
      setOwnerTab("properties");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookingStatus = async (bookingId, currentStatus) => {
    const nextStatus = currentStatus === "approved" ? "pending" : "approved";
    try {
      await api.put(`/admin/bookings/${bookingId}/status`, { status: nextStatus }, config);
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div style={{ backgroundColor: "#f1f5f9", minHeight: "calc(100vh - 70px)", padding: "32px 24px" }}>
      <div className="container" style={{ maxWidth: "1280px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h4 style={{ margin: 0, fontWeight: "700", color: "#0f172a" }}>
              {isOwner ? "Owner Dashboard" : "Renter Dashboard"}
            </h4>
            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
              Logged in as: <strong>{user?.name}</strong> ({user?.email})
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Switch View:</span>
            <button
              onClick={() => switchRole("owner")}
              style={{
                backgroundColor: isOwner ? "#2563eb" : "#e2e8f0",
                color: isOwner ? "#fff" : "#475569",
                border: "none",
                borderRadius: "6px",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Owner View
            </button>
            <button
              onClick={() => switchRole("renter")}
              style={{
                backgroundColor: !isOwner ? "#2563eb" : "#e2e8f0",
                color: !isOwner ? "#fff" : "#475569",
                border: "none",
                borderRadius: "6px",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Renter View
            </button>
          </div>
        </div>

        {isOwner ? (
          <div>
            <div
              style={{
                display: "inline-flex",
                gap: "4px",
                backgroundColor: "#ffffff",
                padding: "4px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                marginBottom: "24px",
              }}
            >
              <button
                type="button"
                onClick={() => setOwnerTab("add")}
                style={{
                  backgroundColor: ownerTab === "add" ? "#2563eb" : "transparent",
                  color: ownerTab === "add" ? "#ffffff" : "#64748b",
                  border: "none",
                  padding: "8px 22px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                Add Property
              </button>
              <button
                type="button"
                onClick={() => setOwnerTab("properties")}
                style={{
                  backgroundColor: ownerTab === "properties" ? "#2563eb" : "transparent",
                  color: ownerTab === "properties" ? "#ffffff" : "#64748b",
                  border: "none",
                  padding: "8px 22px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                All Properties
              </button>
              <button
                type="button"
                onClick={() => setOwnerTab("bookings")}
                style={{
                  backgroundColor: ownerTab === "bookings" ? "#2563eb" : "transparent",
                  color: ownerTab === "bookings" ? "#ffffff" : "#64748b",
                  border: "none",
                  padding: "8px 22px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                All Bookings
              </button>
            </div>

            {ownerTab === "add" && (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                  padding: "36px 40px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                  maxWidth: "960px",
                  margin: "0 auto",
                }}
              >
                <h4
                  style={{
                    color: "#0f172a",
                    fontWeight: "700",
                    fontSize: "20px",
                    textAlign: "center",
                    marginBottom: "32px",
                  }}
                >
                  Add New Property
                </h4>

                <form onSubmit={handleAddProperty}>
                  <div className="row g-4 mb-4">
                    <div className="col-md-4">
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "8px" }}>
                        Property Type
                      </label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          backgroundColor: "#f8fafc",
                          color: "#1e293b",
                          fontSize: "13px",
                          outline: "none",
                          cursor: "pointer",
                        }}
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "8px" }}>
                        Property Ad Type
                      </label>
                      <select
                        value={propertyAdType}
                        onChange={(e) => setPropertyAdType(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          backgroundColor: "#f8fafc",
                          color: "#1e293b",
                          fontSize: "13px",
                          outline: "none",
                          cursor: "pointer",
                        }}
                      >
                        <option value="Rent">Rent</option>
                        <option value="Sale">Sale</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "8px" }}>
                        Property Full Address
                      </label>
                      <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          backgroundColor: "#f8fafc",
                          color: "#1e293b",
                          fontSize: "13px",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <div className="row g-4 mb-4">
                    <div className="col-md-4">
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "8px" }}>
                        Property Images
                      </label>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          border: "1px solid #cbd5e1",
                          borderRadius: "8px",
                          padding: "6px 8px",
                          backgroundColor: "#f8fafc",
                        }}
                      >
                        <label
                          htmlFor="file-upload"
                          style={{
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Choose Files
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                        <span style={{ fontSize: "12px", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {imageFileName}
                        </span>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "8px" }}>
                        Owner Contact No.
                      </label>
                      <input
                        type="text"
                        placeholder="Contact number"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          backgroundColor: "#f8fafc",
                          color: "#1e293b",
                          fontSize: "13px",
                          outline: "none",
                        }}
                      />
                    </div>

                    <div className="col-md-4">
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "8px" }}>
                        Property Amount
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          backgroundColor: "#f8fafc",
                          color: "#1e293b",
                          fontSize: "13px",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "28px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "8px" }}>
                      Additional Details for the Property
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Add any details here..."
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        backgroundColor: "#f8fafc",
                        color: "#1e293b",
                        fontSize: "13px",
                        outline: "none",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        backgroundColor: "#2563eb",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 24px",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
                        transition: "background-color 0.15s ease",
                      }}
                    >
                      {loading ? "Submitting..." : "Submit Form"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {ownerTab === "properties" && (
              <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", overflow: "hidden" }}>
                <div className="table-responsive" style={{ margin: 0 }}>
                  <table className="w-100" style={{ borderCollapse: "collapse", fontSize: "13px", margin: 0 }}>
                    <thead>
                      <tr style={{ backgroundColor: "#2563eb", color: "#ffffff" }}>
                        <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Property ID</th>
                        <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Property Type</th>
                        <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Ad Type</th>
                        <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Address</th>
                        <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Owner Contact</th>
                        <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Amount</th>
                        <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "center" }}>Availability</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myProperties.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>No properties added yet. Click "Add Property" to create one.</td>
                        </tr>
                      ) : (
                        myProperties.map((p, idx) => (
                          <tr key={p._id} style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                            <td style={{ padding: "14px 16px", color: "#64748b", fontFamily: "Consolas, monospace", fontSize: "12px" }}>{p._id}</td>
                            <td style={{ padding: "14px 16px", color: "#0284c7", fontWeight: "600" }}>{p.propertyType || "Residential"}</td>
                            <td style={{ padding: "14px 16px", textTransform: "capitalize", color: "#475569" }}>{p.propertyAdType || "Rent"}</td>
                            <td style={{ padding: "14px 16px", color: "#334155" }}>{p.propertyAddress || p.location}</td>
                            <td style={{ padding: "14px 16px", color: "#475569" }}>{p.ownerContact || contact || "N/A"}</td>
                            <td style={{ padding: "14px 16px", color: "#16a34a", fontWeight: "700" }}>₹{p.price || p.rentAmount}</td>
                            <td style={{ padding: "14px 16px", textAlign: "center" }}>
                              <span style={{ backgroundColor: p.status === "approved" ? "#dcfce7" : "#fef9c3", color: p.status === "approved" ? "#16a34a" : "#ca8a04", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                                {p.status === "approved" ? "Available" : "Pending"}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {ownerTab === "bookings" && (
              <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", overflow: "hidden" }}>
                <div className="table-responsive" style={{ margin: 0 }}>
                  <table className="w-100" style={{ borderCollapse: "collapse", fontSize: "13px", margin: 0 }}>
                    <thead>
                      <tr style={{ backgroundColor: "#2563eb", color: "#ffffff" }}>
                        <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Booking ID</th>
                        <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Property ID</th>
                        <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Tenant Name</th>
                        <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Tenant Phone</th>
                        <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Booking Status</th>
                        <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "center" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ownerBookings.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>No booking requests yet</td>
                        </tr>
                      ) : (
                        ownerBookings.map((b, idx) => (
                          <tr key={b._id} style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                            <td style={{ padding: "14px 16px", color: "#64748b", fontFamily: "Consolas, monospace", fontSize: "12px" }}>{b._id}</td>
                            <td style={{ padding: "14px 16px", color: "#64748b", fontFamily: "Consolas, monospace", fontSize: "12px" }}>{b.property?._id || b.property}</td>
                            <td style={{ padding: "14px 16px", fontWeight: "600", color: "#0f172a" }}>{b.userName || b.renter?.name || "Ram Agrawal"}</td>
                            <td style={{ padding: "14px 16px", color: "#475569" }}>{b.phone || b.renter?.phone || "9138473845"}</td>
                            <td style={{ padding: "14px 16px" }}>
                              <span style={{ color: b.status === "approved" ? "#16a34a" : "#ca8a04", fontWeight: "700", textTransform: "lowercase" }}>
                                {b.status === "approved" ? "booked" : "pending"}
                              </span>
                            </td>
                            <td style={{ padding: "14px 16px", textAlign: "center" }}>
                              <button
                                onClick={() => handleToggleBookingStatus(b._id, b.status)}
                                style={{
                                  backgroundColor: b.status === "approved" ? "#eab308" : "#16a34a",
                                  color: "#ffffff",
                                  border: "none",
                                  borderRadius: "5px",
                                  padding: "5px 14px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                }}
                              >
                                {b.status === "approved" ? "Mark Pending" : "Mark Booked"}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div
              style={{
                display: "inline-flex",
                gap: "4px",
                backgroundColor: "#ffffff",
                padding: "4px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                marginBottom: "24px",
              }}
            >
              <button
                type="button"
                onClick={() => setRenterTab("properties")}
                style={{
                  backgroundColor: renterTab === "properties" ? "#2563eb" : "transparent",
                  color: renterTab === "properties" ? "#ffffff" : "#64748b",
                  border: "none",
                  padding: "8px 22px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                All Properties
              </button>
              <button
                type="button"
                onClick={() => setRenterTab("history")}
                style={{
                  backgroundColor: renterTab === "history" ? "#2563eb" : "transparent",
                  color: renterTab === "history" ? "#ffffff" : "#64748b",
                  border: "none",
                  padding: "8px 22px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                Booking History
              </button>
            </div>

            {renterTab === "properties" && (
              <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", border: "1px solid #e2e8f0" }}>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by Address"
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <select className="form-select" value={adTypeFilter} onChange={(e) => setAdTypeFilter(e.target.value)}>
                      <option value="All">All Ad Types</option>
                      <option value="Rent">Rent</option>
                      <option value="Sale">Sale</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select className="form-select" value={propTypeFilter} onChange={(e) => setPropTypeFilter(e.target.value)}>
                      <option value="All">All Types</option>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                </div>

                <div className="row g-4">
                  {allProperties
                    .filter((p) => {
                      const matchAddr = (p.propertyAddress || p.location || "").toLowerCase().includes(searchAddress.toLowerCase());
                      const matchAd = adTypeFilter === "All" || p.propertyAdType === adTypeFilter;
                      const matchProp = propTypeFilter === "All" || p.propertyType === propTypeFilter;
                      return matchAddr && matchAd && matchProp;
                    })
                    .map((p) => (
                      <div key={p._id} className="col-md-4">
                        <div className="card h-100 border rounded-3 overflow-hidden shadow-sm">
                          <img
                            src={p.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60"}
                            className="card-img-top"
                            style={{ height: "180px", objectFit: "cover" }}
                            alt={p.title}
                          />
                          <div className="card-body d-flex flex-column">
                            <h6 className="fw-bold mb-1 text-dark">{p.propertyAddress || p.location}</h6>
                            <small className="text-muted mb-2">{p.propertyType || "Residential"} • {p.propertyAdType || "Rent"}</small>
                            <small className="text-muted">Owner: {p.ownerContact || "+91 98765 43210"}</small>
                            <h6 className="text-primary fw-bold my-2">₹{p.price || p.rentAmount}</h6>

                            <Link to={`/properties/${p._id}`} className="btn btn-outline-primary btn-sm w-100 mt-auto fw-semibold">
                              Get Info / Book
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {renterTab === "history" && (
              <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <div className="table-responsive" style={{ margin: 0 }}>
                  <table className="w-100" style={{ borderCollapse: "collapse", fontSize: "13px", margin: 0 }}>
                    <thead>
                      <tr style={{ backgroundColor: "#2563eb", color: "#ffffff" }}>
                        <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Booking ID</th>
                        <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Property ID</th>
                        <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Tenant Name</th>
                        <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Phone</th>
                        <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Booking Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myBookings.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>No bookings found</td>
                        </tr>
                      ) : (
                        myBookings.map((b, idx) => (
                          <tr key={b._id} style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                            <td style={{ padding: "14px 16px", color: "#64748b", fontFamily: "Consolas, monospace", fontSize: "12px" }}>{b._id}</td>
                            <td style={{ padding: "14px 16px", color: "#64748b", fontFamily: "Consolas, monospace", fontSize: "12px" }}>{b.property?._id || b.property}</td>
                            <td style={{ padding: "14px 16px", fontWeight: "600" }}>{b.userName || user?.name}</td>
                            <td style={{ padding: "14px 16px", color: "#475569" }}>{b.phone || user?.phone || "9145647324"}</td>
                            <td style={{ padding: "14px 16px" }}>
                              <span style={{ color: b.status === "approved" ? "#16a34a" : "#ca8a04", fontWeight: "700" }}>
                                {b.status || "pending"}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}