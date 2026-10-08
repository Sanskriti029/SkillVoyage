
import React from "react";
import { calculateJobMatch } from "../utils/jobMatching";

function Dashboard({
  profile,
  savedJobs = [],
  setActiveTab,
  setSelectedJob,
}) {
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
    (field) => field && String(field).trim() !== ""
  ).length;

  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100
  );

  const studentSkills = profile.skills || "";

  const skillsCount = studentSkills
    .split(",")
    .filter((skill) => skill.trim().length > 0).length;

  // Calculate match scores using the current student profile.
  const evaluatedJobs = savedJobs.map((job) => {
    const match = calculateJobMatch(
      job.description || job.snippet || "",
      studentSkills
    );

    return { ...job, currentMatch: match };
  });

  // Exclude jobs without enough information for a reliable match score.
  const jobsWithReliableMatches = evaluatedJobs.filter(
    (job) => job.currentMatch.hasEnoughSkillInformation
  );

  const averageMatch =
    jobsWithReliableMatches.length > 0
      ? Math.round(
          jobsWithReliableMatches.reduce(
            (total, job) => total + job.currentMatch.matchPercentage,
            0
          ) / jobsWithReliableMatches.length
        )
      : null;

  // Count how many saved opportunities need each missing skill.
  const skillGapCounts = {};

  evaluatedJobs.forEach((job) => {
    job.currentMatch.missingSkills.forEach((skill) => {
      skillGapCounts[skill] = (skillGapCounts[skill] || 0) + 1;
    });
  });

  const topMissingSkills = Object.entries(skillGapCounts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8);

  return (
    <section className="dashboard-container">
      {/* Dashboard heading */}
      <div className="dashboard-header">
        <div>
          <div className="dashboard-eyebrow">
            <span />
            YOUR CAREER SNAPSHOT
          </div>

          <h1>Student Dashboard</h1>

          <p>
            Track your job matches, saved opportunities, and skills to improve.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => setActiveTab("search")}
        >
          🔍 Search More Jobs
        </button>
      </div>

      {/* Career snapshot */}
      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">🎯</div>
          <div>
            <span>Average Match</span>
            <strong>
              {averageMatch === null ? "—" : `${averageMatch}%`}
            </strong>
            <small>
              {averageMatch === null
                ? "Not enough job description data"
                : `Across ${jobsWithReliableMatches.length} saved jobs`}
            </small>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">💼</div>
          <div>
            <span>Saved Jobs</span>
            <strong>{savedJobs.length}</strong>
            <small>Opportunities bookmarked</small>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">📚</div>
          <div>
            <span>Skills Profiled</span>
            <strong>{skillsCount}</strong>
            <small>Skills in your profile</small>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">📈</div>
          <div>
            <span>Profile Complete</span>
            <strong>{profileCompletion}%</strong>
            <small>
              {profileFields.length - completedFields} fields remaining
            </small>
          </div>
        </div>
      </div>

      {/* Existing analytics banner */}
      <div className="dashboard-hero">
        <div>
          <h2>📊 Internship Search Analytics</h2>
          <p>
            Review your profile, explore saved opportunities, and identify
            skills worth learning next.
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={() => setActiveTab("profile")}
        >
          👤 Update Profile
        </button>
      </div>

      {/* Student profile and saved opportunities */}
      <div className="dashboard-two-col">
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
              <strong className="overview-val">
                {profile.name || "Not provided"}
              </strong>
            </div>

            <div className="overview-row">
              <span className="overview-label">Degree &amp; Branch</span>
              <strong className="overview-val">
                {profile.degree || profile.branch
                  ? `${profile.degree || ""}${
                      profile.degree && profile.branch ? " " : ""
                    }${profile.branch ? `(${profile.branch})` : ""}`
                  : "Not provided"}
              </strong>
            </div>

            <div className="overview-row">
              <span className="overview-label">Year</span>
              <strong className="overview-val">
                {profile.year || "Not provided"}
              </strong>
            </div>

            <div className="overview-row">
              <span className="overview-label">Target Role</span>
              <strong className="overview-val">
                {profile.preferredRole || "Not provided"}
              </strong>
            </div>

            <div className="overview-row">
              <span className="overview-label">Target Location</span>
              <strong className="overview-val">
                {profile.preferredLocation || "Not provided"}
              </strong>
            </div>

            <div className="overview-row vertical">
              <span className="overview-label">Registered Skills</span>

              <div className="overview-skills">
                {skillsCount > 0 ? (
                  studentSkills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                    .map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="overview-skill-chip"
                      >
                        {skill}
                      </span>
                    ))
                ) : (
                  <span className="empty-text">No skills listed yet</span>
                )}
              </div>
            </div>
          </div>
        </div>

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
                Search opportunities and save promising jobs to track them here.
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
              {evaluatedJobs.slice(0, 5).map((job, index) => (
                <div
                  key={job.job_id || `${job.title}-${index}`}
                  className="dashboard-saved-item"
                >
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
                      {job.currentMatch.hasEnoughSkillInformation
                        ? `${job.currentMatch.matchPercentage}% match`
                        : "Insufficient data"}
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

      {/* Prioritized skill gaps */}
      <div className="dashboard-panel skill-gap-panel">
        <div className="panel-header">
          <div>
            <h3>📚 Your Skill Gaps</h3>
            <p className="panel-subtitle">
              Skills most frequently needed across your saved opportunities.
            </p>
          </div>

          {topMissingSkills.length > 0 && (
            <span className="skill-gap-count">
              {topMissingSkills.length} skills
            </span>
          )}
        </div>

        {topMissingSkills.length === 0 ? (
          <div className="dashboard-empty-state">
            <span className="empty-icon">🎯</span>
            <h4>No Skill Gaps to Show Yet</h4>
            <p>
              Save jobs with detailed descriptions and add your skills to your
              profile to discover learning priorities.
            </p>
            <button
              className="btn-secondary"
              onClick={() => setActiveTab("search")}
            >
              Find Opportunities
            </button>
          </div>
        ) : (
          <div className="dashboard-skill-gaps">
            {topMissingSkills.map(([skill, count]) => (
              <div key={skill} className="dashboard-skill-gap">
                <div>
                  <span className="skill-gap-icon">↑</span>
                  <strong>{skill}</strong>
                </div>

                <span className="skill-gap-label">
                  Needed in {count} {count === 1 ? "job" : "jobs"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard;