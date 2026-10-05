import React from "react";

function ResultsMessage({
  loading,
  searched,
  filteredJobs,
  showSavedJobs,
  companyFilter,
  setCompanyFilter,
}) {
  if (loading) {
    return (
      <div className="status-card-message loading">
        <div className="pulse-spinner"></div>
        <h3>Fetching Live Opportunities...</h3>
        <p>Connecting to Google Jobs & analyzing candidate match matrices...</p>
      </div>
    );
  }

  if (!searched && !showSavedJobs) {
    return null;
  }

  if (filteredJobs.length > 0) {
    return null;
  }

  return (
    <div className="status-card-message empty">
      <span className="status-emoji">🔍</span>
      <h3>
        {showSavedJobs
          ? "No Saved Jobs Found"
          : "No Internship Opportunities Match Your Criteria"}
      </h3>
      <p>
        {showSavedJobs
          ? "Click the star icon on any job card to save it for quick reference later."
          : "Try broadening your query keywords, location filter, or toggling company filters."}
      </p>

      {companyFilter && (
        <button
          type="button"
          className="btn-secondary mt-3"
          onClick={() => setCompanyFilter("")}
        >
          ← Clear Company Filter ("{companyFilter}")
        </button>
      )}
    </div>
  );
}

export default ResultsMessage;