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
      <div className="message">
        🔎 Finding live opportunities...
      </div>
    );
  }

  if (!searched || filteredJobs.length > 0) {
    return null;
  }

  return (
    <div className="message">
      {showSavedJobs
        ? "⭐ You haven't saved any jobs yet."
        : "No opportunities found for this filter. Try another role or location."}

      {companyFilter && (
        <button
          type="button"
          className="company-reset-main-button"
          onClick={() => setCompanyFilter("")}
        >
          ← Clear company filter
        </button>
      )}
    </div>
  );
}

export default ResultsMessage;