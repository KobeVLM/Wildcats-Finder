import React from "react";
import "./StatCard.css";

export default function StatCard({ count, label }) {
  return (
    <div className="square">
      <div className="count">{count}</div>
      <div className="label">{label}</div>
    </div>
  );
}
