import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./ReportItem.css";
import { UserContext } from "../../context/UserContext";
import Message from "../../components/message/message";
import notifSound from '../../assets/music/notif.mp3';

function ReportItem() {
  const { user } = useContext(UserContext);
  const location = useLocation();

  // Determine active panel from URL
  const [activePanel, setActivePanel] = useState("report");
  
  // Add message state at the top
  const [message, setMessage] = useState({
    text: "",
    type: "info",
    title: ""
  });

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/report-item/list')) {
      setActivePanel("list");
    } else if (path.includes('/report-item/tips')) {
      setActivePanel("tips");
    } else {
      setActivePanel("report");
    }
  }, [location]);

  const [formData, setFormData] = useState({
    itemTitle: "",
    itemDesc: "",
    categoryId: "",
    departmentId: "",
    location: "",
    dateReport: new Date().toISOString().slice(0, 10),
    status: "FOUND",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [reportedItems, setReportedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    itemTitle: "",
    itemDesc: "",
    categoryId: "",
    departmentId: "",
    status: "",
    dateReport: "",
    image: null
  });
  
  // Add image preview state at the top level
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch categories & departments
useEffect(() => {
  async function fetchData() {
    try {
      console.log("Fetching categories...");
      const catRes = await fetch("http://localhost:8080/api/categories");
      const cats = await catRes.json();
      console.log("Categories fetched:", cats);
      setCategories(cats);

      console.log("Fetching departments...");
      const depRes = await fetch("http://localhost:8080/api/departments");
      const deps = await depRes.json();
      console.log("Departments fetched:", deps);
      setDepartments(deps);
    } catch (err) {
      console.error("Error fetching categories/departments:", err);
      setMessage({
        text: "Failed to load categories and departments",
        type: "error",
        title: "Load Error"
      });
    }
  }
  fetchData();
}, []);

  // Fetch reported items
  useEffect(() => {
    if (!user) {
      console.log("No user found, skipping fetch");
      return;
    }
    
    const fetchReportedItems = async () => {
      setLoading(true);
      try {
        console.log("Fetching items for user ID:", user.userId);
        const res = await fetch(`http://localhost:8080/api/items/user/${user.userId}`);
        
        const data = await res.json();
        console.log("Fetched items data:", data);
        
        // Use the same pattern as old working code
        setReportedItems(Array.isArray(data) ? data : []);
        
        console.log(`Found ${Array.isArray(data) ? data.length : 0} items for user`);
        
      } catch (err) {
        console.error("Error fetching reported items:", err);
        setReportedItems([]);
        setMessage({
          text: "Failed to load your reported items",
          type: "error",
          title: "Load Error"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportedItems();
  }, [user]);

  const refreshUserItems = async () => {
    if (!user) {
      console.log("Cannot refresh items: No user");
      return;
    }
    
    try {
      console.log("Refreshing items for user:", user.userId);
      const res = await fetch(`http://localhost:8080/api/items/user/${user.userId}`);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Refreshed items:", data);
        setReportedItems(Array.isArray(data) ? data : []);
      } else {
        console.error("Refresh failed with status:", res.status);
      }
    } catch (err) {
      console.error("Error refreshing items:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      
      // Create preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!user) {
    setMessage({
      text: "Please log in to report an item",
      type: "error",
      title: "Login Required"
    });
    return;
  }
  
  // DEBUG LOGS
  console.log("Form Data before validation:", formData);
  console.log("categoryId value:", formData.categoryId, "type:", typeof formData.categoryId);
  console.log("departmentId value:", formData.departmentId, "type:", typeof formData.departmentId);
  console.log("Categories array:", categories);
  console.log("Departments array:", departments);

  // First check if the IDs are actually selected
  if (!formData.categoryId || !formData.departmentId) {  // <-- FIXED THIS LINE
    console.log("SHOWING ERROR: categoryId =", formData.categoryId, "departmentId =", formData.departmentId);
    console.log("Full formData:", formData);
    setMessage({
      text: "Please select both a category and a campus",
      type: "error",
      title: "Missing Information"
    });
    return;
  }
  
  // Rest of the function remains the same...
  // Then try to find the selected items
  const selectedCategory = categories.find((c) => String(c.categoryId) === String(formData.categoryId));
  const selectedDepartment = departments.find((d) => String(d.depId) === String(formData.departmentId));

  console.log("Found category:", selectedCategory);
  console.log("Found department:", selectedDepartment);

  // Double-check that they were found
  if (!selectedCategory || !selectedDepartment) {
    console.log("Validation failed: Could not find selected items in arrays");
    setMessage({
      text: "Invalid category or campus selection. Please try again.",
      type: "error",
      title: "Selection Error"
    });
    return;
  }

  console.log("Validation passed, proceeding with submission...");
  
  // Rest of your code remains the same...
  const formDataToSend = new FormData();
  formDataToSend.append('itemTitle', formData.itemTitle);
  formDataToSend.append('itemDesc', formData.itemDesc);
  formDataToSend.append('location', selectedDepartment.depName);
  formDataToSend.append('status', formData.status.toUpperCase());
  formDataToSend.append('userId', user.userId);
  formDataToSend.append('categoryId', selectedCategory.categoryId);
  formDataToSend.append('departmentId', selectedDepartment.depId);
  formDataToSend.append('dateReport', formData.dateReport);
  
  if (formData.image) {
    formDataToSend.append('image', formData.image);
  }

    try {
      console.log("Submitting item with image:", formData.image ? formData.image.name : "No image");

      const response = await fetch("http://localhost:8080/api/items/report", {
        method: "POST",
        body: formDataToSend,
      });
      
      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response text:", responseText);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${responseText}`);
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", responseText);
        throw new Error("Invalid response from server");
      }

      console.log("Item created successfully:", result);
      
      // 1. Add to reported items immediately (like old code)
      setReportedItems(prev => [result, ...(Array.isArray(prev) ? prev : [])]);
      
      // 2. Also refresh from server to ensure consistency
      await refreshUserItems();
      
      // 3. Show success message using Message component
      setMessage({
        text: `"${formData.itemTitle}" has been reported as ${formData.status.toLowerCase()} at ${selectedDepartment.depName}.`,
        type: "maroon", // or "success" or "gold" depending on your Message component
        title: "Item Reported Successfully!"
      });
      setTimeout(() => playNotificationSound(), 100);
      
      // Reset form and preview
      setFormData({
        itemTitle: "", 
        itemDesc: "", 
        categoryId: "", 
        departmentId: "", 
        location: "",
        dateReport: new Date().toISOString().slice(0, 10), 
        status: "FOUND", 
        image: null
      });
      setImagePreview(null);
      
    } catch (err) {
      console.error("Failed to report item:", err);
      setMessage({
        text: err.message || "Failed to report item. Please try again.",
        type: "error",
        title: "Error"
      });
    }
  };

  // ADD THIS FUNCTION AFTER YOUR OTHER FUNCTIONS:
const playNotificationSound = () => {
  try {
    // Use the imported sound file
    const audio = new Audio(notifSound); // Change this line
    audio.volume = 0.8;
    audio.play();
  } catch (error) {
    console.log("Sound not playing:", error);
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/items/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        // Remove from local state
        setReportedItems(prev => prev.filter(item => item.itemId !== id));
        setMessage({
          text: "Item has been deleted successfully",
          type: "maroon",
          title: "Item Deleted"
        });
        setTimeout(() => playNotificationSound(), 100);
      } else {
        const errorText = await response.text();
        console.error("Delete failed:", errorText);
        setMessage({
          text: errorText || "Failed to delete item",
          type: "error",
          title: "Delete Failed"
        });
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      setMessage({
        text: err.message || "Error deleting item",
        type: "error",
        title: "Error"
      });
    }
  };

  // Helper to format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  // Handle Edit Click
const handleEditClick = (item) => {
  console.log("Editing item:", item);
  console.log("Item categoryId:", item.categoryId, "type:", typeof item.categoryId);
  console.log("Item departmentId:", item.departmentId, "type:", typeof item.departmentId);
  
  setEditingItem(item.itemId);
  setEditFormData({
    itemTitle: item.itemTitle || "",
    itemDesc: item.itemDesc || "",
    categoryId: item.categoryId ? String(item.categoryId) : "", // Convert to string
    departmentId: item.departmentId ? String(item.departmentId) : "", // Convert to string
    status: item.status || "",
    dateReport: item.dateReport ? item.dateReport.slice(0, 10) : new Date().toISOString().slice(0, 10),
    image: null
  });
  
  console.log("Set editFormData categoryId:", item.categoryId ? String(item.categoryId) : "", "type:", typeof (item.categoryId ? String(item.categoryId) : ""));
};

  // Handle Edit Form Change
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setEditFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setEditFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle Update Submit
  const handleUpdateSubmit = async (itemId) => {
    if (!user) {
      setMessage({
        text: "You must be logged in to update items!",
        type: "error",
        title: "Login Required"
      });
      return;
    }

// First check if IDs are actually selected
if (!editFormData.categoryId || !editFormData.departmentId) {
  console.log("EDIT FORM ERROR: categoryId =", editFormData.categoryId, "departmentId =", editFormData.departmentId);
  console.log("Full editFormData:", editFormData);
  setMessage({
    text: "Please select both a category and a campus",
    type: "error",
    title: "Missing Information"
  });
  return;
}

// Then try to find them
const selectedCategory = categories.find(c => String(c.categoryId) === String(editFormData.categoryId));
const selectedDepartment = departments.find(d => String(d.depId) === String(editFormData.departmentId));

if (!selectedCategory || !selectedDepartment) {
  console.log("EDIT FORM ERROR: Could not find selected items");
  setMessage({
    text: "Invalid category or campus selection. Please try again.",
    type: "error",
    title: "Selection Error"
  });
  return;
}

    // Create payload for update
    const payload = {
      itemTitle: editFormData.itemTitle,
      itemDesc: editFormData.itemDesc,
      location: selectedDepartment.depName,
      status: editFormData.status.toUpperCase(),
      userId: user.userId,
      categoryId: selectedCategory.categoryId,
      departmentId: selectedDepartment.depId,
      dateReport: editFormData.dateReport,
      imageUrl: editFormData.image ? editFormData.image.name : "" // Only filename
    };

    console.log("Update payload:", payload);

    try {
      const response = await fetch(`http://localhost:8080/api/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const responseText = await response.text();
      console.log("Update response:", responseText);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${responseText}`);
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", responseText);
        throw new Error("Invalid response from server");
      }

      console.log("Item updated successfully:", result);
      
      // Update local state
      setReportedItems(prev => prev.map(item => 
        item.itemId === itemId ? { ...item, ...result } : item
      ));
      
      setEditingItem(null);
      setMessage({
        text: `"${editFormData.itemTitle}" has been updated successfully`,
        type: "maroon",
        title: "Item Updated"
      });
      setTimeout(() => playNotificationSound(), 100);
      
      // Refresh the list
      await refreshUserItems();
      
    } catch (err) {
      console.error("Failed to update item:", err);
      setMessage({
        text: err.message || "Failed to update item",
        type: "error",
        title: "Update Failed"
      });
    }
  };

  // Handle Cancel Edit
  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditFormData({
      itemTitle: "",
      itemDesc: "",
      categoryId: "",
      departmentId: "",
      status: "",
      dateReport: "",
      image: null
    });
  };

  
  return (
    <div className="page-container">
      {/* Add Message component here */}
      <Message
        text={message.text}
        title={message.title}
        type={message.type}
        duration={5000} // Adjust duration as needed
        onClose={() => setMessage({ text: "", type: "info", title: "" })}
      />
      
      <div className="page-wrapper">
        <div className="content-panel">
          {activePanel === "report" && (
            <div className="report-item-page">
              <h1>Report Item</h1>
              <h4>Fill in the details below to help reunite items with their owners</h4>
              <form onSubmit={handleSubmit} className="report-item-form">
                <label>Item Name *</label>
                
                <input 
                name="itemTitle" 
                value={formData.itemTitle} 
                onChange={handleChange} 
                required 
                placeholder="Enter item name"
                className="item-name-input"
                />
                
                <label>Description *</label>
                <textarea 
                  name="itemDesc" 
                  value={formData.itemDesc} 
                  onChange={handleChange} 
                  required 
                  placeholder="Describe the item (color, brand, features, etc.)"
                />
                
                <div className="form-row">
                  <div>
                    <label>Category *</label>
                    <select 
                      name="categoryId" 
                      value={formData.categoryId} 
                      onChange={handleChange} 
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.categoryId} value={c.categoryId}>
                          {c.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label>Campus *</label>
                    <select 
                      name="departmentId" 
                      value={formData.departmentId} 
                      onChange={handleChange} 
                      required
                    >
                      <option value="">Select Campus</option>
                      {departments.map((d) => (
                        <option key={d.depId} value={d.depId}>
                          {d.depName}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label>Status *</label>
                    <select 
                      name="status" 
                      value={formData.status} 
                      onChange={handleChange} 
                      required
                    >
                      <option value="LOST">Lost</option>
                      <option value="FOUND">Found</option>
                    </select>
                  </div>
                </div>
                
                <label>Date Found/Lost *</label>
                <input 
                  type="date" 
                  name="dateReport" 
                  value={formData.dateReport} 
                  onChange={handleChange} 
                  required 
                />
                
                <label>Photo (Optional)</label>
                <input 
                  type="file" 
                  name="image" 
                  onChange={handleChange} 
                  accept="image/png, image/jpeg"
                />
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="image-preview">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{maxWidth: '200px', maxHeight: '200px', marginTop: '10px'}} 
                    />
                  </div>
                )}
                
                <button type="submit">Report Item</button>
              </form>
            </div>
          )}

          {activePanel === "list" && (
            <div className="reported-items-container">
              <h2>Your Reported Items</h2>
              
              {loading ? (
                <div className="loading-message">
                  <p>Loading your items...</p>
                </div>
              ) : reportedItems.length > 0 ? (
                <>
                  <p className="items-count">You have {reportedItems.length} reported item(s)</p>
                  <div className="items-grid">
                    {reportedItems.map((item) => (
                      <div key={item.itemId} className="reported-item-card">
                        
                        {/* EDIT MODE */}
                        {editingItem === item.itemId ? (
  <div className="edit-form">
    <h3>Edit Item</h3>
    
    <div className="form-group">
      <label>Item Name *</label>
      <input
        type="text"
        name="itemTitle"
        value={editFormData.itemTitle}
        onChange={handleEditChange}
        required
      />
    </div>
    
    <div className="form-group">
      <label>Description *</label>
      <textarea
        name="itemDesc"
        value={editFormData.itemDesc}
        onChange={handleEditChange}
        required
      />
    </div>
    
    <div className="form-row">
      <div className="form-group">
        <label>Category *</label>
        <select
          name="categoryId"
          value={editFormData.categoryId}
          onChange={handleEditChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={String(cat.categoryId)}>
              {cat.categoryName}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group"> {/* ADD THIS DIV WITH LABEL */}
        <label>Campus *</label>
        <select
          name="departmentId"
          value={editFormData.departmentId}
          onChange={handleEditChange}
          required
        >
          <option value="">Select Campus</option>
          {departments.map((dept) => (
            <option key={dept.depId} value={String(dept.depId)}>
              {dept.depName}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label>Status *</label>
        <select
          name="status"
          value={editFormData.status}
          onChange={handleEditChange}
          required
        >
          <option value="LOST">Lost</option>
          <option value="FOUND">Found</option>
        </select>
      </div>
    </div>
    
    <div className="form-group">
      <label>Date *</label>
      <input
        type="date"
        name="dateReport"
        value={editFormData.dateReport}
        onChange={handleEditChange}
        required
      />
    </div>
    
    <div className="form-group">
      <label>Photo</label>
      <input
        type="file"
        name="image"
        onChange={handleEditChange}
        accept="image/*"
      />
    </div>
    
    <div className="edit-actions">
      <button 
        className="save-btn"
        onClick={() => handleUpdateSubmit(item.itemId)}
      >
        Save Changes
      </button>
      <button 
        className="cancel-btn"
        onClick={handleCancelEdit}
      >
        Cancel
      </button>
    </div>
  </div>
                        ) : (
                          /* VIEW MODE */
                          <>
                            <div className="card-header">
                              <h3>{item.itemTitle || "Unnamed Item"}</h3>
                              <span className={`status-badge ${item.status ? item.status.toLowerCase() : 'unknown'}`}>
                                {item.status || "Unknown"}
                              </span>
                            </div>
                            
                            <div className="item-description">
                              <h4>Description:</h4>
                              <p>{item.itemDesc || "No description"}</p>
                            </div>
                            
                            <div className="item-details">
                              <p><strong>Category:</strong> {item.categoryName || "Uncategorized"}</p>
                              <p><strong>Campus:</strong> {item.location || "Not specified"}</p>
                              <p><strong>Date:</strong> {formatDate(item.dateReport)}</p>
                              <p><strong>Item ID:</strong> {item.itemId}</p>
                              <p><strong>Reported on:</strong> {formatDate(item.createdAt || item.dateReport)}</p>
                            </div>
                            
                            <div className="card-actions">
                              <button 
                                className="edit-btn"
                                onClick={() => handleEditClick(item)}
                              >
                                Edit
                              </button>
                              <button 
                                className="delete-btn" 
                                onClick={() => handleDelete(item.itemId)}
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <p>No items reported yet.</p>
                  <button 
                    className="report-first-btn"
                    onClick={() => setActivePanel("report")}
                  >
                    Report Your First Item
                  </button>
                </div>
              )}
            </div>
          )}

          {activePanel === "tips" && (
            <div className="tips-panel">
              <h2>Tips for Reporting Items</h2>
              <div className="tips-content">
                <div className="tip-section">
                  <h3>📝 When Reporting Found Items:</h3>
                  <ul>
                    <li>Provide a clear and accurate description including color, size, brand, and distinguishing features</li>
                    <li>Include the exact location where you found the item</li>
                    <li>Upload clear photos from multiple angles if possible</li>
                    <li>Mention any identifying marks or serial numbers</li>
                    <li>Be specific about the condition of the item</li>
                  </ul>
                </div>
                
                <div className="tip-section">
                  <h3>🔍 When Reporting Lost Items:</h3>
                  <ul>
                    <li>Describe the item in as much detail as possible</li>
                    <li>Include the last known location and time you saw it</li>
                    <li>Mention any sentimental or monetary value</li>
                    <li>Provide contact information for the rightful owner</li>
                    <li>Check back regularly for updates on found items</li>
                  </ul>
                </div>
                
                <div className="tip-section">
                  <h3>✅ Best Practices:</h3>
                  <ul>
                    <li>Report items as soon as you find or lose them</li>
                    <li>Be honest about the item's condition and value</li>
                    <li>Keep your contact information updated</li>
                    <li>Follow up on your reports periodically</li>
                    <li>Respect campus property rules and regulations</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default ReportItem;