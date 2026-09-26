import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userType) {
      setError("Please select a User Type");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        type: formData.userType.toLowerCase() === "owner" ? "owner" : "user",
        userType: formData.userType,
        role: "user",
      };

      const res = await api.post("/auth/register", payload);
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user || res.data));
      }

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        minHeight: "calc(100vh - 75px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          width: "100%",
          maxWidth: "420px",
          borderRadius: "16px",
          padding: "36px 30px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            backgroundColor: "#eff6ff",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px auto",
            border: "1px solid #dbeafe",
            fontSize: "24px",
          }}
        >
          📝
        </div>

        <h3 style={{ color: "#0f172a", fontWeight: "700", fontSize: "22px", marginBottom: "24px" }}>
          Sign Up
        </h3>

        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              border: "1px solid #fee2e2",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "18px",
              textAlign: "left",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          <div style={{ marginBottom: "14px" }}>
            <input
              type="text"
              name="name"
              placeholder="Renter Full Name / Owner Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#f8fafc",
                color: "#1e293b",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#f8fafc",
                color: "#1e293b",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#f8fafc",
                color: "#1e293b",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "22px" }}>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#f8fafc",
                color: formData.userType ? "#1e293b" : "#94a3b8",
                fontSize: "13px",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="" disabled>
                Select User Type
              </option>
              <option value="Renter" style={{ color: "#1e293b" }}>
                Renter
              </option>
              <option value="Owner" style={{ color: "#1e293b" }}>
                Owner
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
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
            }}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div style={{ marginTop: "20px", fontSize: "13px" }}>
          <span style={{ color: "#ef4444", fontWeight: "500" }}>Have an account? </span>
          <Link to="/login" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}