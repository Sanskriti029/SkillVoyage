import React, { useState } from "react";
import { generateCoverLetter } from "../utils/coverLetterGenerator";

function CoverLetterModal({ job, profile, match, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!job) return null;

  const letterData = generateCoverLetter({ job, profile, match });

  const handleCopy = () => {
    navigator.clipboard.writeText(`${letterData.subject}\n\n${letterData.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMailTo = () => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(letterData.subject)}&body=${encodeURIComponent(letterData.body)}`;
    window.open(mailtoUrl, "_blank");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container pitch-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div className="modal-header">
          <div className="modal-type-badge">✉️ AI Application Pitch Generator</div>
          <h2 className="modal-job-title">Tailored Pitch for {job.company || "Company"}</h2>
          <p className="modal-meta-row">
            Role: <strong>{job.title}</strong> • Candidate Match: <strong>{match.matchPercentage}%</strong>
          </p>
        </div>

        <div className="modal-body">
          <div className="pitch-box">
            <div className="pitch-subject">
              <strong>Subject:</strong> {letterData.subject}
            </div>
            <textarea
              className="pitch-textarea"
              readOnly
              rows="12"
              value={letterData.body}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleCopy}>
            {copied ? "✓ Copied to Clipboard!" : "📋 Copy Pitch"}
          </button>
          <button className="btn-primary" onClick={handleMailTo}>
            🚀 Open Email Client
          </button>
        </div>
      </div>
    </div>
  );
}

export default CoverLetterModal;
