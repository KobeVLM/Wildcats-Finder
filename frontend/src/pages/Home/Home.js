import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import searchIcon from "../../assets/icons/search.png";
import MaterialImg from "../../assets/images/Material.jpg";
import StatCard from "../../components/statscard/StatCard";
import { UserContext } from "../../context/UserContext";
import "./Home.css";
import "../ReportItem/ReportItem.css";

function Home() {
  // Get user and loading from context
  const { user, loading: userLoading } = useContext(UserContext);

  // --- existing state for counts ---
  const [activeCount, setActiveCount] = useState(0);
  const [lostCount, setLostCount] = useState(0);
  const [foundCount, setFoundCount] = useState(0);
  const [reunitedCount, setReunitedCount] = useState(0);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const getFirstName = () => {
    if (!user) return "";
    return user.fname || user.username || "";
  };

  // --- DEBUG: Test the API endpoint directly ---
  useEffect(() => {
    const testApiEndpoint = async () => {
      try {
        console.log("Testing API endpoint: http://localhost:8080/api/items");
        const response = await fetch("http://localhost:8080/api/items");
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        
        const text = await response.text();
        console.log("Raw response text:", text);
        
        if (text) {
          try {
            const data = JSON.parse(text);
            console.log("Parsed JSON data:", data);
          } catch (e) {
            console.error("Failed to parse JSON:", e);
          }
        } else {
          console.log("Empty response");
        }
      } catch (error) {
        console.error("API test error:", error);
      }
    };
    
    testApiEndpoint();
  }, []);

  // --- Fetch ALL items (not just user's items) ---
  useEffect(() => {
    async function fetchAllItems() {
      try {
        console.log("Fetching ALL items from API...");
        setLoading(true);
        
        const res = await fetch("http://localhost:8080/api/items");
        console.log("API Response status:", res.status);
        
        if (!res.ok) {
          console.error("API Error - Status:", res.status);
          const errorText = await res.text();
          console.error("API Error - Response:", errorText);
          throw new Error(`Failed to fetch items: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("API Success - Data received:", data);
        console.log("Data type:", typeof data);
        console.log("Is array?", Array.isArray(data));
        
        if (Array.isArray(data)) {
          console.log(`Found ${data.length} items`);
          setItems(data);
        } else {
          console.warn("Data is not an array, converting to array");
          setItems([data]);
        }
      } catch (err) {
        console.error("Error fetching items:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    async function fetchStats() {
      try {
        console.log("Fetching stats...");
        const statsRes = await fetch("http://localhost:8080/api/items/stats");
        
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          console.log("Stats data:", statsData);
          if (statsData) {
            setActiveCount(statsData.active || 0);
            setLostCount(statsData.lost || 0);
            setFoundCount(statsData.found || 0);
            setReunitedCount(statsData.reunited || 0);
            return;
          }
        } else {
          console.warn("Stats endpoint failed, will calculate from items");
        }
        
        // If stats endpoint fails, fetch items and calculate
        await fetchAllItems();
      } catch (e) {
        console.warn("Stats fetch error:", e);
        fetchAllItems();
      }
    }

    fetchStats();
  }, []);

  // Calculate stats from items
  useEffect(() => {
    if (items.length > 0) {
      console.log("Calculating stats from", items.length, "items");
      
      const lostItems = items.filter(item => item.status === "LOST").length;
      const foundItems = items.filter(item => item.status === "FOUND").length;
      const reunitedItems = items.filter(item => item.status === "REUNITED").length;
      const activeItems = lostItems + foundItems;

      console.log("Lost:", lostItems, "Found:", foundItems, "Reunited:", reunitedItems, "Active:", activeItems);

      setActiveCount(activeItems);
      setLostCount(lostItems);
      setFoundCount(foundItems);
      setReunitedCount(reunitedItems);
    } else {
      console.log("No items to calculate stats from");
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
  };

  // Get status info
  const getStatusInfo = (status) => {
    switch(status) {
      case "LOST": return { className: "lost", text: "Lost" };
      case "FOUND": return { className: "found", text: "Found" };
      case "REUNITED": return { className: "reunited", text: "Reunited" };
      default: return { className: "unknown", text: status };
    }
  };

  // Handle "Mine" button click
  const handleMineButtonClick = (item) => {
    console.log("Item claimed as mine:", item);
    alert(`You've claimed "${item.itemTitle}".\nContact the owner at user@email.com`);
  };

  return (
    <div className="home-page-container">
      {/* Home Container */}
      <div className="home-container">
        <h1>
          {userLoading ? (
            "Looking for something?"
          ) : user ? (
            <>
              Welcome back <span className="user-greeting">{getFirstName()}</span>! Have you lost something again?
            </>
          ) : (
            "Looking for something?"
          )}
        </h1>
        
        {/* Stats */}
        <div className="square-container">
          <StatCard count={activeCount} label="Active" />
          <StatCard count={lostCount} label="Lost" />
          <StatCard count={foundCount} label="Found" />
          <StatCard count={reunitedCount} label="Reunited" />
          {user && (<><StatCard count={items.filter(item => item.userId === user.userId).length} label="My Reports" /></>)}
        </div>
      </div>

      {/* Search Bar */}
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
                <>
                  <p style={{color: 'red', fontWeight: 'bold'}}>
                    No items in database. Items count: {items.length}
                  </p>
                  <Link to="/report" className="report-first-link">
                    Be the first to report an item!
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="items-grid">
              {filteredItems.map((item) => {
                const statusInfo = getStatusInfo(item.status);
                const isCurrentUserItem = user && item.userId === user.userId;
                
                return (
                  <div key={item.itemId} className="reported-item-card">
                    <div className="card-header">
                      <h3>{item.itemTitle || "Untitled Item"}</h3>
                      <span className={`status-badge ${statusInfo.className}`}>
                        {statusInfo.text}
                      </span>
                    </div>

                    <div className="item-description">
                      <p>{item.itemDesc || "No description provided."}</p>
                    </div>

                    <div className="item-details">
                      <p>
                        <strong>Date:</strong>
                        <span>{new Date(item.dateReport).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </p>
                      <p>
                        <strong>Location:</strong>
                        <span>{item.location || "Not specified"}</span>
                      </p>
                      <p>
                        <strong>Category:</strong>
                        <span>{item.categoryName || "Uncategorized"}</span>
                      </p>
                      <p>
                        <strong>Reported by:</strong>
                        <span>
                          {isCurrentUserItem ? "You" : `User #${item.userId}`}
                        </span>
                      </p>
                    </div>

                    <div className="card-footer">
                      <div className="item-image-container">
                        {item.imageUrl ? (
                          <img
                            src={`http://localhost:8080/uploads/${item.imageUrl}`}
                            alt={item.itemTitle}
                            className="item-image"
                            onError={(e) => {
                              e.target.src = MaterialImg;
                            }}
                          />
                        ) : (
                          <img
                            src={MaterialImg}
                            alt={item.itemTitle}
                            className="item-image"
                          />
                        )}
                      </div>
                      
                      {!isCurrentUserItem && (
                        <button 
                          className="mine-button"
                          onClick={() => handleMineButtonClick(item)}
                        >
                          <span className="button-icon">💎</span>
                          This is Mine!
                        </button>
                      )}
                      
                      {isCurrentUserItem && (
                        <div className="my-item-badge">
                          <span className="badge-icon">👑</span>
                          My Item
                        </div>
                      )}
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