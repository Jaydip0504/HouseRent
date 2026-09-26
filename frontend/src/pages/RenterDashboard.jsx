import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function RenterDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?._id || user?.id;

  const [activeTab, setActiveTab] = useState("properties");
  const [allProperties, setAllProperties] = useState([]);
  const [myBookings, setMyBookings] = useState([]);

  const [searchAddress, setSearchAddress] = useState("");
  const [adTypeFilter, setAdTypeFilter] = useState("All");
  const [propTypeFilter, setPropTypeFilter] = useState("All");

  const defaultImage =
    "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=60";

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-user-id": userId,
      },
      params: {
        renterId: userId,
      },
    };
  };

  useEffect(() => {
    fetchRenterData();
  }, []);

  const fetchRenterData = async () => {
    try {
      const config = getAuthConfig();

      const pRes = await api.get("/properties").catch(() => ({ data: [] }));
      setAllProperties(Array.isArray(pRes.data) ? pRes.data : []);

      const bRes = await api.get("/bookings/my-bookings", config).catch(() => ({ data: [] }));
      setMyBookings(Array.isArray(bRes.data) ? bRes.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const getSafeImage = (imgUrl) => {
    if (!imgUrl || typeof imgUrl !== "string") return defaultImage;
    if (imgUrl.startsWith("blob:")) return defaultImage;
    if (imgUrl.startsWith("data:image") || imgUrl.startsWith("http://") || imgUrl.startsWith("https://")) {
      return imgUrl;
    }
    return defaultImage;
  };

  return (
    <div style={{ backgroundColor: "#f1f5f9", minHeight: "calc(100vh - 70px)", padding: "32px 24px" }}>
      <div className="container" style={{ maxWidth: "1280px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ margin: 0, fontWeight: "700", color: "#0f172a" }}>Renter Dashboard</h4>
          <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
            Welcome back, <strong>{user?.name}</strong>
          </p>
        </div>

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
            onClick={() => setActiveTab("properties")}
            style={{
              backgroundColor: activeTab === "properties" ? "#2563eb" : "transparent",
              color: activeTab === "properties" ? "#ffffff" : "#64748b",
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
            onClick={() => {
              fetchRenterData();
              setActiveTab("history");
            }}
            style={{
              backgroundColor: activeTab === "history" ? "#2563eb" : "transparent",
              color: activeTab === "history" ? "#ffffff" : "#64748b",
              border: "none",
              padding: "8px 22px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            Booking History ({myBookings.length})
          </button>
        </div>

        {activeTab === "properties" && (
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
                        src={getSafeImage(p.imageUrl)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultImage;
                        }}
                        className="card-img-top"
                        style={{ height: "190px", objectFit: "cover" }}
                        alt={p.title || "Property"}
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

        {activeTab === "history" && (
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
                        <td style={{ padding: "14px 16px", color: "#475569" }}>{b.phone || user?.phone || "N/A"}</td>
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
    </div>
  );
}