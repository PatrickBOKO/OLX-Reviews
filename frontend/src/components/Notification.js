import React, { useState } from "react";

export default function Notification() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="block notification" style={{ position: "relative" }}>
      <h1>Welcome to OLXReviews</h1>
      <p>
        <strong>Enhance your online presence with automated review generation:</strong>
      </p>
      <button
        className="close-btn"
        title="Close notification"
        style={{
          position: "absolute",
          top: 15,
          right: 20,
          background: "transparent",
          border: "none",
          color: "#000",
          fontSize: "1.5em",
          cursor: "pointer",
        }}
        onClick={() => setVisible(false)}
        aria-label="Close notification"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <ul>
        <li><strong>Review generation on autopilot</strong> - set up once, benefit continuously</li>
        <li><strong>Set-and-forget system</strong> - minimal management overhead</li>
        <li>Based on real customer interactions from your inbox</li>
        <li><strong>100% GDPR compliant</strong> - all data stays in your inbox</li>
        <li>No email data shared with third parties</li>
        <li>Automatic processing directly in your inbox</li>
        <li>Intelligently timed requests for maximum response</li>
        <li>Flexibly adaptable to your business needs</li>
      </ul>
    </div>
  );
}