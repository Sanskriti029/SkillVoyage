import React from "react";

function JobFilters({
  sortBy,
  setSortBy,
  companyFilter,
  setCompanyFilter,
  companySuggestions,
  allCompanies,
  fallbackCompanies,
}) {
  return (
    <div className="filter-controls-bar">
      {/* Company Search with Suggestions */}
      <div className="company-filter-box">
        <div className="input-with-icon">
          <span className="input-icon">🏢</span>
          <input
            type="text"
            className="filter-input-field"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            placeholder="Filter by company name..."
          />
          {companyFilter && (
            <button
              className="clear-filter-btn"
              onClick={() => setCompanyFilter("")}
              title="Clear filter"
            >
              ✕
            </button>
          )}
        </div>

        {/* Company Dropdown Suggestions */}
        {companyFilter.trim() && companySuggestions.length > 0 && (
          <div className="company-dropdown shadow-lg">
            {companySuggestions.map((company) => (
              <button
                key={company}
                className="dropdown-item"
                onClick={() => setCompanyFilter(company)}
              >
                <span>{company}</span>
                <span className="item-tag">Match</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sort Selector */}
      <div className="sort-box">
        <label htmlFor="sort-select">Sort Opportunities:</label>
        <select
          id="sort-select"
          className="sort-select-field"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="match">🔥 Highest Skill Match</option>
          <option value="company">🏢 Company Name (A-Z)</option>
        </select>
      </div>
    </div>
  );
}

export default JobFilters;