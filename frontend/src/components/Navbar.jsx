import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const rawRole = (user?.userType || user?.type || user?.role || "").toLowerCase();
  const isAdmin = rawRole === "admin";
  const isOwner = rawRole === "owner" || rawRole === "landlord";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom px-4 py-3 shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand text-primary fw-bold fs-4 text-decoration-none" to="/">
          StayHub
        </Link>

        <div className="d-flex align-items-center gap-3">
          <Link className="text-secondary text-decoration-none small fw-semibold" to="/">
            Home
          </Link>

          {token && user ? (
            <>
              {isAdmin ? (
                <Link className="text-dark text-decoration-none small fw-semibold" to="/admin">
                  Admin Panel
                </Link>
              ) : isOwner ? (
                <Link className="text-dark text-decoration-none small fw-semibold" to="/owner-dashboard">
                  Owner Dashboard
                </Link>
              ) : (
                <Link className="text-dark text-decoration-none small fw-semibold" to="/renter-dashboard">
                  Renter Dashboard
                </Link>
              )}
              <span className="text-muted small">Hi, {user.name}</span>
              <button
                className="btn btn-danger btn-sm px-3 fw-semibold rounded-2"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline-primary btn-sm px-3 fw-semibold" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary btn-sm px-3 fw-semibold" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}