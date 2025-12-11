import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "./Search.css";

function Search() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  
  // Categories from items
  const [categories, setCategories] = useState([]);

  // Fetch all active items on mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/items");
        const data = await response.json();
        // Only show LOST/FOUND items (active)
        const activeItems = data.filter(item => item.status === 'LOST' || item.status === 'FOUND');
        setItems(activeItems);
        setFilteredItems(activeItems);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(activeItems.map(item => item.categoryName).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setFilteredItems(items);
      return;
    }

    try {
      setSearching(true);
      const results = await itemService.searchItems(searchQuery);
      setFilteredItems(results);
    } catch (error) {
      console.error("Error searching:", error);
      // Fallback to client-side search
      const query = searchQuery.toLowerCase();
      const results = items.filter(item => 
        item.itemTitle?.toLowerCase().includes(query) ||
        item.itemDesc?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query)
      );
      setFilteredItems(results);
    } finally {
      setSearching(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let result = [...items];
    
    // Status filter
    if (statusFilter !== "ALL") {
      result = result.filter(item => item.status === statusFilter);
    }
    
    // Category filter
    if (categoryFilter !== "ALL") {
      result = result.filter(item => item.categoryName === categoryFilter);
    }
    
    // Date filter
    if (dateFilter !== "ALL") {
      const now = new Date();
      result = result.filter(item => {
        const itemDate = new Date(item.dateReport);
        switch (dateFilter) {
          case "TODAY":
            return itemDate.toDateString() === now.toDateString();
          case "WEEK":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return itemDate >= weekAgo;
          case "MONTH":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return itemDate >= monthAgo;
          default:
            return true;
        }
      });
    }
    
    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.dateReport) - new Date(a.dateReport);
        case "oldest":
          return new Date(a.dateReport) - new Date(b.dateReport);
        case "title":
          return (a.itemTitle || "").localeCompare(b.itemTitle || "");
        default:
          return 0;
      }
    });
    
    // If there's a search query, also filter by that
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.itemTitle?.toLowerCase().includes(query) ||
        item.itemDesc?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query)
      );
    }
    
    setFilteredItems(result);
  }, [items, statusFilter, categoryFilter, dateFilter, sortBy, searchQuery]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
    setDateFilter("ALL");
    setSortBy("newest");
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="search-page">
      {/* Header */}
      <div className="search-header">
        <h1>Search Lost & Found Items</h1>
        <p>Find items by keyword, filter by status, category, or date</p>
      </div>

      {/* Search Bar */}
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by title, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={searching}>
            {searching ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {/* Filters */}
      <div className="search-filters">
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="LOST">Lost Items</option>
            <option value="FOUND">Found Items</option>
            <option value="CLAIMED">Claimed</option>
            <option value="RETURNED">Returned</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Category:</label>
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Date Range:</label>
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Today</option>
            <option value="WEEK">This Week</option>
            <option value="MONTH">This Month</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>

        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {/* Results Count */}
      <div className="search-results-info">
        <span className="results-count">
          {loading ? "Loading..." : `${filteredItems.length} item(s) found`}
        </span>
      </div>

      {/* Results Grid */}
      <div className="search-results">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <h3>No items found</h3>
            <p>Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="empty-clear-btn">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="items-grid">
            {filteredItems.map((item) => (
              <div key={item.itemId} className="item-card">
                <div className="item-image-container">
                  {item.imageUrl ? (
                    <img 
                      src={`http://localhost:8080${item.imageUrl}`} 
                      alt={item.itemTitle}
                      className="item-image"
                    />
                  ) : (
                    <div className="item-image-placeholder">
                      <span>📷</span>
                    </div>
                  )}
                  <span className={`status-badge status-${item.status?.toLowerCase()}`}>
                    {item.status}
                  </span>
                </div>
                
                <div className="item-info">
                  <h3 className="item-title">{item.itemTitle}</h3>
                  <p className="item-desc">
                    {item.itemDesc?.length > 100 
                      ? item.itemDesc.substring(0, 100) + "..." 
                      : item.itemDesc || "No description"}
                  </p>
                  
                  <div className="item-meta">
                    <span className="meta-item">
                      <span className="meta-icon">📍</span>
                      {item.location || "Unknown location"}
                    </span>
                    <span className="meta-item">
                      <span className="meta-icon">📅</span>
                      {formatDate(item.dateReport)}
                    </span>
                    {item.categoryName && (
                      <span className="meta-item">
                        <span className="meta-icon">🏷️</span>
                        {item.categoryName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="item-actions">
                  <button className="view-btn" onClick={() => navigate(`/item/${item.itemId}`)}>View Details</button>
                  {item.status === "FOUND" && item.userId !== user?.userId && (
                    <button className="claim-btn" onClick={() => handleClaimItem(item)}>This is Mine!</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
