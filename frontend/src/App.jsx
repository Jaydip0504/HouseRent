import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import OwnerDashboard from "./pages/OwnerDashboard";
import RenterDashboard from "./pages/RenterDashboard";
import PropertyDetails from "./pages/PropertyDetails";

function RoleDashboardRedirect() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return <Navigate to="/login" />;

  const role = (user?.userType || user?.type || user?.role || "").toLowerCase();
  if (role === "admin") return <Navigate to="/admin" />;
  if (role === "owner" || role === "landlord") return <Navigate to="/owner-dashboard" />;
  return <Navigate to="/renter-dashboard" />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard" element={<RoleDashboardRedirect />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/renter-dashboard" element={<RenterDashboard />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}