function ResultsHeader({ showSavedJobs, filteredJobs }) {
  return (
    <div className="results-header">
      <h2>
        {showSavedJobs ? "⭐ Saved Jobs" : "Live Opportunities"}
      </h2>

      <span>
        {filteredJobs.length}{" "}
        {showSavedJobs ? "saved jobs" : "opportunities"} shown
      </span>
    </div>
  );
}

export default ResultsHeader;