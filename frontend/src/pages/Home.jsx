import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  useEffect(() => {
    // Fetch all approved properties from your backend
    fetch("https://houserent-ayjz.onrender.com/api/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch((err) => console.error("Error fetching properties:", err));
  }, []);

  // Filter properties across ANY location or title typed by the user
  const filteredProperties = properties.filter((prop) => {
    const matchesSearch =
      prop.title.toLowerCase().includes(search.toLowerCase()) ||
      prop.location.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = type === "All" || prop.type === type;

    return matchesSearch && matchesType;
  });

  return (
    <div>
      {/* Hero Header */}
      <div className="hero-wrapper text-center">
        <div className="container">
          <h1 className="display-4 fw-bold mb-4">Find Your Ideal Rental Home</h1>

          {/* Search Box */}
          <div className="search-card text-dark max-w-4xl mx-auto">
            <div className="row g-3">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Search any city, state, or area..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <select
                  className="form-select form-select-lg"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="All">All Property Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Room">Single Room</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                </select>
              </div>
              <div className="col-md-3">
                <button className="btn btn-primary btn-lg w-100 fw-semibold">
                  Search Properties
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property List Section */}
      <div className="container py-4">
        <h3 className="fw-bold mb-4">All Available Properties</h3>
        {filteredProperties.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 border">
            <h5 className="text-muted mb-2">No matching properties found</h5>
            <p className="text-secondary small">Try searching for a different city or location.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredProperties.map((prop) => (
              <div key={prop._id} className="col-md-6 col-lg-4">
                <div className="property-card h-100">
                  <img
                    src={
                      prop.imageUrl ||
                      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
                    }
                    className="property-img"
                    alt={prop.title}
                  />
                  <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="price-badge">₹{prop.price}/mo</span>
                      <small className="text-muted">{prop.type}</small>
                    </div>
                    <h5 className="fw-bold mb-1">{prop.title}</h5>
                    <p className="text-muted small mb-3">📍 {prop.location}</p>
                    <Link
                      to={`/properties/${prop._id}`}
                      className="btn btn-outline-primary btn-sm w-100 fw-semibold"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}