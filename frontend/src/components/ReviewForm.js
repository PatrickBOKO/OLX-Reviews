import React, { useState } from 'react';
import axios from 'axios';
import "./ReviewForm.css";

export default function ReviewForm({ onAdd, bodyContainerStyle = false }) {
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
      className={`block form-container${bodyContainerStyle ? ' body-container-form' : ''}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="delay-controls">
          <div className="delay-group">
            <label htmlFor="hours">Delay (Hours):</label>
            <select id="hours" name="hours" value={form.hours} onChange={handleChange}>
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

        <div className="buttons">
          <button type="button" onClick={handleReset}>Reset</button>
          <button type="button">Simulation</button>
          <button type="submit">Send Request</button>
        </div>
      </form>
    </div>
  );
}