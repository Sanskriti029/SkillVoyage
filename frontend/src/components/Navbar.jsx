function Navbar({
  activeTab,
  setActiveTab,
  savedJobsCount,
  profileCompletion,
  loggedInUser,
  onLogout,
}) {
  const userName = loggedInUser?.name || "Student";

  const userInitial = userName
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Brand */}
        <button
          className="brand"
          onClick={() => setActiveTab("search")}
          aria-label="Go to InternScout search"
        >
          <div className="brand-icon-wrapper">
            <span className="brand-icon">🎯</span>
            <div className="brand-glow"></div>
          </div>

          <div className="brand-text">
            <span className="brand-title">InternScout</span>

            <span className="brand-badge">
              PRO MATCH
            </span>
          </div>
        </button>

        {/* Main Navigation */}
        <nav className="nav-links" aria-label="Main navigation">

          <button
            className={`nav-tab ${
              activeTab === "search" ? "active" : ""
            }`}
            onClick={() => setActiveTab("search")}
          >
            <span className="tab-icon">🔍</span>
            <span>Search</span>
          </button>

          <button
            className={`nav-tab ${
              activeTab === "saved" ? "active" : ""
            }`}
            onClick={() => setActiveTab("saved")}
          >
            <span className="tab-icon">⭐</span>
            <span>Saved</span>

            {savedJobsCount > 0 && (
              <span className="nav-badge">
                {savedJobsCount}
              </span>
            )}
          </button>

          <button
            className={`nav-tab ${
              activeTab === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <span className="tab-icon">📊</span>
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-tab ${
              activeTab === "profile" ? "active" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <span className="tab-icon">👤</span>
            <span>Profile</span>

            {profileCompletion > 0 && (
              <span className="profile-pill">
                {profileCompletion}%
              </span>
            )}
          </button>

        </nav>

        {/* Live Data + User */}
        <div className="navbar-right">

          <div className="live-data-indicator">
            <span className="live-dot"></span>
            <span>LIVE DATA</span>
          </div>

          <div className="navbar-user">

            <div className="navbar-user-info">

              <span className="navbar-user-avatar">
                {userInitial}
              </span>

              <div className="navbar-user-details">
                <strong>{userName}</strong>

                <span>
                  {loggedInUser?.email || "Student account"}
                </span>
              </div>

            </div>

            <button
              className="logout-button"
              onClick={onLogout}
              title="Logout"
            >
              <span>↪</span>
              <span>Logout</span>
            </button>

          </div>

        </div>

      </div>
    </header>
  );
}

export default Navbar;