import React, { useState } from 'react';
import axios from 'axios';
import "./MainReviewForm.css";

export default function MainReviewForm({ onAdd, bodyContainerStyle = false }) {
  const [form, setForm] = useState({
    name: '', email: '', hours: '1 hour', frequency: '1 week',
    blacklist: '', subject: 'Your feedback is important to us',
    template: `Hello,
Every feedback matters to us, so we'd very much appreciate if you could take a moment to share your experience with us.

How would you rate us?
Please click on the number of stars you would like to award - it takes only 1 minute.

%%FEEDBACKLINK%%

Thanks a lot for participating.`,
    date: '', touchpoint: 'Email', status: 'Queued'
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const request = { ...form, date: new Date().toISOString().slice(0, 10) };
    await axios.post('http://localhost:5000/api/reviews/send', request);
    onAdd(request);
    setForm({ ...form, name: '', email: '' });
  };

  const handleReset = () => {
    setForm({
      ...form,
      blacklist: '',
      subject: 'Your feedback is important to us',
      template: `Hello,
Every feedback matters to us, so we'd very much appreciate if you could take a moment to share your experience with us.

How would you rate us?
Please click on the number of stars you would like to award - it takes only 1 minute.

%%FEEDBACKLINK%%

Thanks a lot for participating.`
    });
  };

  return (
    <div
      className={`mainblock mainreviewform-container${bodyContainerStyle ? ' mainreviewform-body-container' : ''}`}
    >
      <form onSubmit={handleSubmit} className="mainreviewform-form">
        <div className="mainreviewform-delay-controls">
          <div className="mainreviewform-delay-group">
            <label htmlFor="mainreviewform-hours">Delay (Hours):</label>
            <select id="mainreviewform-hours" name="hours" value={form.hours} onChange={handleChange}>
              <option>1 hour</option>
              <option>2 hours</option>
              <option>3 hours</option>
            </select>
          </div>

          <div className="mainreviewform-delay-group">
            <label htmlFor="mainreviewform-frequency">Frequency (1x every):</label>
            <select id="mainreviewform-frequency" name="frequency" value={form.frequency} onChange={handleChange}>
              <option>1 week</option>
              <option>2 weeks</option>
              <option>3 weeks</option>
              <option>1 month</option>
              <option>2 months</option>
              <option>3 months</option>
            </select>
          </div>
        </div>

        <label htmlFor="mainreviewform-blacklist">Exclude these e-mail address(es)/-domain(s)</label>
        <textarea
          id="mainreviewform-blacklist"
          name="blacklist"
          value={form.blacklist}
          onChange={handleChange}
          placeholder="Blacklist Email Addresses"
        />
        <span className="mainreviewform-info-text">separate multiple email address(es)/-domain(s) by semicolon</span>

        <label htmlFor="mainreviewform-subject">Subject:</label>
        <input
          type="text"
          id="mainreviewform-subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className="mainreviewform-editable-placeholder"
        />

        <label htmlFor="mainreviewform-template">Request Email:</label>
        <textarea
          id="mainreviewform-template"
          name="template"
          value={form.template}
          onChange={handleChange}
          className="mainreviewform-editable-placeholder"
        />

        <div className="mainreviewform-buttons">
          <button type="button" onClick={handleReset}>Reset</button>
          <button type="button">Simulation</button>
          <button type="submit">Send Request</button>
        </div>
      </form>
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