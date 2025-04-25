import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Notification from "./components/Notification";
import Stats from './components/Stats';
// import ReviewForm from './components/ReviewForm';
import MainReviewForm from './components/MainReviewForm';
import ReviewTable from './components/ReviewTable';

function App() {
  const [stats, setStats] = useState({ totalSent: 0, queued: 0, estReviews: [] });
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/stats').then(res => setStats(res.data));
    axios.get('http://localhost:5000/api/reviews').then(res => setRequests(res.data));
  }, []);

  const addRequest = (newRequest) => {
    setRequests([...requests, newRequest]);
  };

  return (
    <div>
      <Header header={Header} /><br/>
      <div className="body-container">
        <Notification />
        <Stats stats={stats} />
        {/* Pass a prop so ReviewForm can match body-container's width/margin here */}
        <MainReviewForm onAdd={addRequest} bodyContainerStyle={true} />
        <ReviewTable requests={requests} />
      </div>
      <footer className="block" style={{ position: "relative" }}>
        <div className="info-block" style={{ margin: "0 10%" }}>
          <h2>Optional Review Boost Campaign 🚀</h2>
          <p>Setup Progress:</p>
          <ol>
            <li>Schedule Onboarding Call<br />Book a call to discuss your past customer review collection strategy.</li>
            <li>Strategy Planning<br />We'll help you plan the optimal approach for your business.</li>
            <li>Campaign Setup<br />Configure and prepare your one-time boost campaign.</li>
          </ol>
          <button style={{ marginTop: 10 }}>Schedule Onboarding Call</button>
        </div>
      </footer>
    </div>
  );
}

export default App;