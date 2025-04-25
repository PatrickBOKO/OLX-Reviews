import React, { useState, useRef } from "react";
import SettingsModal from "./SettingsModal";
import AuthModal from "./AuthModal";
import "./Header.css";

export default function Header() {
  // Dropdown and date-picker state
  const [touchpoint, setTouchpoint] = useState("All Touchpoints");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  // Refs for click-outside logic
  const dropdownRef = useRef(null);
  const datePickerRef = useRef(null);

  // Toggle handlers
  const handleDropdown = (e) => {
    setDropdownOpen((open) => !open);
    setDatePickerOpen(false);
    e.stopPropagation();
  };
  const handleDatePicker = (e) => {
    setDatePickerOpen((open) => !open);
    setDropdownOpen(false);
    e.stopPropagation();
  };

  // Click outside to close dropdowns
  React.useEffect(() => {
    function handleClick(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        datePickerRef.current &&
        !datePickerRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
        setDatePickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <header>
        <div className="logo">OLXReviews</div>
        <nav>
          {/* Touchpoint Dropdown */}
          <div
            className={`dropdown nav-item${dropdownOpen ? " open" : ""}`}
            ref={dropdownRef}
          >
            <button
              className={`dropdown-toggle${dropdownOpen ? " active" : ""}`}
              onClick={handleDropdown}
              type="button"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
              <span id="selectedTouchpoint">{touchpoint}</span>
            </button>
            <div
              className="dropdown-content"
              style={{ display: dropdownOpen ? "block" : "none" }}
            >
              {/* <a
                href="#"
                data-value="all"
                className={touchpoint === "All Touchpoints" ? "selected" : ""}
                onClick={e => { e.preventDefault(); setTouchpoint("All Touchpoints"); setDropdownOpen(false); }}
              >
                All Touchpoints
              </a> */}
              <a
                href="#"
                data-value="sent"
                className={touchpoint === "Sent Mail" ? "selected" : ""}
                onClick={e => { e.preventDefault(); setTouchpoint("Sent Mail"); setDropdownOpen(false); }}
              >
                Sent Mail
              </a>
              <a
                href="#"
                data-value="calendar"
                className={touchpoint === "Calendar Events" ? "selected" : ""}
                onClick={e => { e.preventDefault(); setTouchpoint("Calendar Events"); setDropdownOpen(false); }}
              >
                Calendar Events
              </a>
              <a
                href="#"
                data-value="custom-folder"
                className={touchpoint === "Custom Folder" ? "selected" : ""}
                onClick={e => { e.preventDefault(); setTouchpoint("Custom Folder"); setDropdownOpen(false); }}
              >
                Custom Folder
              </a>
              <a
                href="#"
                data-value="shared-folder"
                className={touchpoint === "Shared Folder" ? "selected" : ""}
                onClick={e => { e.preventDefault(); setTouchpoint("Shared Folder"); setDropdownOpen(false); }}
              >
                Shared Folder
              </a>
            </div>
          </div>

          {/* Date Picker Dropdown */}
          <div
            className={`date-picker nav-item${datePickerOpen ? " open" : ""}`}
            ref={datePickerRef}
          >
            <button
              className={`date-picker-toggle${datePickerOpen ? " active" : ""}`}
              onClick={handleDatePicker}
              type="button"
              aria-haspopup="true"
              aria-expanded={datePickerOpen}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="4" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <rect x="7" y="14" width="2" height="2" fill="#3b82f6" stroke="none"/>
                <rect x="11" y="14" width="2" height="2" fill="#3b82f6" stroke="none"/>
                <rect x="15" y="14" width="2" height="2" fill="#3b82f6" stroke="none"/>
              </svg>
              <span id="selectedDate">{dateRange}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div
              className="date-picker-dropdown"
              style={{ display: datePickerOpen ? "block" : "none" }}
            >
              <a
                href="#"
                data-value="7"
                className={dateRange === "Last 7 Days" ? "selected" : ""}
                onClick={e => { e.preventDefault(); setDateRange("Last 7 Days"); setDatePickerOpen(false); }}
              >
                Last 7 Days
              </a>
              <a
                href="#"
                data-value="30"
                className={dateRange === "Last 30 Days" ? "selected" : ""}
                onClick={e => { e.preventDefault(); setDateRange("Last 30 Days"); setDatePickerOpen(false); }}
              >
                Last 30 Days
              </a>
              <a
                href="#"
                data-value="90"
                className={dateRange === "Last 90 Days" ? "selected" : ""}
                onClick={e => { e.preventDefault(); setDateRange("Last 90 Days"); setDatePickerOpen(false); }}
              >
                Last 90 Days
              </a>
              <a
                href="#"
                data-value="custom"
                className={dateRange === "Custom Range" ? "selected" : ""}
                onClick={e => { e.preventDefault(); setDateRange("Custom Range"); setDatePickerOpen(false); }}
              >
                Custom Range
              </a>
            </div>
          </div>
          {/* Settings */}
          <div
            className="nav-item settings-icon"
            tabIndex={0}
            title="Settings"
            onClick={() => setSettingsOpen(true)}
            role="button"
            aria-label="Settings"
          >
            {/* Modern gear/settings icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>         

          {/* Login/Sign Up Button */}
          <button
            className="nav-item modern-btn"
            style={{
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              padding: "8px 20px",
              borderRadius: "6px",
              fontWeight: 500,
              fontSize: "0.97rem",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onClick={() => setAuthOpen(true)}
          >
            Login / Sign Up
          </button>
          
        </nav>
      </header>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}