import React from "react";

function ResultsHeader({ showSavedJobs, filteredJobs }) {
  return (
    <div className="section-title-header">
      <div className="title-with-pill">
        <h2>
          {showSavedJobs ? "⭐ Saved Opportunities" : "🎯 Live Internship Match Results"}
        </h2>
        <span className="results-count-pill">
          {filteredJobs.length} {showSavedJobs ? "saved" : "roles"}
        </span>
      </div>
    </div>
  );
}

export default ResultsHeader;