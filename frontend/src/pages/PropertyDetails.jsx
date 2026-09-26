import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");

  const [moveInDate, setMoveInDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [renterPhone, setRenterPhone] = useState(user?.phone || "");
  const [message, setMessage] = useState("");

  const defaultImage =
    "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=60";

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/properties/${id}`);
      setProperty(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token || !user) {
      alert("Please login to send a booking request");
      navigate("/login");
      return;
    }

    if (!renterPhone.trim()) {
      alert("Please provide your contact number");
      return;
    }

    setBookingLoading(true);
    try {
      await api.post(
        "/bookings",
        {
          propertyId: id,
          renter: user._id || user.id,
          userName: user.name,
          moveInDate,
          phone: renterPhone,
          message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Booking request sent successfully to the owner!");
      navigate("/renter-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send booking request");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", color: "#64748b" }}>
        <h5>Loading property details...</h5>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h5 style={{ color: "#dc2626", marginBottom: "16px" }}>{error || "Property not found"}</h5>
        <Link to="/renter-dashboard" className="btn btn-primary btn-sm">
          Back to Properties
        </Link>
      </div>
    );
  }

  const rawImage = property.imageUrl || property.image || "";
  const displayImage =
    rawImage && !rawImage.startsWith("blob:") && (rawImage.startsWith("data:image") || rawImage.startsWith("http"))
      ? rawImage
      : defaultImage;

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "calc(100vh - 75px)", padding: "40px 20px" }}>
      <div className="container" style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
            padding: "32px",
          }}
        >
          <div className="row g-4 align-items-start">
            <div className="col-lg-6">
              <img
                src={displayImage}
                alt={property.title || "Property"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
                style={{
                  width: "100%",
                  height: "380px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              />
            </div>

            <div className="col-lg-6">
              <h3 style={{ color: "#0f172a", fontWeight: "700", marginBottom: "8px" }}>
                {property.title || `${property.propertyType} in ${property.location}`}
              </h3>

              <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "16px" }}>
                📍 {property.propertyAddress || property.location}
              </p>

              <h4 style={{ color: "#0f172a", fontWeight: "700", marginBottom: "16px" }}>
                ₹{(property.price || property.rentAmount || 0).toLocaleString()}
                <span style={{ fontSize: "14px", fontWeight: "500", color: "#64748b" }}> / month</span>
              </h4>

              <p style={{ color: "#475569", fontSize: "13px", lineHeight: "1.6", marginBottom: "16px" }}>
                {property.description || "No description provided."}
              </p>

              <div style={{ marginBottom: "24px", fontSize: "13px", color: "#64748b" }}>
                <strong>Property Type:</strong> {property.propertyType || "Residential"} •{" "}
                <strong>Ad Type:</strong> {property.propertyAdType || "Rent"}
              </div>

              <hr style={{ borderColor: "#e2e8f0", margin: "20px 0" }} />

              <h6 style={{ color: "#0f172a", fontWeight: "600", marginBottom: "14px" }}>
                Send booking request
              </h6>

              <form onSubmit={handleBooking}>
                <div style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px" }}>
                    Move-in Date
                  </label>
                  <input
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
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

                <div style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px" }}>
                    Your Contact Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={renterPhone}
                    onChange={(e) => setRenterPhone(e.target.value)}
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

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px" }}>
                    Message to owner
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Message to owner..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
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

                <button
                  type="submit"
                  disabled={bookingLoading}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
                  }}
                >
                  {bookingLoading ? "Sending request..." : "Request Rental"}
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <Link
                  to="/renter-dashboard"
                  style={{ color: "#2563eb", textDecoration: "none", fontSize: "13px", fontWeight: "500" }}
                >
                  Back to properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}