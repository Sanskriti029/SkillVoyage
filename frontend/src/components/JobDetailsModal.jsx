import skillRoadmaps from "../data/skillRoadmaps";

function JobDetailsModal({
  selectedJob,
  profile,
  setSelectedJob,
  calculateJobMatch,
}) {
  if (!selectedJob) {
    return null;
  }

  const selectedMatch = calculateJobMatch(
    selectedJob.description || "",
    profile.skills
  );

  return (
    <div
      className="job-details-overlay"
      onClick={() => setSelectedJob(null)}
    >
      <div
        className="job-details-panel"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="job-details-close"
          onClick={() => setSelectedJob(null)}
          aria-label="Close job details"
        >
          ✕
        </button>

        {/* Header */}
        <div className="job-details-header">
          <span className="job-details-type">
            💼 Job Opportunity
          </span>

          <h2>
            {selectedJob.title || "Job Title"}
          </h2>

          <p className="job-details-company">
            🏢 {selectedJob.company_name ||
              selectedJob.company ||
              "Company not specified"}
          </p>

          <p className="job-details-location">
            📍 {selectedJob.location ||
              "Location not specified"}
          </p>
        </div>

        {/* Match summary */}
        <div className="details-match-card">
          <div className="details-match-score">
            <strong>
              {selectedMatch.matchPercentage}%
            </strong>

            <span>Skill Match</span>
          </div>

          <div className="details-match-info">
            <strong>Your match for this job</strong>

            <p>
              {selectedMatch.matchedSkills.length > 0
                ? `You already match ${
                    selectedMatch.matchedSkills.length
                  } relevant skill${
                    selectedMatch.matchedSkills.length !== 1
                      ? "s"
                      : ""
                  } detected in this job.`
                : "No specific skill overlap was detected from the available job description."}
            </p>
          </div>
        </div>

        {/* Skills you have */}
        {selectedMatch.matchedSkills.length > 0 && (
          <div className="job-details-section">
            <h3>✅ Skills you have</h3>

            <div className="details-skill-list">
              {selectedMatch.matchedSkills.map((skill) => (
                <span
                  className="details-skill matched"
                  key={skill}
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skills to improve */}
        {selectedMatch.missingSkills.length > 0 && (
          <div className="job-details-section">
            <h3>⚠️ Skills to improve</h3>

            <div className="details-skill-list">
              {selectedMatch.missingSkills.map((skill) => (
                <span
                  className="details-skill missing"
                  key={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Why you match */}
        <div className="job-details-section">
          <h3>💡 Why you match</h3>

          {selectedMatch.matchedSkills.length > 0 ? (
            <p>
              Your profile matches this opportunity because you
              already have{" "}
              <strong>
                {selectedMatch.matchedSkills.join(", ")}
              </strong>
              .

              {selectedMatch.missingSkills.length > 0 && (
                <>
                  {" "}
                  You can improve your fit further by developing{" "}
                  <strong>
                    {selectedMatch.missingSkills.join(", ")}
                  </strong>
                  .
                </>
              )}
            </p>
          ) : (
            <p>
              No specific skill overlap was detected from the
              available job description.
            </p>
          )}
        </div>

        {/* Preparation plan */}
        {selectedMatch.missingSkills.length > 0 && (
          <div className="job-details-section">
            <h3>📚 Preparation Plan</h3>

            <p className="details-section-intro">
              Build these skills to improve your match for this
              opportunity.
            </p>

            <div className="details-roadmap-list">
              {selectedMatch.missingSkills.map((skill) => {
                const roadmap = skillRoadmaps[skill];

                if (!roadmap) {
                  return null;
                }

                return (
                  <div
                    className="details-roadmap-card"
                    key={skill}
                  >
                    <div className="details-roadmap-header">
                      <strong>
                        🎯 {roadmap.title}
                      </strong>

                      <span>Skill Gap</span>
                    </div>

                    <p>
                      <strong>Learn:</strong>{" "}
                      {roadmap.learn.join(" → ")}
                    </p>

                    <div className="details-practice">
                      <strong>💻 Practice:</strong>{" "}
                      {roadmap.practice}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Job description */}
        <div className="job-details-section">
          <h3>📝 Job Description</h3>

          <p className="job-description-full">
            {selectedJob.description ||
              "No detailed job description is available for this opportunity."}
          </p>
        </div>

        {/* Actions */}
        <div className="job-details-actions">
          {selectedJob.apply_options?.[0]?.link && (
            <a
              className="apply-button large"
              href={selectedJob.apply_options[0].link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply Now ↗
            </a>
          )}

          <button
            className="secondary-button"
            onClick={() => setSelectedJob(null)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobDetailsModal;