import React from 'react';

export default function ReviewTable({ requests }) {
  return (
    <div className="block review-requests-tracker">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div>
          <button>All</button>
          <button>Queued</button>
          <button>Sent</button>
        </div>
        <div>
          <button>Export</button>
          <button>Refresh</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Sent Date</th>
            <th>Touchpoint</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>No review requests sent yet 🕒</td>
            </tr>
          ) : (
            requests.map((r, i) => (
              <tr key={i}>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.date}</td>
                <td>{r.touchpoint}</td>
                <td>{r.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}