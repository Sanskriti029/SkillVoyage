import React, { useState } from "react";
// import ResumeUploadModal from "./ResumeUploadModal";

function ProfileForm({ profile, updateProfile, setProfile }) {
  // const [showResumeModal, setShowResumeModal] = useState(false);

  const recommendedSkills = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "React",
    "Node.js",
    "HTML",
    "CSS",
    "SQL",
    "Git",
    "Docker",
    "AWS",
    "Data Structures",
    "Algorithms",
    "Machine Learning",
  ];

  const fields = [
    profile.name,
    profile.degree,
    profile.branch,
    profile.year,
    profile.skills,
    profile.preferredRole,
    profile.preferredLocation,
  ];
  const filledCount = fields.filter((f) => f && f.trim() !== "").length;
  const completionPercentage = Math.round((filledCount / fields.length) * 100);

  const currentSkillsArray = (profile.skills || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const toggleRecommendedSkill = (skill) => {
    const skillLower = skill.toLowerCase();
    let updated;
    if (currentSkillsArray.includes(skillLower)) {
      updated = (profile.skills || "")
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.toLowerCase() !== skillLower)
        .join(", ");
    } else {
      const existing = profile.skills ? profile.skills.trim() : "";
      updated = existing
        ? existing.endsWith(",")
          ? `${existing} ${skill}`
          : `${existing}, ${skill}`
        : skill;
    }
    updateProfile("skills", updated);
  };

  return (
    <section className="profile-card-container">
      <div className="profile-card-header">
        <div className="header-title-group">
          <h2>👤 Student Profile & Skill Matrix</h2>
          <p>
            Your skills power the AI match calculator. Keep your profile up to date for precise match scores.
          </p>
        </div>

        <div className="profile-header-actions">
          {/* <button
            type="button"
            className="btn-primary"
            onClick={() => setShowResumeModal(true)}
          >
            ⚡ AI Resume Import
          </button> */}

          <div className="completion-widget">
            <div className="completion-info">
              <span>Completeness</span>
              <strong>{completionPercentage}%</strong>
            </div>
            <div className="progress-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-form-grid">
        <div className="form-field">
          <label>Full Name</label>
          <input
            type="text"
            value={profile.name || ""}
            onChange={(e) => updateProfile("name", e.target.value)}
            placeholder="e.g. Alex Johnson"
          />
        </div>

        <div className="form-field">
          <label>Degree / Major</label>
          <input
            type="text"
            value={profile.degree || ""}
            onChange={(e) => updateProfile("degree", e.target.value)}
            placeholder="e.g. B.Tech Computer Science"
          />
        </div>

        <div className="form-field">
          <label>Specialization / Branch</label>
          <input
            type="text"
            value={profile.branch || ""}
            onChange={(e) => updateProfile("branch", e.target.value)}
            placeholder="e.g. Artificial Intelligence, Software Engineering"
          />
        </div>

        <div className="form-field">
          <label>Graduation / Current Year</label>
          <select
            value={profile.year || ""}
            onChange={(e) => updateProfile("year", e.target.value)}
          >
            <option value="">Select Year</option>
            <option value="1st Year">1st Year (Freshman)</option>
            <option value="2nd Year">2nd Year (Sophomore)</option>
            <option value="3rd Year">3rd Year (Junior)</option>
            <option value="4th Year">4th Year (Senior)</option>
          </select>
        </div>

        <div className="form-field full-width">
          <label>Your Technical & Soft Skills</label>
          <textarea
            className="skills-textarea"
            rows="2"
            value={profile.skills || ""}
            onChange={(e) => updateProfile("skills", e.target.value)}
            placeholder="e.g. Python, React, JavaScript, SQL, HTML, Git"
          />
          <small className="field-hint">
            💡 Separate skills with commas. Click recommended skills below to add or remove them instantly.
          </small>

          <div className="skill-selector-box">
            <span className="skill-selector-title">⚡ Quick Skill Toggles:</span>
            <div className="skill-chips-container">
              {recommendedSkills.map((skill) => {
                const isSelected = currentSkillsArray.includes(skill.toLowerCase());
                return (
                  <button
                    key={skill}
                    type="button"
                    className={`selectable-skill-chip ${isSelected ? "selected" : ""}`}
                    onClick={() => toggleRecommendedSkill(skill)}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="form-field">
          <label>Target Internship Role</label>
          <input
            type="text"
            value={profile.preferredRole || ""}
            onChange={(e) => updateProfile("preferredRole", e.target.value)}
            placeholder="e.g. Software Engineer Intern"
          />
        </div>

        <div className="form-field">
          <label>Target Work Location</label>
          <input
            type="text"
            value={profile.preferredLocation || ""}
            onChange={(e) => updateProfile("preferredLocation", e.target.value)}
            placeholder="e.g. Bangalore, Remote, India"
          />
        </div>
      </div>

      {/* {showResumeModal && (
        <ResumeUploadModal
          profile={profile}
          setProfile={setProfile}
          onClose={() => setShowResumeModal(false)}
        />
      )} */}
    </section>
  );
}

export default ProfileForm;