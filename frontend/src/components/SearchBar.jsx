

function SearchBar({
  query,
  setQuery,
  location,
  setLocation,
  internshipsOnly,
  setInternshipsOnly,
  searchJobs,
  showSavedJobs,
  setShowSavedJobs,
  savedJobs,
})  {
  return (
       <section className="search-section">

        <h1>Find Your Next Internship</h1>

        <p className="subtitle">
          Search live opportunities powered by SerpApi.
        </p>

        <div className="search-box">

          <div className="input-group">
            <label>🔍 Role</label>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Software Engineer Intern"
            />
          </div>


          <div className="input-group">
            <label>📍 Location</label>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Bangalore, India"
            />
            
          </div>

<label className="internship-filter">
  <input
    type="checkbox"
    checked={internshipsOnly}
    onChange={(e) => setInternshipsOnly(e.target.checked)}
  />
  Internships only
</label>
          <button onClick={searchJobs}>
            Search Internships
          </button>

        </div>
<button
  className="saved-jobs-button"
  onClick={() => setShowSavedJobs((current) => !current)}
>
  ⭐ {showSavedJobs ? "View All Jobs" : "View Saved Jobs"}
  {savedJobs.length > 0 && (
    <span className="saved-jobs-count">
      {savedJobs.length}
    </span>
  )}
</button>
      </section>
  )
}

export default SearchBar