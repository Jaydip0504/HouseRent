import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const uRes = await api.get("/admin/users", config).catch(() => ({ data: [] }));
      setUsers(Array.isArray(uRes.data) ? uRes.data : []);

      const pRes = await api.get("/properties/all", config).catch(() => ({ data: [] }));
      setProperties(Array.isArray(pRes.data) ? pRes.data : []);

      const bRes = await api.get("/admin/bookings", config).catch(() => ({ data: [] }));
      setBookings(Array.isArray(bRes.data) ? bRes.data : []);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  const toggleOwnerGrant = async (userId, currentGrant) => {
    setLoading(true);
    try {
      await api.put(`/admin/users/${userId}/grant-owner`, { isOwnerApproved: !currentGrant }, config);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update grant status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#f1f5f9", minHeight: "calc(100vh - 70px)", padding: "32px 24px" }}>
      <div className="container" style={{ maxWidth: "1280px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h4 style={{ margin: 0, fontWeight: "700", color: "#0f172a" }}>Admin Dashboard</h4>
            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
              Welcome back, {user?.name || "Admin"}
            </p>
          </div>
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
            marginBottom: "20px"
          }}
        >
          <button
            onClick={() => setActiveTab("users")}
            style={{
              backgroundColor: activeTab === "users" ? "#2563eb" : "transparent",
              color: activeTab === "users" ? "#ffffff" : "#64748b",
              border: "none",
              padding: "8px 20px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            All Users
          </button>
          <button
            onClick={() => setActiveTab("properties")}
            style={{
              backgroundColor: activeTab === "properties" ? "#2563eb" : "transparent",
              color: activeTab === "properties" ? "#ffffff" : "#64748b",
              border: "none",
              padding: "8px 20px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            All Properties
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            style={{
              backgroundColor: activeTab === "bookings" ? "#2563eb" : "transparent",
              color: activeTab === "bookings" ? "#ffffff" : "#64748b",
              border: "none",
              padding: "8px 20px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            All Bookings
          </button>
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            overflow: "hidden"
          }}
        >
          <div className="table-responsive" style={{ margin: 0 }}>
            {activeTab === "users" && (
              <table className="w-100" style={{ borderCollapse: "collapse", fontSize: "13px", margin: 0 }}>
                <thead>
                  <tr style={{ backgroundColor: "#2563eb", color: "#ffffff" }}>
                    <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>User ID</th>
                    <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Name</th>
                    <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Email</th>
                    <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Type</th>
                    <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Granted (Owners Only)</th>
                    <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>No registered users found</td>
                    </tr>
                  ) : (
                    users.map((u, idx) => (
                      <tr
                        key={u._id}
                        style={{
                          borderBottom: "1px solid #e2e8f0",
                          backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc"
                        }}
                      >
                        <td style={{ padding: "14px 16px", color: "#64748b", fontFamily: "Consolas, monospace", fontSize: "12px" }}>
                          {u._id}
                        </td>
                        <td style={{ padding: "14px 16px", fontWeight: "600", color: "#0f172a" }}>{u.name}</td>
                        <td style={{ padding: "14px 16px", color: "#475569" }}>{u.email}</td>
                        <td style={{ padding: "14px 16px", textTransform: "capitalize", color: "#0f172a" }}>
                          {u.type || u.role}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {u.type === "owner" || u.type === "Landlord" ? (
                            <span
                              style={{
                                color: u.isOwnerApproved ? "#16a34a" : "#ca8a04",
                                fontWeight: "700",
                                textTransform: "lowercase"
                              }}
                            >
                              {u.isOwnerApproved ? "granted" : "pending"}
                            </span>
                          ) : (
                            <span style={{ color: "#94a3b8" }}>-</span>
                          )}
                        </td>
                        <td style={{ padding: "14px 16px", textAlign: "center" }}>
                          {(u.type === "owner" || u.type === "Landlord") ? (
                            <button
                              onClick={() => toggleOwnerGrant(u._id, u.isOwnerApproved)}
                              disabled={loading}
                              style={{
                                backgroundColor: u.isOwnerApproved ? "#dc2626" : "#16a34a",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "5px",
                                padding: "5px 14px",
                                fontSize: "12px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "opacity 0.15s ease"
                              }}
                            >
                              {u.isOwnerApproved ? "Ungrant" : "Grant"}
                            </button>
                          ) : (
                            <span style={{ color: "#cbd5e1" }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {activeTab === "properties" && (
              <table className="w-100" style={{ borderCollapse: "collapse", fontSize: "13px", margin: 0 }}>
                <thead>
                  <tr style={{ backgroundColor: "#2563eb", color: "#ffffff" }}>
                    <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Property ID</th>
                    <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Owner ID</th>
                    <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Property Type</th>
                    <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Property Ad Type</th>
                    <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Property Address</th>
                    <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Owner Contact</th>
                    <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Property Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>No properties listed</td>
                    </tr>
                  ) : (
                    properties.map((p, idx) => (
                      <tr
                        key={p._id}
                        style={{
                          borderBottom: "1px solid #e2e8f0",
                          backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc"
                        }}
                      >
                        <td style={{ padding: "14px 16px", color: "#64748b", fontFamily: "Consolas, monospace", fontSize: "12px" }}>
                          {p._id}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#64748b", fontFamily: "Consolas, monospace", fontSize: "12px" }}>
                          {p.owner?._id || p.owner}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#0284c7", fontWeight: "600", textTransform: "lowercase" }}>
                          {p.propertyType || "residential"}
                        </td>
                        <td style={{ padding: "14px 16px", textTransform: "lowercase", color: "#475569" }}>
                          {p.propertyAdType || "rent"}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#334155", maxWidth: "260px", lineHeight: "1.4" }}>
                          {p.propertyAddress || p.location}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#475569", whiteSpace: "nowrap" }}>
                          {p.ownerContact || p.owner?.phone || "+91 98765 43210"}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#16a34a", fontWeight: "700" }}>
                          ₹{p.price || p.rentAmount}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {activeTab === "bookings" && (
              <table className="w-100" style={{ borderCollapse: "collapse", fontSize: "13px", margin: 0 }}>
                <thead>
                  <tr style={{ backgroundColor: "#2563eb", color: "#ffffff" }}>
                    <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Booking ID</th>
                    <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Owner ID</th>
                    <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Property ID</th>
                    <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Tenant ID</th>
                    <th style={{ padding: "14px 16px", fontWeight: "600", textAlign: "left" }}>Tenant Name</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>No bookings available</td>
                    </tr>
                  ) : (
                    bookings.map((b, idx) => (
                      <tr
                        key={b._id}
                        style={{
                          borderBottom: "1px solid #e2e8f0",
                          backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc"
                        }}
                      >
                        <td style={{ padding: "14px 16px", color: "#64748b", fontFamily: "Consolas, monospace", fontSize: "12px" }}>
                          {b._id}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#64748b", fontFamily: "Consolas, monospace", fontSize: "12px" }}>
                          {b.property?.owner || "N/A"}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#64748b", fontFamily: "Consolas, monospace", fontSize: "12px" }}>
                          {b.property?._id || b.property}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#64748b", fontFamily: "Consolas, monospace", fontSize: "12px" }}>
                          {b.renter?._id || b.renter}
                        </td>
                        <td style={{ padding: "14px 16px", fontWeight: "600", color: "#0f172a" }}>
                          {b.userName || b.renter?.name || "Pramod Patil"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}