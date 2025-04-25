import React, { useState } from "react";
import CalendarSettingsForm from "./CalendarSettingsForm";
import ResponseSettingsForm from "./ResponseSettingsForm";
import CustomFolderSettingsForm from "./CustomFolderSettingsForm";
import SharedFolderSettingsForm from "./SharedFolderSettingsForm";
import ReviewPlatformsForm from "./ReviewPlatformsForm";
import "./SettingsModal.css";

// Replace FontAwesome icons with SVGs for React
const calendarIcon = (
  <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const replyIcon = (
  <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="10" y1="11" x2="20" y2="11"/></svg>
);
const folderIcon = (
  <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2z"/></svg>
);
const shareIcon = (
  <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
);

const reviewOptions = [
  {
    id: "calendar",
    label: "Calendar",
    description: "based on your previous appointments with external participants",
    icon: calendarIcon,
  },
  {
    id: "responses",
    label: "Responses",
    description: "based on your sent emails",
    icon: replyIcon,
  },
  {
    id: "customFolder",
    label: "Custom Folder",
    description: "based on emails received from extern",
    icon: folderIcon,
  },
  {
    id: "sharedFolder",
    label: "Shared Folder",
    description: "based on emails received from extern",
    icon: shareIcon,
  },
];

const DEFAULT_PLATFORMS = [
  { platform: "eKomi", distribution: "", url: "" },
  { platform: "Google", distribution: "", url: "" },
  { platform: "TrustPilot", distribution: "", url: "" },
  { platform: "Facebook", distribution: "", url: "" },
];

export default function SettingsModal({
  open,
  onClose,
  initialPlatforms = DEFAULT_PLATFORMS,
  mailbox = "",
  onSavePlatforms = () => {},
  onChangeMailbox = () => {},
  onResetPlatforms = () => {},
}) {
  const [checked, setChecked] = useState({
    calendar: false,
    responses: false,
    customFolder: false,
    sharedFolder: false,
  });

  // For Settings Forms modals
  const [showCalendarSettings, setShowCalendarSettings] = useState(false);
  const [showResponseSettings, setShowResponseSettings] = useState(false);
  const [showCustomFolderSettings, setShowCustomFolderSettings] = useState(false);
  const [showSharedFolderSettings, setShowSharedFolderSettings] = useState(false);

  // Platforms Modal
  const [showPlatformsModal, setShowPlatformsModal] = useState(false);
  // Local state for platform splits
  const [platformSplits, setPlatformSplits] = useState(initialPlatforms);
  const [mailboxInput, setMailboxInput] = useState(mailbox);

  // Handle update from ReviewPlatformsForm
  const handleSavePlatforms = ({ platforms, mailbox }) => {
    setPlatformSplits(platforms);
    setMailboxInput(mailbox);
    onSavePlatforms({ platforms, mailbox });
    setShowPlatformsModal(false);
  };

  const handleResetPlatforms = () => {
    setPlatformSplits(DEFAULT_PLATFORMS);
    setMailboxInput("");
    onResetPlatforms();
  };

  const handleMailboxChange = (val) => {
    setMailboxInput(val);
    onChangeMailbox(val);
  };

  // Open external url on click
  const openExternalUrl = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!open) return null;

  const handleCheck = (id) => {
    setChecked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <div className="settings-modal-overlay" onClick={onClose}>
        <div className="settings-modal-panel" onClick={e => e.stopPropagation()}>
          <div className="header">
            <h5>
              Define settings in order to automatically collect as many reviews as possible in record time
            </h5>
            <div className="logo">OLX Survey</div>
          </div>
          <div className="divider"></div>
          <fieldset>
            <legend>Collect reviews automatically from...</legend>
            {reviewOptions.map((opt) => (
              <React.Fragment key={opt.id}>
                <div className="row">
                  {opt.icon}
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      id={opt.id}
                      checked={checked[opt.id]}
                      onChange={() => handleCheck(opt.id)}
                    />
                    <label htmlFor={opt.id}>{opt.label}</label>
                  </div>
                  <div className="description">{opt.description}</div>
                  {opt.id === "calendar" ? (
                    <button
                      className="settings-button"
                      disabled={!checked[opt.id]}
                      onClick={() => setShowCalendarSettings(true)}
                      type="button"
                    >
                      Settings
                    </button>
                  ) : opt.id === "responses" ? (
                    <button
                      className="settings-button"
                      disabled={!checked[opt.id]}
                      onClick={() => setShowResponseSettings(true)}
                      type="button"
                    >
                      Settings
                    </button>
                  ) : opt.id === "customFolder" ? (
                    <button
                      className="settings-button"
                      disabled={!checked[opt.id]}
                      onClick={() => setShowCustomFolderSettings(true)}
                      type="button"
                    >
                      Settings
                    </button>
                  ) : opt.id === "sharedFolder" ? (
                    <button
                      className="settings-button"
                      disabled={!checked[opt.id]}
                      onClick={() => setShowSharedFolderSettings(true)}
                      type="button"
                    >
                      Settings
                    </button>
                  ) : (
                    <button
                      className="settings-button"
                      disabled={!checked[opt.id]}
                      type="button"
                    >
                      Settings
                    </button>
                  )}
                </div>
                {/* Insert notice block right below the Shared Folder checkbox */}
                {opt.id === "sharedFolder" && (
                  <div
                    className="shared-folder-important-global"
                    style={{
                      fontSize: "0.85rem",
                      marginLeft: 48,
                      marginTop: 2,
                      marginBottom: 12,
                      color: "#b91c1c",
                      background: "#fee2e2",
                      padding: "5px 12px",
                      borderRadius: 6,
                      fontWeight: 500,
                      textAlign: "left",
                    }}
                  >
                    This feature is only available to <span className="paid-highlight" style={{ color: '#2563eb' }}>active/paid users.</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </fieldset>

          <fieldset>
            <legend>Review platforms</legend>
            <div className="flex-row">
              <div className="description">
                Define which review platforms matter for your business to receive your reviews...
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPlatformsModal(true);
                }}
              >
                Platforms
              </button>
            </div>
          </fieldset>

          <fieldset>
            <legend>Options</legend>
            <div className="flex-row">
              <div className="description">Define global options and look at statistics...</div>
              <button
                type="button"
                onClick={() => openExternalUrl("https://gangl.de/remote-support.html")}
              >
                Options
              </button>
            </div>
          </fieldset>

          <fieldset>
            <legend>Widgets</legend>
            <div className="flex-row">
              <div className="description">
                You want to embed your collected reviews directly on your website?<br />
                Get in touch with us and check out our widgets...
              </div>
              <button
                type="button"
                onClick={() => openExternalUrl("https://gangl.de/remote-support.html")}
              >
                Contact Us
              </button>
            </div>
          </fieldset>

          <fieldset>
            <legend>CRM / other data source(s)</legend>
            <div className="flex-row">
              <div className="description">
                You want to automatically collect reviews from your CRM or other data sources (e.g CSV)...
              </div>
              <button
                type="button"
                onClick={() => openExternalUrl("https://gangl.de/remote-support.html")}
              >
                Contact Us
              </button>
            </div>
          </fieldset>

          <footer>
            <div className="version-info">Demo version. 26 days left.</div>
            <div className="footer-actions">
              <div className="copyright">Rel. 1.2.1 (c)2001-2025 gangl.de</div>
              <div className="action-buttons">
                <button>Simulation</button>
                <button className="primary-button" onClick={onClose}>Ok</button>
              </div>
            </div>
          </footer>
        </div>
        {/* ReviewPlatformsForm as popup above the settings modal */}
        <ReviewPlatformsForm
          open={showPlatformsModal}
          onClose={() => setShowPlatformsModal(false)}
          onSave={handleSavePlatforms}
          initialPlatforms={platformSplits}
          mailbox={mailboxInput}
          onChangeMailbox={handleMailboxChange}
          onReset={handleResetPlatforms}
        />
      </div>
      <CalendarSettingsForm
        open={showCalendarSettings}
        onClose={() => setShowCalendarSettings(false)}
      />
      <ResponseSettingsForm
        open={showResponseSettings}
        onClose={() => setShowResponseSettings(false)}
      />
      <CustomFolderSettingsForm
        open={showCustomFolderSettings}
        onClose={() => setShowCustomFolderSettings(false)}
      />
      <SharedFolderSettingsForm
        open={showSharedFolderSettings}
        onClose={() => setShowSharedFolderSettings(false)}
      />
    </>
  );
}