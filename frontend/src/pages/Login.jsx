import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", formData);
      const user = res.data.user || res.data;
      const token = res.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const role = (user?.userType || user?.type || user?.role || "").toLowerCase();

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "owner" || role === "landlord") {
        navigate("/owner-dashboard");
      } else {
        navigate("/renter-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
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
          maxWidth: "400px",
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
          🔒
        </div>

        <h3 style={{ color: "#0f172a", fontWeight: "700", fontSize: "22px", marginBottom: "24px" }}>
          Sign In
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

          <div style={{ marginBottom: "22px" }}>
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: "20px", fontSize: "13px" }}>
          <span style={{ color: "#64748b" }}>Don't have an account? </span>
          <Link to="/register" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}