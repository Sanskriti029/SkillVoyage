import skillRoadmaps from "../data/skillRoadmaps";

function JobCard({
  job,
  profile,
  savedJobs,
  toggleSaveJob,
  setSelectedJob,
  calculateJobMatch,
}) {
  const match = calculateJobMatch(job.description, profile.skills);

  return (
    <div className="job-card">
      <h3>{job.title}</h3>

      <h4>{job.company}</h4>

      {job.is_internship && (
        <span className="internship-badge">
          🎓 Internship
        </span>
      )}

      {/* Skill Match */}
      <div className="match-summary">
        <div className="match-score">
          <span className="match-percentage">
            {match.matchPercentage}%
          </span>

          <span className="match-label">
            Skill Match
          </span>
        </div>

        <div className="match-explanation">
          {match.matchedSkills.length > 0 && (
            <div className="skill-section">
              <h4>✅ Skills you have</h4>

              <div className="skill-tags">
                {match.matchedSkills.map((skill) => (
                  <span
                    className="skill-tag matched"
                    key={skill}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {match.missingSkills.length > 0 && (
            <div className="skill-section">
              <h4>❌ Skills to improve</h4>

              <div className="skill-tags">
                {match.missingSkills.map((skill) => (
                  <span
                    className="skill-tag missing"
                    key={skill}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {match.matchedSkills.length === 0 &&
            match.missingSkills.length === 0 && (
              <p className="no-skill-data">
                Not enough skill information available for this job.
              </p>
            )}
        </div>
      </div>

      {/* Why you match */}
      <div className="why-match-section">
        <div className="why-match-heading">
          <strong>💡 Why you match this job</strong>

          <span>
            Based on the skills detected in this job description.
          </span>
        </div>

        {match.matchedSkills.length > 0 ? (
          <div className="why-match-content">
            <p>
              Your profile matches this job because you already have{" "}
              <strong>{match.matchedSkills.length}</strong>{" "}
              relevant skill
              {match.matchedSkills.length !== 1 ? "s" : ""}.
            </p>

            <div className="why-match-skills">
              {match.matchedSkills.map((skill) => (
                <span
                  className="why-match-skill"
                  key={skill}
                >
                  ✓ {skill}
                </span>
              ))}
            </div>

            {match.missingSkills.length > 0 && (
              <p className="why-match-gap">
                You can improve your fit further by working on{" "}
                <strong>{match.missingSkills.length}</strong>{" "}
                missing skill
                {match.missingSkills.length !== 1 ? "s" : ""}.
              </p>
            )}
          </div>
        ) : (
          <div className="why-match-empty">
            No specific skill overlap was detected from the available
            job description.
          </div>
        )}
      </div>

      {/* Preparation Plan */}
      {match.missingSkills.length > 0 && (
        <div className="roadmap-section">
          <div className="roadmap-heading">
            <strong>📚 Your Preparation Plan</strong>

            <span>
              Build these missing skills to improve your match for this
              job.
            </span>
          </div>

          {/* Overall preparation summary */}
          <div className="preparation-summary">
            <div className="preparation-summary-header">
              <div>
                <h4>🎯 Job-Specific Skill Plan</h4>

                <p>
                  You are currently missing{" "}
                  <strong>{match.missingSkills.length}</strong>{" "}
                  skill
                  {match.missingSkills.length !== 1 ? "s" : ""} detected
                  from this job description.
                </p>
              </div>

              <div className="preparation-count">
                {match.missingSkills.length}
                <span>skills</span>
              </div>
            </div>

            <div className="preparation-priority-list">
              {match.missingSkills.map((skill, index) => {
                const roadmap = skillRoadmaps[skill];

                if (!roadmap) {
                  return null;
                }

                return (
                  <div
                    className="preparation-priority"
                    key={skill}
                  >
                    <div className="priority-number">
                      {index + 1}
                    </div>

                    <div className="priority-content">
                      <strong>{roadmap.title}</strong>

                      <span>
                        {roadmap.learn.slice(0, 3).join(" → ")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="preparation-next-step">
              💡 <strong>Recommended next step:</strong>{" "}
              Start with{" "}
              {skillRoadmaps[match.missingSkills[0]]?.title ||
                match.missingSkills[0]}
              .
            </div>
          </div>

          {/* Detailed roadmap */}
          {match.missingSkills.map((skill) => {
            const roadmap = skillRoadmaps[skill];

            if (!roadmap) {
              return null;
            }

            return (
              <div
                className="roadmap-card"
                key={skill}
              >
                <div className="roadmap-card-header">
                  <h5>🎯 {roadmap.title}</h5>

                  <span className="roadmap-badge">
                    Skill Gap
                  </span>
                </div>

                <p className="roadmap-label">
                  📖 Learn these topics
                </p>

                <ol className="roadmap-list">
                  {roadmap.learn.map((item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  ))}
                </ol>

                <div className="roadmap-practice-box">
                  <strong>💻 Practice:</strong>

                  <span>{roadmap.practice}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Description */}
      <p className="description">
        {job.description
          ? job.description.substring(0, 250) + "..."
          : "No description available."}
      </p>

      {/* Actions */}
      <div className="job-actions">
        <button
          className="view-details-button"
          onClick={() => setSelectedJob(job)}
        >
          View Details
        </button>

        {job.apply_options?.[0]?.link && (
          <a
            className="apply-button"
            href={job.apply_options[0].link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply Now ↗
          </a>
        )}

        <button
          className="save-job-button"
          onClick={() => toggleSaveJob(job)}
        >
          {savedJobs.some(
            (savedJob) => savedJob.job_id === job.job_id
          )
            ? "★ Saved"
            : "☆ Save Job"}
        </button>
      </div>
    </div>
  );
}

export default JobCard;