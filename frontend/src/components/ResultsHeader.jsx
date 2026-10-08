function ResultsHeader({ showSavedJobs, filteredJobs }) {
  const count = filteredJobs.length;

  return (
    <div className="results-header">

      <div className="results-header-main">

        <div className="results-title-row">
          <div className="results-live-icon">
            {showSavedJobs ? "⭐" : "⚡"}
          </div>

          <div>
            <h2>
              {showSavedJobs
                ? "Your Saved Opportunities"
                : "Live Opportunities"}
            </h2>

            <p>
              {showSavedJobs
                ? "Jobs you've saved for later"
                : "Fresh opportunities matched to your search"}
            </p>
          </div>
        </div>

      </div>

      <div className="results-count">
        <strong>{count}</strong>

        <span>
          {count === 1 ? "opportunity" : "opportunities"}
        </span>
      </div>

    </div>
  );
}

export default ResultsHeader;