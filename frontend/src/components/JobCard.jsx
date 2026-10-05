import React, { useState } from "react";
import skillRoadmaps from "../data/skillRoadmaps";

function JobCard({
  job,
  profile,
  savedJobs,
  toggleSaveJob,
  setSelectedJob,
  calculateJobMatch,
  onOpenPitch,
  onOpenInterview,
}) {
  const [showRoadmap, setShowRoadmap] = useState(false);

  const match = calculateJobMatch(job.description, profile.skills);
  const isSaved = savedJobs.some((savedJob) => savedJob.job_id === job.job_id);

  const getMatchTier = (pct) => {
    if (pct >= 75) return "high-match";
    if (pct >= 40) return "medium-match";
    return "low-match";
  };

  const getAvatarGradient = (name = "") => {
    const charCode = name.charCodeAt(0) || 65;
    const gradients = [
      "linear-gradient(135deg, #6366F1, #8B5CF6)",
      "linear-gradient(135deg, #3B82F6, #1D4ED8)",
      "linear-gradient(135deg, #10B981, #059669)",
      "linear-gradient(135deg, #F59E0B, #D97706)",
      "linear-gradient(135deg, #EC4899, #8B5CF6)",
    ];
    return gradients[charCode % gradients.length];
  };

  const companyInitial = (job.company || "C").charAt(0).toUpperCase();

  return (
    <div className="modern-job-card">
      <div className="job-card-header">
        <div className="company-branding">
          <div
            className="company-avatar"
            style={{ background: getAvatarGradient(job.company) }}
          >
            {companyInitial}
          </div>
          <div className="company-meta">
            <h3 className="job-title" onClick={() => setSelectedJob(job)}>
              {job.title}
            </h3>
            <div className="company-sub">
              <span className="company-name">{job.company || "Tech Company"}</span>
              {job.location && (
                <span className="job-location">📍 {job.location}</span>
              )}
            </div>
          </div>
        </div>

        <button
          className={`bookmark-btn ${isSaved ? "saved" : ""}`}
          onClick={() => toggleSaveJob(job)}
          title={isSaved ? "Remove from saved" : "Save this job"}
          aria-label={isSaved ? "Saved" : "Save"}
        >
          {isSaved ? "★" : "☆"}
        </button>
      </div>

      <div className="badges-row">
        {job.is_internship && (
          <span className="internship-badge">🎓 Internship</span>
        )}
        {job.via && <span className="via-badge">via {job.via}</span>}
      </div>

      <div className={`match-banner ${getMatchTier(match.matchPercentage)}`}>
        <div className="match-score-badge">
          <div className="match-number">{match.matchPercentage}%</div>
          <div className="match-label">Skill Match</div>
        </div>

        <div className="match-skills-preview">
          {match.matchedSkills.length > 0 && (
            <div className="skill-chip-group">
              <span className="chip-group-label">Matched:</span>
              {match.matchedSkills.slice(0, 3).map((skill) => (
                <span key={skill} className="skill-chip matched">
                  ✓ {skill}
                </span>
              ))}
              {match.matchedSkills.length > 3 && (
                <span className="skill-chip-more">
                  +{match.matchedSkills.length - 3} more
                </span>
              )}
            </div>
          )}

          {match.missingSkills.length > 0 && (
            <div className="skill-chip-group">
              <span className="chip-group-label">To Learn:</span>
              {match.missingSkills.slice(0, 3).map((skill) => (
                <span key={skill} className="skill-chip missing">
                  {skill}
                </span>
              ))}
              {match.missingSkills.length > 3 && (
                <span className="skill-chip-more">
                  +{match.missingSkills.length - 3} more
                </span>
              )}
            </div>
          )}

          {match.matchedSkills.length === 0 && match.missingSkills.length === 0 && (
            <span className="no-skill-text">
              General internship — skills extracted from details.
            </span>
          )}
        </div>
      </div>

      <p className="job-description-snippet">
        {job.description
          ? job.description.length > 180
            ? `${job.description.substring(0, 180)}...`
            : job.description
          : "No detailed description available for this position."}
      </p>

      {/* Quick AI Action Tools */}
      <div className="ai-tools-row">
        <button
          className="btn-ai-tool"
          onClick={() => onOpenPitch && onOpenPitch(job)}
          title="Generate 1-Click Cold Email / Application Pitch"
        >
          ✉️ Pitch
        </button>
        <button
          className="btn-ai-tool"
          onClick={() => onOpenInterview && onOpenInterview(job)}
          title="Practice Job-Specific AI Interview"
        >
          🎙️ Practice
        </button>
      </div>

      {match.missingSkills.length > 0 && (
        <div className="roadmap-toggle-section">
          <button
            className="roadmap-toggle-btn"
            onClick={() => setShowRoadmap(!showRoadmap)}
          >
            <span>
              📚 {match.missingSkills.length} Skill Gap{match.missingSkills.length !== 1 ? "s" : ""} Preparation Plan
            </span>
            <span className={`chevron ${showRoadmap ? "open" : ""}`}>▾</span>
          </button>

          {showRoadmap && (
            <div className="roadmap-drawer">
              {match.missingSkills.map((skill) => {
                const roadmap = skillRoadmaps[skill];
                if (!roadmap) return null;

                return (
                  <div key={skill} className="drawer-roadmap-item">
                    <div className="drawer-item-header">
                      <span className="drawer-skill-title">🎯 {roadmap.title}</span>
                      <span className="drawer-badge">Recommended</span>
                    </div>
                    <ul className="drawer-topics">
                      {roadmap.learn.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                    <div className="drawer-practice">
                      💡 <strong>Practice:</strong> {roadmap.practice}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="job-card-actions">
        <button
          className="btn-secondary"
          onClick={() => setSelectedJob(job)}
        >
          View Details
        </button>

        {job.apply_options?.[0]?.link ? (
          <a
            className="btn-primary"
            href={job.apply_options[0].link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply Now ↗
          </a>
        ) : (
          <button
            className="btn-primary"
            onClick={() => setSelectedJob(job)}
          >
            Read & Apply
          </button>
        )}
      </div>
    </div>
  );
}

export default JobCard;