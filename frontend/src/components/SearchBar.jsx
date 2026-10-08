import React from "react";

function SearchBar({
  query,
  setQuery,
  location,
  setLocation,
  internshipsOnly,
  setInternshipsOnly,
  searchJobs,
  loading,
  activeTab,
  setActiveTab,
  savedJobsCount,
}) {
  const quickSearches = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Engineer",
    "Data Science",
    "Full Stack Intern",
    "Cybersecurity",
  ];

  const handleQuickSearch = (role) => {
  const newQuery = `${role} intern`;
  setQuery(newQuery);
  searchJobs(newQuery);
};

  return (
    <section className="hero-search-section">
      <div className="hero-glow-bg"></div>

      {/* Hero Header */}
      <div className="hero-header">
        <div className="hero-tag">
          <span className="sparkle">✨</span>
          <span>AI-Powered Skill Gap Analysis & Live Internship Engine</span>
        </div>

        <h1 className="hero-title">
          Land Internships Built For <span className="gradient-text">Your Exact Skillset</span>
        </h1>

        <p className="hero-subtitle">
          Search real-time tech opportunities, measure your candidate match score, and get personalized skill roadmaps to get hired.
        </p>
      </div>

      {/* Search Bar Container */}
      <div className="search-card">
        <div className="search-inputs">
          {/* Query Input */}
          <div className="search-field">
            <label htmlFor="role-input">
              <span className="field-icon">🔍</span>
              <span>Role / Keywords</span>
            </label>
            <input
              id="role-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Software Engineer, React Developer..."
              onKeyDown={(e) => e.key === "Enter" && searchJobs(query)}
            />
          </div>

          <div className="field-divider"></div>

          {/* Location Input */}
          <div className="search-field">
            <label htmlFor="location-input">
              <span className="field-icon">📍</span>
              <span>Location</span>
            </label>
            <input
              id="location-input"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bangalore, Remote, India..."
              onKeyDown={(e) => e.key === "Enter" && searchJobs()}
            />
          </div>
        </div>

        {/* Search Controls & Action */}
        <div className="search-actions-row">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={internshipsOnly}
              onChange={(e) => setInternshipsOnly(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">🎓 Internships only</span>
          </label>

          <button
            className="search-btn"
            // onClick={searchJobs}
            disabled={loading}
            onClick={() => searchJobs(query)}
          >
            {loading ? (
              <span className="loading-spinner-wrapper">
                <span className="spinner"></span> Searching...
              </span>
            ) : (
              <>
                <span>Search Internships</span>
                <span className="arrow-icon">🚀</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Search Chips */}
      <div className="quick-searches">
        <span className="quick-label">Popular Searches:</span>
        <div className="quick-chips">
          {quickSearches.map((item) => (
            <button
              key={item}
              className="quick-chip"
              onClick={() => handleQuickSearch(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SearchBar;