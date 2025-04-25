import React, { useState, useEffect } from 'react';
import "./ReviewForm.css";

// Utility function to fetch userId by email
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

export default function CalendarSettingsForm({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    calendarAccount: '',
    eventType: 'All Events',
    delay: '1 hour',
    frequency: '1 week',
    blacklist: '',
    subject: 'Tell us about your recent meeting',
    template: `Hi,
We value your feedback on your recent appointment.

Please take a moment to review your experience.

%%FEEDBACKLINK%%

Thank you!`
  });
  const [userId, setUserId] = useState("");

  // Fetch userId whenever the calendarAccount (email) changes
  useEffect(() => {
    if (form.calendarAccount) {
      fetchUserIdByEmail(form.calendarAccount).then(setUserId);
    }
  }, [form.calendarAccount]);

  if (!open) return null;

  // Handle input changes, replacing %%FEEDBACKLINK%% with smartlink if userId is available
  const handleChange = e => {
    let { name, value } = e.target;
    if (name === "template" && value.includes("%%FEEDBACKLINK%%") && userId) {
      value = value.replace(
        /%%FEEDBACKLINK%%/g,
        `https://yourdomain.com/api/smartlink/${userId}`
      );
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(form);
    if (onClose) onClose();
  };

  const handleReset = () => {
    setForm({
      ...form,
      blacklist: '',
      subject: 'Tell us about your recent meeting',
      template: `Hi,
We value your feedback on your recent appointment.

Please take a moment to review your experience.

%%FEEDBACKLINK%%

Thank you!`
    });
  };

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div
        className="block form-container calendar-settings-form"
        onClick={e => e.stopPropagation()}
      >
        <h2>Calendar Review Settings</h2>
        <div className="calendar-settings-description">
          Define settings for automatically collecting reviews for <strong>Calendar</strong>
          <span style={{ fontWeight: 400 }}> (based on your previous appointments with external participants)</span>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="calendarAccount">Calendar Account (Email):</label>
          <input
            type="text"
            id="calendarAccount"
            name="calendarAccount"
            value={form.calendarAccount}
            onChange={handleChange}
            placeholder="e.g. you@company.com"
          />

          <label htmlFor="eventType">Event Type:</label>
          <select
            id="eventType"
            name="eventType"
            value={form.eventType}
            onChange={handleChange}
          >
            <option>All Events</option>
            <option>External Only</option>
            <option>Internal Only</option>
          </select>

          <div className="delay-controls">
            <div className="delay-group">
              <label htmlFor="delay">Delay (Hours):</label>
              <select id="delay" name="delay" value={form.delay} onChange={handleChange}>
                <option>1 hour</option>
                <option>2 hours</option>
                <option>3 hours</option>
              </select>
            </div>
            <div className="delay-group">
              <label htmlFor="frequency">Frequency (1x every):</label>
              <select id="frequency" name="frequency" value={form.frequency} onChange={handleChange}>
                <option>1 week</option>
                <option>2 weeks</option>
                <option>3 weeks</option>
                <option>1 month</option>
                <option>2 months</option>
                <option>3 months</option>
              </select>
            </div>
          </div>

          <label htmlFor="blacklist">Exclude these e-mail address(es)/-domain(s)</label>
          <textarea
            id="blacklist"
            name="blacklist"
            value={form.blacklist}
            onChange={handleChange}
            placeholder="Blacklist Email Addresses"
          />
          <span className="info-text">separate multiple email address(es)/-domain(s) by semicolon</span>

          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="editable-placeholder"
          />

          <label htmlFor="template">Request Email:</label>
          <textarea
            id="template"
            name="template"
            value={form.template}
            onChange={handleChange}
            className="editable-placeholder"
          />

          <div className="buttons calendar-settings-buttons">
            <button type="button" onClick={handleReset}>Reset</button>
            <button type="button">Simulation</button>
            <button
              type="submit"
              className="primary-button"
              style={{ backgroundColor: "#0078d4", color: "#fff" }}
            >
              Run Now
            </button>
            <button
              type="button"
              className="calendar-close-btn"
              style={{
                marginLeft: "auto",
                background: "#f8f9fa",
                color: "#374151",
                border: "1px solid #e5e7eb"
              }}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}