import ResultsHeader from "./ResultsHeader";
import JobFilters from "./JobFilters";
import JobCard from "./JobCard";

function JobResults({
  filteredJobs,
  showSavedJobs,
  sortBy,
  setSortBy,
  companyFilter,
  setCompanyFilter,
  companySuggestions,
  allCompanies,
  fallbackCompanies,
  profile,
  savedJobs,
  toggleSaveJob,
  setSelectedJob,
  calculateJobMatch,
  nextPageToken,
  loadMoreJobs,
  loadingMore,
}) {
  if (filteredJobs.length === 0) {
    return null;
  }

  return (
    <>
      <ResultsHeader
        showSavedJobs={showSavedJobs}
        filteredJobs={filteredJobs}
      />

      <JobFilters
        sortBy={sortBy}
        setSortBy={setSortBy}
        companyFilter={companyFilter}
        setCompanyFilter={setCompanyFilter}
        companySuggestions={companySuggestions}
        allCompanies={allCompanies}
        fallbackCompanies={fallbackCompanies}
      />

      <div className="job-grid">
        {filteredJobs.map((job, index) => (
          <JobCard
            key={job.job_id || index}
            job={job}
            profile={profile}
            savedJobs={savedJobs}
            toggleSaveJob={toggleSaveJob}
            setSelectedJob={setSelectedJob}
            calculateJobMatch={calculateJobMatch}
          />
        ))}
      </div>

      {nextPageToken && !showSavedJobs && (
        <div className="load-more-container">
          <button
            className="load-more-button"
            onClick={loadMoreJobs}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load More Jobs"}
          </button>
        </div>
      )}
    </>
  );
}

export default JobResults;