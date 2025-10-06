// src/components/StatCard.js
import React from "react";

/**
 * Simple presentational stat card.
 * Uses your existing .square/.count/.label CSS classes so styling stays consistent.
 */
export default function StatCard({ count, label }) {
  return (
    <div className="square">
      <div className="count">{count}</div>
      <div className="label">{label}</div>
    </div>
  );
}
