import React, { useState } from "react";
import "./App.css";
import dashboard from "./assets/dashboard.png";
function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const BaseURL = "http://localhost:8080";
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      setError("Please enter a URL");
      return;
    }
    setLoading(true);
    setError("");
    setShortUrl("");
    try {
      const response = await fetch(`${BaseURL}/api/v0/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setShortUrl(data.shortUrl); // Adjust this key based on your API response structure
    } catch (error) {
      setError("Failed to shorten URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ClearButton = () => {
    setUrl("");
    setShortUrl("");
    setError("");
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${BaseURL}/${shortUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 5000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <section className="app">
      <div
        className="hero-content"
        style={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ maxWidth: "70%" }}>
          Build Your Link in Bio with One Click
        </h1>
        <p style={{ width: "60%" }}>
          Stop juggling multiple links! Build a stunning and functional bio link
          page for your social media profiles with just one click.
        </p>
      </div>

      <div className="input-container">
        <input
          type="url"
          placeholder="Enter your URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Shortening..." : "Shorten"}
          </button>
          <button onClick={ClearButton}>clear</button>
        </div>

        {error && <p className="error">{error}</p>}
        {shortUrl && (
          <div className="result">
            <p>Shortened URL:</p>
            {copied && <span className="copyNotification">URL Copied</span>}
            <button onClick={handleCopy}>{shortUrl}</button>
          </div>
        )}
      </div>
      <div className="light-blare" />
      <div className="light-blare1" />
    </section>
  );
}

export default App;
