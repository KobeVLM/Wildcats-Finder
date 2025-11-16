// src/pages/Home.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import searchIcon from "../../assets/icons/search.png";
import MaterialImg from "../../assets/images/Material.jpg";

import StatCard from "../../components/StatCard";

function Home() {
  // --- state for counts ---
  const [activeCount, setActiveCount] = useState(0);
  const [lostCount, setLostCount] = useState(0);
  const [foundCount, setFoundCount] = useState(0);
  const [reunitedCount, setReunitedCount] = useState(0);
  const [reports, setReports] = useState([]); // initially empty
  const [filter, setFilter] = useState("all"); // default shows all items

  // Optional: load initial counts from an API when component mounts
  useEffect(() => {
    // Example: fetch("/api/items/stats") -> { active, lost, found, reunited }
    // If you don't have an API yet, this block is safe to keep or remove.
    async function loadStats() {
      try {
        const res = await fetch("/api/items/stats");
        if (!res.ok) return; // fall back to defaults if no backend
        const data = await res.json();
        if (data) {
          setActiveCount(data.active ?? activeCount);
          setLostCount(data.lost ?? lostCount);
          setFoundCount(data.found ?? foundCount);
          setReunitedCount(data.reunited ?? reunitedCount);
        }
      } catch (e) {
        // no-op: keep local default values if fetch fails
        // console.warn("stats fetch failed:", e);
      }
    }
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // --- handler to update counts when a new post is created ---
  const handleNewPost = (type) => {
    setActiveCount((p) => p + 1);

    if (type === "lost") setLostCount((p) => p + 1);
    else if (type === "found") setFoundCount((p) => p + 1);
    else if (type === "reunited") setReunitedCount((p) => p + 1);

    // Add new report object to the array
    setReports((prev) => [...prev, { type }]);
  };

  return (
    <>
      {/* Home Container */}
      <div className="home-container">
        <h1>Looking for something?</h1>
        <p>
          Welcome to Wildcats Finder, a platform for reuniting students with
          their belongings.
        </p>

        {/* Stats */}
        <div className="square-container">
          <StatCard count={activeCount} label="Active" />
          <StatCard count={lostCount} label="Lost" />
          <StatCard count={foundCount} label="Found" />
          <StatCard count={reunitedCount} label="Reunited" />
        </div>
      </div>

      {/* Search Bar (outside home container) */}
      <div className="search-container">
        <input type="text" placeholder="Search lost or found items..." />
        <Link to="/search">
          <img src={searchIcon} alt="Search Icon" className="search-icon" />
        </Link>
      </div>

      {/* Filter Buttons (left-aligned in your CSS) */}
      <div className="filter-container">
        <button
          className={`filter-btn ${filter === "all" ? "active-filter" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Items
        </button>

        <button
          className={`filter-btn ${filter === "lost" ? "active-filter" : ""}`}
          onClick={() => setFilter("lost")}
        >
          Lost
        </button>

        <button
          className={`filter-btn ${filter === "found" ? "active-filter" : ""}`}
          onClick={() => setFilter("found")}
        >
          Found
        </button>

        <button
          className={`filter-btn ${
            filter === "reunited" ? "active-filter" : ""
          }`}
          onClick={() => setFilter("reunited")}
        >
          Reunited
        </button>
      </div>
      <div className="reports-container">
        {reports
          .filter((report) => filter === "all" || report.type === filter)
          .map((report, index) => (
            <div key={index} className={`report-box ${report.type}`}>
              <span className="tag">
                {report.type === "lost"
                  ? "Lost"
                  : report.type === "found"
                  ? "Found"
                  : "Reunited"}
              </span>
              <span className="active">Active</span>

              {/* Image container */}
              <div className="report-image-container">
                <img
                  src={report.image || MaterialImg}
                  alt={report.name}
                  className="report-image"
                />
              </div>

              {/* Details below image */}
              <div className="report-details">
                <p>
                  <strong>Name:</strong> {report.name}
                </p>
                <p>
                  <strong>Date:</strong> {report.date}
                </p>
                <p>
                  <strong>Place:</strong> {report.place}
                </p>
                <p>
                  <strong>Category:</strong> {report.category}
                </p>
                <p>
                  <strong>Description:</strong> {report.description}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* ---------- TEMP: test buttons to simulate new posts ---------- */}
      <div style={{ margin: "30px 60px" }}>
        <button onClick={() => handleNewPost("lost")}>Simulate + Lost</button>
        <button
          onClick={() => handleNewPost("found")}
          style={{ marginLeft: 10 }}
        >
          Simulate + Found
        </button>
        <button
          onClick={() => handleNewPost("reunited")}
          style={{ marginLeft: 10 }}
        >
          Simulate + Reunited
        </button>
      </div>
    </>
  );
}

export default Home;
