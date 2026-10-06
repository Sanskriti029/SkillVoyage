import React, { useState } from "react";
import skillRoadmaps from "../data/skillRoadmaps";
import { calculateOpportunityScore } from "../utils/jobmatching";

function JobDetailsModal({
  selectedJob,
  profile,
  setSelectedJob,
  calculateJobMatch,
  onOpenPitch,
  onOpenInterview,
}) {
  const [modalTab, setModalTab] = useState("overview");

  if (!selectedJob) return null;

  const match = calculateJobMatch(
    selectedJob.description || "",
    profile.skills
  );
  const oppScore = calculateOpportunityScore(selectedJob, profile);

  const getScoreTier = (score) => {
    if (score >= 80) return "score-excellent";
    if (score >= 60) return "score-good";
    if (score >= 40) return "score-fair";
    return "score-poor";
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => setSelectedJob(null)}
    >
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE */}
        <button
          className="modal-close-btn"
          onClick={() => setSelectedJob(null)}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* HEADER */}
        <div className="modal-header">
          <div className="modal-badge-row">
            <span className="modal-type-badge">
              💼 Internship Opportunity
            </span>

            {selectedJob.via && (
              <span className="modal-via-badge">
                via {selectedJob.via}
              </span>
            )}
          </div>

          <h2 className="modal-job-title">
            {selectedJob.title || "Job Title"}
          </h2>

          <div className="modal-meta-row">
            <span className="modal-company">
              🏢{" "}
              {selectedJob.company_name ||
                selectedJob.company ||
                "Company not specified"}
            </span>

            <span className="modal-location">
              📍{" "}
              {selectedJob.location ||
                "Location not specified"}
            </span>
          </div>
        </div>

        {/* TABS */}
        <div className="modal-tabs">
          <button
            className={`modal-tab-btn ${
              modalTab === "overview" ? "active" : ""
            }`}
            onClick={() => setModalTab("overview")}
          >
            📊 Match Overview
          </button>

          <button
            className={`modal-tab-btn ${
              modalTab === "roadmap" ? "active" : ""
            }`}
            onClick={() => setModalTab("roadmap")}
          >
            📚 Skill Roadmap (
            {match.missingSkills.length})
          </button>

          <button
            className={`modal-tab-btn ${
              modalTab === "description" ? "active" : ""
            }`}
            onClick={() => setModalTab("description")}
          >
            📝 Job Description
          </button>
        </div>

        {/* BODY */}
        <div className="modal-body">

          {/* ========================= */}
          {/* OVERVIEW */}
          {/* ========================= */}

          {modalTab === "overview" && (
            <div className="modal-tab-content">
<<<<<<< HEAD

              <div className="modal-match-card">
                <div className="modal-match-circle">

                  {match.hasEnoughSkillInformation ? (
                    <>
                      <span className="circle-pct">
                        {match.matchPercentage}%
                      </span>

                      <span className="circle-lbl">
                        Match
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="circle-warning">
                        ⚠️
                      </span>

                      <span className="circle-lbl">
                        Unavailable
                      </span>
                    </>
                  )}

=======
              <div className="modal-opportunity-score-card">
                <div className={`modal-score-circle ${getScoreTier(oppScore.totalScore)}`}>
                  <span className="circle-pct">{oppScore.totalScore}%</span>
                  <span className="circle-lbl">Opportunity<br/>Score</span>
                </div>
                <div className="modal-score-detail">
                  <h4>Complete Candidate-Opportunity Fit</h4>
                  <p>
                    This composite score evaluates your overall suitability for this role,
                    combining skill match, role alignment, location preference, and internship fit.
                  </p>
                </div>
              </div>

              <div className="modal-score-breakdown">
                <h4>Score Breakdown</h4>
                <div className="breakdown-grid">
                  {Object.entries(oppScore.breakdown).map(([key, val]) => (
                    <div key={key} className="breakdown-cell">
                      <span className="breakdown-name">{key}</span>
                      <div className="breakdown-bar-container">
                        <div
                          className="breakdown-bar"
                          style={{ width: `${val.score}%` }}
                        ></div>
                      </div>
                      <span className="breakdown-pct">{val.score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-match-card">
                <div className="modal-match-circle">
                  <span className="circle-pct">{match.matchPercentage}%</span>
                  <span className="circle-lbl">Skill<br/>Match</span>
>>>>>>> 4728459e34712b4fbc745a178e8cfb9c2bfaaaa7
                </div>

                <div className="modal-match-detail">
                  <h4>
                    Candidate Profile Alignment
                  </h4>

                  <p>
                    {!match.hasEnoughSkillInformation ? (
                      <>
                        ⚠️ This job description does not
                        mention enough specific technical
                        or professional skills to calculate
                        a reliable match percentage.
                        Review the full job description
                        before judging your fit.
                      </>
                    ) : match.matchedSkills.length > 0 ? (
                      `Your profile matches ${
                        match.matchedSkills.length
                      } required skill${
                        match.matchedSkills.length !== 1
                          ? "s"
                          : ""
                      } detected in this job listing.`
                    ) : (
                      "This opportunity requires skills that are not currently listed in your profile. Check the roadmap tab to build your fit."
                    )}
                  </p>
                </div>
              </div>

              {/* MATCHED SKILLS */}
              {match.hasEnoughSkillInformation &&
                match.matchedSkills.length > 0 && (
                  <div className="modal-section">
                    <h3>
                      ✅ Matching Skills in Profile
                    </h3>

                    <div className="modal-chip-grid">
                      {match.matchedSkills.map((sk) => (
                        <span
                          key={sk}
                          className="modal-chip matched"
                        >
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* MISSING SKILLS */}
              {match.hasEnoughSkillInformation &&
                match.missingSkills.length > 0 && (
                  <div className="modal-section">
                    <h3>
                      ⚠️ Target Skill Gaps
                    </h3>

                    <p className="modal-section-hint">
                      Acquiring these skills will improve
                      your candidacy for this role:
                    </p>

                    <div className="modal-chip-grid">
                      {match.missingSkills.map((sk) => (
                        <span
                          key={sk}
                          className="modal-chip missing"
                        >
                          + {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

            </div>
          )}

          {/* ========================= */}
          {/* ROADMAP */}
          {/* ========================= */}

          {modalTab === "roadmap" && (
            <div className="modal-tab-content">

              {!match.hasEnoughSkillInformation ? (
                <div className="roadmap-perfect-state">
                  <span className="star-icon">
                    ⚠️
                  </span>

                  <h4>
                    Not enough skill information
                  </h4>

                  <p>
                    This job description does not
                    contain enough clearly identifiable
                    skills to generate a reliable
                    skill-gap roadmap.
                  </p>
                </div>

              ) : match.missingSkills.length === 0 ? (

                <div className="roadmap-perfect-state">
                  <span className="star-icon">
                    🌟
                  </span>

                  <h4>
                    You match all detected skills!
                  </h4>

                  <p>
                    You have all key skills detected
                    for this position. Submit your
                    application now.
                  </p>
                </div>

              ) : (

                <div className="modal-roadmap-list">
                  {match.missingSkills.map((sk) => {
                    const roadmap =
                      skillRoadmaps[sk];

                    if (!roadmap) return null;

                    return (
                      <div
                        key={sk}
                        className="modal-roadmap-card"
                      >
                        <div className="modal-roadmap-head">
                          <h4>
                            🎯 {roadmap.title} Roadmap
                          </h4>

                          <span className="skill-gap-tag">
                            Skill Gap
                          </span>
                        </div>

                        <div className="modal-roadmap-learn">
                          <strong>
                            Topics to Master:
                          </strong>

                          <ul>
                            {roadmap.learn.map(
                              (item, i) => (
                                <li key={i}>
                                  {item}
                                </li>
                              )
                            )}
                          </ul>
                        </div>

                        <div className="modal-roadmap-practice">
                          <strong>
                            💻 Recommended Hands-on
                            Project:
                          </strong>

                          <p>
                            {roadmap.practice}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* ========================= */}
          {/* DESCRIPTION */}
          {/* ========================= */}

          {modalTab === "description" && (
            <div className="modal-tab-content">
              <div className="job-description-box">
                <p className="description-text">
                  {selectedJob.description ||
                    "No full description provided for this job listing."}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="modal-footer">

          <button
            className="btn-secondary"
            onClick={() => {
              setSelectedJob(null);

              if (onOpenPitch) {
                onOpenPitch(selectedJob);
              }
            }}
          >
            ✉️ AI Pitch
          </button>

          <button
            className="btn-secondary"
            onClick={() => {
              setSelectedJob(null);

              if (onOpenInterview) {
                onOpenInterview(selectedJob);
              }
            }}
          >
            🎙️ Practice Interview
          </button>

          {selectedJob.apply_options?.[0]?.link && (
            <a
              className="btn-primary large"
              href={
                selectedJob.apply_options[0].link
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply Now ↗
            </a>
          )}

        </div>
      </div>
    </div>
  );
}

export default JobDetailsModal;