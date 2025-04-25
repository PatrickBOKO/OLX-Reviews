import React from 'react';

export default function Stats({ stats }) {
  return (
    <div>
      <div className="block floating-paragraphs">
        <div>
          <p>Total Requests Sent:</p>
          <span className="large-text">{stats.totalSent}</span>
          <p className="small-text">01/01/2023 - 01/31/2023</p>
        </div>
        <div>
          <p>Requests in Queue:</p>
          <span className="large-text">{stats.queued}</span>
          <p className="small-text">01/10/2023 - 01/31/2023</p>
        </div>
      </div>
      <div className="block" style={{ maxWidth: "100%" }}>
        <h3>Estimated Reviews by Platform</h3>
        <table className="table-container">
          <thead>
            <tr>
              <th>Platform</th>
              <th>Distribution</th>
              <th>Est. Reviews</th>
            </tr>
          </thead>
          <tbody>
            {stats.estReviews.map((r, i) => (
              <tr key={i}>
                <td>{r.platform}</td>
                <td>{r.distribution}</td>
                <td>{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}