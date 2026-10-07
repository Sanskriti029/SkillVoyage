import React from "react";

function Navbar({
  activeTab,
  setActiveTab,
  savedJobsCount,
  profileCompletion,
  loggedInUser,
  onLogout,
}) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        
        {/* Brand Logo */}
        <div className="brand" onClick={() => setActiveTab("search")}>
          <div className="brand-icon-wrapper">
            <span className="brand-icon">🎯</span>
            <div className="brand-glow"></div>
          </div>
          <div className="brand-text">
            <span className="brand-title">InternScout</span>
            <span className="brand-badge">PRO MATCH</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-links">
          <button
            className={`nav-tab ${activeTab === "search" ? "active" : ""}`}
            onClick={() => setActiveTab("search")}
          >
            <span className="tab-icon">🔍</span>
            <span>Search</span>
          </button>

          <button
            className={`nav-tab ${activeTab === "saved" ? "active" : ""}`}
            onClick={() => setActiveTab("saved")}
          >
            <span className="tab-icon">⭐</span>
            <span>Saved Jobs</span>
            {savedJobsCount > 0 && (
              <span className="nav-badge">{savedJobsCount}</span>
            )}
          </button>

          <button
            className={`nav-tab ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <span className="tab-icon">📊</span>
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <span className="tab-icon">👤</span>
            <span>Profile</span>
            {profileCompletion > 0 && (
              <span className="profile-pill">{profileCompletion}%</span>
            )}
          </button>
        </nav>
        <div className="navbar-user">
  <div className="navbar-user-info">
    <span className="navbar-user-icon">👤</span>

    <div>
      <strong>
        {loggedInUser?.name || "Student"}
      </strong>

      <span>
        {loggedInUser?.email || ""}
      </span>
    </div>
  </div>

  <button
    className="logout-button"
    onClick={onLogout}
    title="Logout"
  >
    🚪 Logout
  </button>
</div>
      </div>
    </header>
  );
}

export default Navbar;
