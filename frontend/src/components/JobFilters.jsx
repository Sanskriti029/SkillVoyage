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
    <>
      {/* Sort Jobs */}
      <div className="job-sort-control">
        <label htmlFor="job-sort">Sort jobs by:</label>

        <select
          id="job-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="job-sort-select"
        >
          <option value="match">Highest Skill Match</option>
          <option value="company">Company Name (A–Z)</option>
        </select>
      </div>

      {/* Company Filter */}
      <div className="company-filter-wrapper">
        <div className="company-input-row">
          <input
            type="text"
            className="filter-input"
            placeholder="Search company name..."
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            aria-label="Filter jobs by company"
            autoComplete="off"
          />

          {companyFilter && (
            <button
              type="button"
              className="clear-company-button"
              onClick={() => setCompanyFilter("")}
              aria-label="Clear company filter"
            >
              ✕
            </button>
          )}
        </div>

        {companyFilter.trim() &&
          companySuggestions.length === 0 &&
          allCompanies.length > 0 && (
            <div className="company-suggestions">

              <div className="company-no-suggestions">
                ❌ No matching company found for "{companyFilter}"
              </div>

              <button
                type="button"
                className="company-reset-button"
                onClick={() => setCompanyFilter("")}
              >
                ← Show all companies
              </button>

              {fallbackCompanies.length > 0 && (
                <>
                  <div className="company-no-suggestions">
                    Or choose a company:
                  </div>

                  {fallbackCompanies.map((company) => (
                    <button
                      type="button"
                      className="company-suggestion"
                      key={company}
                      onClick={() => setCompanyFilter(company)}
                    >
                      <span>{company}</span>

                      <span className="suggestion-label">
                        Use this
                      </span>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
      </div>
    </>
  );
}

export default JobFilters;