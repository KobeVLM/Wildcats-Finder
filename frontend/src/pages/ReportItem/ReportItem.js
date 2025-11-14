// src/pages/ReportItem/ReportItem.js
import React, { useState } from "react";
import "./ReportItem.css";

function ReportItem() {
  const [itemType, setItemType] = useState("lost");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      itemType,
      itemName,
      description,
      location,
    });
    alert("Item report submitted!");
    // Later you can add a POST request to your backend here
  };

  return (
    <div className="report-item-container">
      <h1>Report Item</h1>
      <form className="report-item-form" onSubmit={handleSubmit}>
        <label>
          Type:
          <select value={itemType} onChange={(e) => setItemType(e.target.value)}>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </label>

        <label>
          Item Name:
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g. Blue Backpack"
            required
          />
        </label>

        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the item..."
            required
          />
        </label>

        <label>
          Last Seen Location:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. CIT Lobby"
            required
          />
        </label>

        <button type="submit" className="submit-btn">Submit Report</button>
      </form>
    </div>
  );
}

export default ReportItem;
