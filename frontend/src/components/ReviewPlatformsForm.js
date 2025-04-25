import React, { useState, useEffect } from "react";
import "./ReviewPlatformsForm.css";

// Helper to validate URLs
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const PLATFORMS = [
  { name: "eKomi" },
  { name: "Google" },
  { name: "TrustPilot" },
  { name: "TrustedShops" },
  // Add more platforms as needed
];

export default function ReviewPlatformsForm({
  open,
  onClose,
  onSave,
  initialPlatforms,
  mailbox,
  onChangeMailbox,
  onReset,
  userId // Pass the user's unique ID as a prop
}) {
  // State for platform split
  const [platforms, setPlatforms] = useState(
    PLATFORMS.map((p, idx) => ({
      platform: p.name,
      distribution: initialPlatforms?.[idx]?.distribution || "",
      url: initialPlatforms?.[idx]?.url || "",
    }))
  );
  const [email, setEmail] = useState(mailbox || "");

  // Update local state when parent provides new props (on reset, etc)
  useEffect(() => {
    setPlatforms(
      PLATFORMS.map((p, idx) => ({
        platform: p.name,
        distribution: initialPlatforms?.[idx]?.distribution || "",
        url: initialPlatforms?.[idx]?.url || "",
      }))
    );
  }, [initialPlatforms]);

  useEffect(() => {
    setEmail(mailbox || "");
  }, [mailbox]);

  // Handle change in distribution (number, max 100 sum)
  const handleDistributionChange = (i, value) => {
    let val = value.replace(/\D/, ""); // numbers only
    if (val === "") val = "";
    else val = Math.max(0, Math.min(100, Number(val)));
    const updated = [...platforms];
    updated[i].distribution = val;
    setPlatforms(updated);
  };

  // Handle URL change
  const handleUrlChange = (i, value) => {
    const updated = [...platforms];
    updated[i].url = value;
    setPlatforms(updated);
  };

  // Add error state
  const [error, setError] = useState(null);

  // Validate all platforms before enabling Save/Test
  const isFormValid = platforms.every(
    p =>
      (Number(p.distribution) === 0) ||
      (Number(p.distribution) > 0 && p.url && isValidUrl(p.url))
  );
  const totalDistribution = platforms.reduce(
    (acc, p) => acc + (Number(p.distribution) || 0),
    0
  );

  // Save handler: also save to backend for smartlink use
  const handleSave = async () => {
    setError(null);
    if (!isFormValid) {
      setError("Please provide a valid URL for every platform with a distribution > 0.");
      return;
    }
    if (totalDistribution !== 100) {
      setError("Total distribution must be exactly 100%.");
      return;
    }
    try {
      await fetch("/api/save-platforms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, platforms })
      });
      onSave && onSave({ platforms, mailbox: email });
    } catch {
      setError("Failed to save platform settings.");
    }
  };

  // Test Smartlink handler
  const handleTestSmartlink = () => {
    setError(null);
    if (!isFormValid) {
      setError("Please provide a valid URL for every platform with a distribution > 0.");
      return;
    }
    if (totalDistribution !== 100) {
      setError("Total distribution must be exactly 100%.");
      return;
    }
    // Open the smartlink in a new tab (simulate reviewer experience)
    window.open(`/api/smartlink/${userId}`, "_blank");
  };

  // Handle Reset
  const handleReset = () => {
    setPlatforms(
      PLATFORMS.map((p) => ({
        platform: p.name,
        distribution: "",
        url: "",
      }))
    );
    setEmail("");
    onReset && onReset();
  };

  // Handle Mailbox Change
  const handleMailboxChange = (e) => {
    setEmail(e.target.value);
    onChangeMailbox && onChangeMailbox(e.target.value);
  };

  if (!open) return null;

  return (
    <div className="review-platforms-modal-overlay" onClick={onClose}>
      <div className="review-platforms-modal-panel" onClick={e => e.stopPropagation()}>
        <div className="review-platforms-header">
          <h3>Distribute Your Review Traffic by Platform</h3>
          <p>
            Define how review requests and traffic will be split between your connected platforms. Set the percentage for each platform so that the total adds up to 100%.<br />
            Each platform should have the direct review URL where your customers will leave reviews.
          </p>
          <label className="mailbox-label" htmlFor="review-platforms-mailbox">
            Mailbox Account (Email)
          </label>
          <input
            id="review-platforms-mailbox"
            type="email"
            className="mailbox-input"
            value={email}
            onChange={handleMailboxChange}
            placeholder="your@email.com"
            autoComplete="email"
          />
        </div>

        <div className="review-platforms-table-section">
          <div className="table-title">Traffic Split</div>
          <table className="review-platforms-table">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Distribution (%)</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((row, i) => (
                <tr key={row.platform}>
                  <td>{row.platform}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      className="distribution-input"
                      value={row.distribution}
                      onChange={(e) =>
                        handleDistributionChange(i, e.target.value)
                      }
                      placeholder="0"
                    />
                  </td>
                  <td>
                    <input
                      type="url"
                      className="url-input"
                      value={row.url}
                      onChange={(e) => handleUrlChange(i, e.target.value)}
                      placeholder={`Paste ${row.platform} review URL`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="total-label">Total</td>
                <td
                  className={
                    totalDistribution === 100
                      ? "total-valid"
                      : "total-invalid"
                  }
                >
                  {totalDistribution}% 
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <div className="review-platforms-buttons">
          <button className="modern-btn reset-btn" type="button" onClick={handleReset}>
            Reset
          </button>
          <button
            className="modern-btn save-btn"
            type="button"
            onClick={handleSave}
            disabled={!isFormValid || totalDistribution !== 100}
            title={totalDistribution !== 100 ? "Total must be exactly 100%" : ""}
          >
            Save
          </button>
          <button
            className="modern-btn"
            style={{ background: "#10b981", color: "#fff" }}
            type="button"
            onClick={handleTestSmartlink}
            disabled={!isFormValid || totalDistribution !== 100}
            title="Test the smartlink traffic split live"
          >
            Test Feedback Links &amp; Review Forms Live
          </button>
          <button className="modern-btn close-btn" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
// Example utility function (place in a shared utils file or in each form component)
async function fetchUserIdByEmail(email) {
  if (!email) return null;
  try {
    const res = await fetch(`/api/users/userIdByEmail?email=${encodeURIComponent(email)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.userId;
  } catch {
    return null;
  }
}