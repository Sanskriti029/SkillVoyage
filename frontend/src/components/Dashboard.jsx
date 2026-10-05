import React from "react";

function Dashboard({ profile, savedJobs, setActiveTab, setSelectedJob }) {
  const profileFields = [
    profile.name,
    profile.degree,
    profile.branch,
    profile.year,
    profile.skills,
    profile.preferredRole,
    profile.preferredLocation,
  ];

  const completedFields = profileFields.filter(
    (field) => field && field.trim() !== ""
  ).length;

  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100
  );

  const averageMatch =
    savedJobs.length > 0
      ? Math.round(
          savedJobs.reduce(
            (total, job) => total + (job.matchPercentage || 0),
            0
          ) / savedJobs.length
        )
      : 0;

  const skillsCount = (profile.skills || "")
    .split(",")
    .filter((s) => s.trim().length > 0).length;

  return (
    <section className="dashboard-container">
      {/* Dashboard Banner */}
      <div className="dashboard-hero">
        <div>
          <h1>📊 Internship Search Analytics</h1>
          <p>
            Monitor your career progress, saved opportunities, and skill gap roadmaps in one central hub.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setActiveTab("search")}
        >
          🔍 Search More Jobs
        </button>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-bg purple">👤</div>
          <div className="metric-content">
            <span className="metric-title">Profile Completeness</span>
            <div className="metric-value">{profileCompletion}%</div>
            <div className="metric-sub">
              {profileCompletion === 100
                ? "✨ Full Match Profile Active"
                : `${7 - completedFields} fields remaining`}
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-bg amber">⭐</div>
          <div className="metric-content">
            <span className="metric-title">Saved Opportunities</span>
            <div className="metric-value">{savedJobs.length}</div>
            <div className="metric-sub">Bookmarked for application</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-bg green">🎯</div>
          <div className="metric-content">
            <span className="metric-title">Average Skill Match</span>
            <div className="metric-value">{averageMatch}%</div>
            <div className="metric-sub">Across your saved opportunities</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-bg blue">⚡</div>
          <div className="metric-content">
            <span className="metric-title">Skills Profiled</span>
            <div className="metric-value">{skillsCount}</div>
            <div className="metric-sub">Active skill tags</div>
          </div>
        </div>
      </div>

      {/* Grid Section: Profile Matrix & Saved Jobs */}
      <div className="dashboard-two-col">
        {/* Left Column: Student Overview */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>👤 Student Overview</h3>
            <button
              className="panel-link"
              onClick={() => setActiveTab("profile")}
            >
              Edit Profile →
            </button>
          </div>

          <div className="overview-list">
            <div className="overview-row">
              <span className="overview-label">Name</span>
              <strong className="overview-val">{profile.name || "Not provided"}</strong>
            </div>
            <div className="overview-row">
              <span className="overview-label">Degree & Branch</span>
              <strong className="overview-val">
                {profile.degree || profile.branch
                  ? `${profile.degree || ""} ${profile.branch ? `(${profile.branch})` : ""}`
                  : "Not provided"}
              </strong>
            </div>
            <div className="overview-row">
              <span className="overview-label">Year</span>
              <strong className="overview-val">{profile.year || "Not provided"}</strong>
            </div>
            <div className="overview-row">
              <span className="overview-label">Target Role</span>
              <strong className="overview-val">{profile.preferredRole || "Not provided"}</strong>
            </div>
            <div className="overview-row">
              <span className="overview-label">Target Location</span>
              <strong className="overview-val">{profile.preferredLocation || "Not provided"}</strong>
            </div>
            <div className="overview-row vertical">
              <span className="overview-label">Registered Skills</span>
              <div className="overview-skills">
                {skillsCount > 0 ? (
                  profile.skills.split(",").map((sk) => (
                    <span key={sk} className="overview-skill-chip">
                      {sk.trim()}
                    </span>
                  ))
                ) : (
                  <span className="empty-text">No skills listed yet</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Saved Opportunities */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>⭐ Saved Internships</h3>
            {savedJobs.length > 0 && (
              <button
                className="panel-link"
                onClick={() => setActiveTab("saved")}
              >
                View All ({savedJobs.length}) →
              </button>
            )}
          </div>

          {savedJobs.length === 0 ? (
            <div className="dashboard-empty-state">
              <span className="empty-icon">📁</span>
              <h4>No Saved Jobs Yet</h4>
              <p>
                Browse internships and click the star icon to save opportunities here for easy tracking.
              </p>
              <button
                className="btn-secondary"
                onClick={() => setActiveTab("search")}
              >
                Explore Opportunities
              </button>
            </div>
          ) : (
            <div className="dashboard-saved-list">
              {savedJobs.slice(0, 5).map((job, idx) => (
                <div key={job.job_id || idx} className="dashboard-saved-item">
                  <div className="saved-item-info">
                    <h4 onClick={() => setSelectedJob(job)}>
                      {job.title || "Untitled Job"}
                    </h4>
                    <p>{job.company || "Company not specified"}</p>
                    <span className="saved-item-loc">
                      📍 {job.location || "Location not specified"}
                    </span>
                  </div>

                  <div className="saved-item-action">
                    <span className="saved-match-pill">
                      {job.matchPercentage || 0}% match
                    </span>
                    <button
                      className="btn-sm"
                      onClick={() => setSelectedJob(job)}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;