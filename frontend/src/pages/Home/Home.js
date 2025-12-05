import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import searchIcon from "../../assets/icons/search.png";
import MaterialImg from "../../assets/images/Material.jpg";
import StatCard from "../../components/StatCard";
import "./Home.css"; // ADD THIS IMPORT


function Home() {
  // --- state for counts ---
  const [activeCount, setActiveCount] = useState(0);
  const [lostCount, setLostCount] = useState(0);
  const [foundCount, setFoundCount] = useState(0);
  const [reunitedCount, setReunitedCount] = useState(0);
  const [items, setItems] = useState([]); // all items from database
  const [filter, setFilter] = useState("all"); // default shows all items
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all items from database
  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8080/api/items");
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching items:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    async function fetchStats() {
      try {
        // If you have a stats endpoint, use it
        const statsRes = await fetch("http://localhost:8080/api/items/stats");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData) {
            setActiveCount(statsData.active || 0);
            setLostCount(statsData.lost || 0);
            setFoundCount(statsData.found || 0);
            setReunitedCount(statsData.reunited || 0);
            return;
          }
        }
        
        // Calculate stats from items if no stats endpoint
        fetchItems().then(() => {
          // Stats will be calculated in the items useEffect below
        });
      } catch (e) {
        console.warn("Stats fetch failed, will calculate from items");
      }
    }

    fetchStats();
  }, []);

  // Calculate stats from items whenever items change
  useEffect(() => {
    if (items.length > 0) {
      const lostItems = items.filter(item => item.status === "LOST").length;
      const foundItems = items.filter(item => item.status === "FOUND").length;
      const activeItems = lostItems + foundItems;
      // Assuming REUNITED status exists in your database
      const reunitedItems = items.filter(item => item.status === "REUNITED").length;

      setActiveCount(activeItems);
      setLostCount(lostItems);
      setFoundCount(foundItems);
      setReunitedCount(reunitedItems);
    }
  }, [items]);

  // Filter items based on selected filter and search query
  const filteredItems = items.filter(item => {
    // Apply status filter
    if (filter === "lost" && item.status !== "LOST") return false;
    if (filter === "found" && item.status !== "FOUND") return false;
    if (filter === "reunited" && item.status !== "REUNITED") return false;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (item.itemTitle && item.itemTitle.toLowerCase().includes(query)) ||
        (item.itemDesc && item.itemDesc.toLowerCase().includes(query)) ||
        (item.location && item.location.toLowerCase().includes(query)) ||
        (item.categoryName && item.categoryName.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is already applied in filteredItems
  };

  // Get status color and display text
  const getStatusInfo = (status) => {
    switch(status) {
      case "LOST": return { color: "#c62828", text: "Lost" };
      case "FOUND": return { color: "#388e3c", text: "Found" };
      case "REUNITED": return { color: "#002aff", text: "Reunited" };
      default: return { color: "#666", text: status };
    }
  };

  return (
    <div className="home-page-container">
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

      {/* Search Bar - Now with same width as report item page */}
      <div className="home-content-wrapper">
        <form className="search-container" onSubmit={handleSearchSubmit}>
          <div className="search-input-wrapper">
            <input 
              type="text" 
              placeholder="Search lost or found items by name, description, location, or category..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <img src={searchIcon} alt="Search Icon" className="search-icon" />
              <span className="search-text">Search</span>
            </button>
          </div>
        </form>

        {/* Filter Buttons */}
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
            className={`filter-btn ${filter === "reunited" ? "active-filter" : ""}`}
            onClick={() => setFilter("reunited")}
          >
            Reunited
          </button>
        </div>

        {/* Items Grid */}
        <div className="reports-container">
          {loading ? (
            <div className="loading-message">
              <p>Loading items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-message">
              <p>No items found. {searchQuery && "Try a different search term."}</p>
              {items.length === 0 && (
                <Link to="/report" className="report-first-link">
                  Be the first to report an item!
                </Link>
              )}
            </div>
          ) : (
            <div className="items-grid">
              {filteredItems.map((item) => {
                const statusInfo = getStatusInfo(item.status);
                const isActive = item.status === "LOST" || item.status === "FOUND";
                
                return (
                  <div key={item.itemId} className={`report-box ${item.status.toLowerCase()}`}>
                    <span 
                      className="tag" 
                      style={{ backgroundColor: statusInfo.color }}
                    >
                      {statusInfo.text}
                    </span>
                    
                    {isActive && (
                      <span className="active">
                        Active
                      </span>
                    )}

                    {/* Image container */}
                    <div className="report-image-container">
                      {item.imageUrl ? (
                        <img
                          src={`http://localhost:8080/uploads/${item.imageUrl}`}
                          alt={item.itemTitle}
                          className="report-image"
                          onError={(e) => {
                            e.target.src = MaterialImg;
                          }}
                        />
                      ) : (
                        <img
                          src={MaterialImg}
                          alt={item.itemTitle}
                          className="report-image"
                        />
                      )}
                    </div>

                    {/* Details below image */}
                    <div className="report-details">
                      <h3 className="item-title">{item.itemTitle}</h3>
                      <p>
                        <strong>Date:</strong> {new Date(item.dateReport).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Place:</strong> {item.location || "Not specified"}
                      </p>
                      <p>
                        <strong>Category:</strong> {item.categoryName || "Uncategorized"}
                      </p>
                      <p className="item-description">
                        <strong>Description:</strong> {item.itemDesc || "No description"}
                      </p>
                      <p className="item-reporter">
                        <strong>Reported by:</strong> User #{item.userId}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;