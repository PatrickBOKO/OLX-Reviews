import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AuthModal.css";

export default function AuthModal({ open, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loginFields, setLoginFields] = useState({ username: "", password: "" });
  const [registerFields, setRegisterFields] = useState({
    fullName: "",
    email: "",
    username: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Clear messages when switching between Login/Register
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [isLogin]);

  if (!open) return null;

  const handleLoginChange = e => {
    setLoginFields({ ...loginFields, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = e => {
    setRegisterFields({ ...registerFields, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // 20s timeout for registration
    const source = axios.CancelToken.source();
    const timeoutId = setTimeout(() => {
      source.cancel("Request timed out");
    }, 20000);

    try {
      const res = await axios.post(
        "/api/ekomi/register",
        {
          email: registerFields.email,
          externalId: registerFields.username,
          pub_url: "https://gangl.de",
          pub_name: registerFields.fullName,
          firstName: registerFields.fullName.split(" ")[0],
          lastName: registerFields.fullName.split(" ").slice(1).join(" "),
          locale: "en",
          phone: "",
          password: registerFields.password
        },
        { cancelToken: source.token }
      );
      clearTimeout(timeoutId);
      setSuccess("Account created and connected to eKomi!");
      setTimeout(() => {
        setLoading(false);
        setSuccess(null);
        onClose();
      }, 6000);
    } catch (err) {
      clearTimeout(timeoutId);
      const backendError = err.response?.data?.error;
      if (axios.isCancel(err) && err.message === "Request timed out") {
        setError("Registration timed out. Please try again.");
      } else if (
        backendError &&
        backendError.toLowerCase().includes("already in use")
      ) {
        setError("Existing Username or Email address detected - Please choose different credentials");
      } else {
        setError(
          backendError ||
          err.message ||
          "Registration failed. Please try again."
        );
      }
      setLoading(false);
    }
  };

  const handleLogin = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // 20s timeout for login
    const source = axios.CancelToken.source();
    const timeoutId = setTimeout(() => {
      source.cancel("Request timed out");
    }, 20000);

    try {
      const res = await axios.post(
        "/api/ekomi/login",
        {
          username: loginFields.username,
          password: loginFields.password
        },
        { cancelToken: source.token }
      );
      clearTimeout(timeoutId);
      setSuccess("Login successful! Connected to eKomi.");
      setTimeout(() => {
        setLoading(false);
        setSuccess(null);
        // Stay on login form for another attempt if needed
      }, 6000);
    } catch (err) {
      clearTimeout(timeoutId);
      setError(
        err.response?.data?.error ||
        err.message ||
        "Login failed. Please check your credentials."
      );
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-panel" onClick={e => e.stopPropagation()}>
        <div className="auth-modal-toggle">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        {isLogin ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <h2>Enter your Logins</h2>
            <label>
              Username
              <input
                type="text"
                name="username"
                value={loginFields.username}
                onChange={handleLoginChange}
                required
                autoFocus
                disabled={loading}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                value={loginFields.password}
                onChange={handleLoginChange}
                required
                disabled={loading}
              />
            </label>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <h2>OLX Reviews Account Registration</h2>
            <label>
              Full Name
              <input
                type="text"
                name="fullName"
                value={registerFields.fullName}
                onChange={handleRegisterChange}
                required
                disabled={loading}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={registerFields.email}
                onChange={handleRegisterChange}
                required
                disabled={loading}
              />
            </label>
            <label>
              Unique Cross-Reference ID (Username)
              <input
                type="text"
                name="username"
                value={registerFields.username}
                onChange={handleRegisterChange}
                required
                disabled={loading}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                value={registerFields.password}
                onChange={handleRegisterChange}
                required
                disabled={loading}
              />
            </label>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        )}
        <button className="auth-modal-close" onClick={onClose} title="Close">&times;</button>
      </div>
    </div>
  );
}