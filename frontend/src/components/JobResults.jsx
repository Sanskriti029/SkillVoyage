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
  onOpenPitch,
  onOpenInterview,
}) {
  if (filteredJobs.length === 0) {
    return null;
  }

  return (
    <div className="job-results-section">
    
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
            onOpenPitch={onOpenPitch}
            onOpenInterview={onOpenInterview}
          />
        ))}
      </div>

      {nextPageToken && !showSavedJobs && (
        <div className="load-more-container">
          <button
            className="load-more-button btn-primary"
            onClick={loadMoreJobs}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load More Jobs"}
          </button>
        </div>
      )}
      </div>
    
  );
}

export default JobResults;