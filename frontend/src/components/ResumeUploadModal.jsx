import React, { useState, useRef } from "react";
import { parseResumeText } from "../utils/resumeParser";
import { parseResumeApi } from "../utils/jobApi";

function ResumeUploadModal({ profile, setProfile, updateProfile, onClose }) {
  const [activeMode, setActiveMode] = useState("file"); // 'file' | 'text'
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [extractedData, setExtractedData] = useState(null);
  const [editableFields, setEditableFields] = useState({
    name: "",
    degree: "",
    branch: "",
    year: "",
    preferredRole: "",
    preferredLocation: "",
    skillsList: [],
  });

  const [mergeSkills, setMergeSkills] = useState(true);
  const fileInputRef = useRef(null);

  // File Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    setErrorMessage("");
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ];

    const fileExt = file.name.split(".").pop().toLowerCase();
    const isValidExt = ["pdf", "docx", "doc", "txt"].includes(fileExt);

    if (!validTypes.includes(file.type) && !isValidExt) {
      setErrorMessage("Please upload a PDF (.pdf), Word (.docx), or Text (.txt) document.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File size exceeds 10MB limit.");
      return;
    }

    setSelectedFile(file);
    setExtractedData(null);
  };

  // Process and Extract Data
  const handleParse = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      let parsed = null;

      if (activeMode === "file") {
        if (!selectedFile) {
          setErrorMessage("Please select a resume file to upload.");
          setLoading(false);
          return;
        }

        // Check if text file - can read directly client-side if needed
        if (selectedFile.name.endsWith(".txt")) {
          const textContent = await selectedFile.text();
          parsed = parseResumeText(textContent);
        } else {
          try {
            // Try backend Flask parsing endpoint
            const res = await parseResumeApi({ file: selectedFile });
            if (res.extracted) {
              parsed = res.extracted;
            }
          } catch (apiErr) {
            console.warn("Backend parse failed, attempting local fallback:", apiErr);
            // Fallback: if browser can read text or if backend offline
            const textContent = await selectedFile.text().catch(() => "");
            if (textContent) {
              parsed = parseResumeText(textContent);
            } else {
              throw new Error("Could not extract text from document. Ensure backend is running or upload text/PDF.");
            }
          }
        }
      } else {
        // Text mode
        if (!resumeText.trim()) {
          setErrorMessage("Please paste your resume text before parsing.");
          setLoading(false);
          return;
        }

        try {
          const res = await parseResumeApi({ text: resumeText });
          if (res.extracted) {
            parsed = res.extracted;
          }
        } catch (apiErr) {
          console.warn("Backend parse failed, using client parser:", apiErr);
          parsed = parseResumeText(resumeText);
        }
      }

      if (!parsed) {
        throw new Error("Failed to extract data from resume.");
      }

      setExtractedData(parsed);

      // Pre-fill editable fields
      setEditableFields({
        name: parsed.name || profile.name || "",
        degree: parsed.degree || profile.degree || "",
        branch: parsed.branch || profile.branch || "",
        year: parsed.year || profile.year || "",
        preferredRole: parsed.preferredRole || profile.preferredRole || "",
        preferredLocation: parsed.preferredLocation || profile.preferredLocation || "",
        skillsList: parsed.skillsList || (parsed.skills ? parsed.skills.split(", ").map(s => s.trim()) : []),
      });

      setSuccessMessage("Resume extracted successfully! Review and edit the parsed data below.");

    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Failed to process resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Skill management in extracted view
  const handleRemoveSkill = (skillToRemove) => {
    setEditableFields((prev) => ({
      ...prev,
      skillsList: prev.skillsList.filter((s) => s !== skillToRemove),
    }));
  };

  const handleAddSkill = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const newSkill = e.target.value.trim();
      if (!editableFields.skillsList.includes(newSkill)) {
        setEditableFields((prev) => ({
          ...prev,
          skillsList: [...prev.skillsList, newSkill],
        }));
      }
      e.target.value = "";
    }
  };

  // Confirm and Apply Extracted Data to Profile
  const handleApplyToProfile = () => {
    const formattedSkillsStr = editableFields.skillsList.join(", ");

    let finalSkills = formattedSkillsStr;

    if (mergeSkills && profile.skills) {
      const existingSkillsArr = profile.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const combined = [...existingSkillsArr];
      editableFields.skillsList.forEach((skill) => {
        if (!combined.some((s) => s.toLowerCase() === skill.toLowerCase())) {
          combined.push(skill);
        }
      });

      finalSkills = combined.join(", ");
    }

    const updatedProfile = {
      ...profile,
      name: editableFields.name || profile.name,
      degree: editableFields.degree || profile.degree,
      branch: editableFields.branch || profile.branch,
      year: editableFields.year || profile.year,
      skills: finalSkills,
      preferredRole: editableFields.preferredRole || profile.preferredRole,
      preferredLocation: editableFields.preferredLocation || profile.preferredLocation,
    };

    if (setProfile) {
      setProfile(updatedProfile);
    } else if (updateProfile) {
      Object.entries(updatedProfile).forEach(([key, val]) => {
        updateProfile(key, val);
      });
    }

    localStorage.setItem("internscout_profile", JSON.stringify(updatedProfile));
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container resume-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-type-badge">📄 AI Resume Parser & Auto-Profile Builder</div>
          <h2 className="modal-job-title">Import Candidate Resume</h2>
          <p className="modal-meta-row">
            Upload your resume document (.PDF, .DOCX, .TXT) or paste text to automatically extract skills & profile details.
          </p>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Mode Switcher Tabs */}
          <div className="resume-tab-switcher">
            <button
              type="button"
              className={`resume-tab-btn ${activeMode === "file" ? "active" : ""}`}
              onClick={() => {
                setActiveMode("file");
                setErrorMessage("");
              }}
            >
              📁 File Upload (.pdf, .docx)
            </button>
            <button
              type="button"
              className={`resume-tab-btn ${activeMode === "text" ? "active" : ""}`}
              onClick={() => {
                setActiveMode("text");
                setErrorMessage("");
              }}
            >
              📝 Paste Text
            </button>
          </div>

          {/* Mode 1: File Upload */}
          {activeMode === "file" && (
            <div
              className={`file-dropzone ${isDragOver ? "drag-over" : ""} ${selectedFile ? "has-file" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              {selectedFile ? (
                <div className="selected-file-info">
                  <span className="file-icon">📄</span>
                  <div className="file-details">
                    <strong className="file-name">{selectedFile.name}</strong>
                    <span className="file-size">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Click or drag to change file
                    </span>
                  </div>
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setExtractedData(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="dropzone-content">
                  <div className="upload-cloud-icon">☁️</div>
                  <h3>Drag & Drop your Resume here</h3>
                  <p>Supports PDF, DOCX, and TXT files (Max 10MB)</p>
                  <button type="button" className="btn-secondary btn-sm" onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}>
                    Browse Files
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Paste Text */}
          {activeMode === "text" && (
            <div className="resume-text-input-wrapper">
              <textarea
                className="resume-textarea"
                rows="7"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste raw text from your Resume, LinkedIn summary, or bio here..."
              />
              <div className="textarea-footer">
                <span>{resumeText.trim() ? `${resumeText.trim().split(/\s+/).length} words` : "0 words"}</span>
                {resumeText && (
                  <button type="button" className="btn-text-clear" onClick={() => setResumeText("")}>
                    Clear text
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Status Notifications */}
          {errorMessage && (
            <div className="resume-status-banner error">
              ⚠️ {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="resume-status-banner success">
              ✨ {successMessage}
            </div>
          )}

          {/* Extracted Data Card */}
          {extractedData && (
            <div className="parsed-summary-card">
              <div className="card-title-row">
                <h4>✨ Extracted Profile Details</h4>
                <span className="extracted-badge">
                  {editableFields.skillsList.length} Skills Detected
                </span>
              </div>

              <div className="extracted-fields-grid">
                <div className="extracted-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editableFields.name}
                    onChange={(e) => setEditableFields({ ...editableFields, name: e.target.value })}
                    placeholder="Candidate Name"
                  />
                </div>

                <div className="extracted-field">
                  <label>Degree / Major</label>
                  <input
                    type="text"
                    value={editableFields.degree}
                    onChange={(e) => setEditableFields({ ...editableFields, degree: e.target.value })}
                    placeholder="e.g. B.Tech"
                  />
                </div>

                <div className="extracted-field">
                  <label>Branch / Specialization</label>
                  <input
                    type="text"
                    value={editableFields.branch}
                    onChange={(e) => setEditableFields({ ...editableFields, branch: e.target.value })}
                    placeholder="e.g. Computer Science"
                  />
                </div>

                <div className="extracted-field">
                  <label>Academic Year</label>
                  <input
                    type="text"
                    value={editableFields.year}
                    onChange={(e) => setEditableFields({ ...editableFields, year: e.target.value })}
                    placeholder="e.g. 4th Year"
                  />
                </div>

                <div className="extracted-field">
                  <label>Target Role</label>
                  <input
                    type="text"
                    value={editableFields.preferredRole}
                    onChange={(e) => setEditableFields({ ...editableFields, preferredRole: e.target.value })}
                    placeholder="e.g. Software Engineer Intern"
                  />
                </div>

                <div className="extracted-field">
                  <label>Target Location</label>
                  <input
                    type="text"
                    value={editableFields.preferredLocation}
                    onChange={(e) => setEditableFields({ ...editableFields, preferredLocation: e.target.value })}
                    placeholder="e.g. Bangalore, India"
                  />
                </div>
              </div>

              {/* Skills Tags Manager */}
              <div className="extracted-skills-section">
                <label>Detected Skills (Click ✕ to remove, or press Enter to add new):</label>
                <div className="extracted-chips-cloud">
                  {editableFields.skillsList.map((skill) => (
                    <span key={skill} className="extracted-skill-chip">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        title="Remove skill"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    className="add-skill-inline-input"
                    placeholder="+ Add skill..."
                    onKeyDown={handleAddSkill}
                  />
                </div>
              </div>

              {/* Merge Option Toggle */}
              <div className="merge-skills-toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={mergeSkills}
                    onChange={(e) => setMergeSkills(e.target.checked)}
                  />
                  <span>Combine extracted skills with existing profile skills</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            {extractedData ? "Cancel" : "Close"}
          </button>

          {!extractedData ? (
            <button
              className="btn-primary"
              onClick={handleParse}
              disabled={loading || (activeMode === "file" && !selectedFile) || (activeMode === "text" && !resumeText.trim())}
            >
              {loading ? (
                <>
                  <span className="spinner">⏳</span> Extracting Data...
                </>
              ) : (
                "⚡ Parse Resume"
              )}
            </button>
          ) : (
            <button className="btn-primary" onClick={handleApplyToProfile}>
              ✅ Apply to Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumeUploadModal;
