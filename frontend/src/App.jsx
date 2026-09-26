import { useState } from "react";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("software engineer");
  const [location, setLocation] = useState("Bangalore, India");
  const [searched, setSearched] = useState(false);

  const searchJobs = async () => {
    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/jobs?q=${encodeURIComponent(
          query
        )}&location=${encodeURIComponent(location)}`
      );

      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs);
      } else {
        console.error(data.error);
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    }

    setLoading(false);
  };

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div className="logo">
          🎯 InternScout
        </div>

        <p>
          Find internships that actually fit you.
        </p>
      </header>


      {/* Search Section */}
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


          <button onClick={searchJobs}>
            Search Internships
          </button>

        </div>

      </section>


      {/* Results */}
      <main className="results">

        {loading && (
          <div className="message">
            🔎 Finding live opportunities...
          </div>
        )}


        {!loading && searched && jobs.length === 0 && (
          <div className="message">
            No jobs found. Try another role or location.
          </div>
        )}


        {!loading && jobs.length > 0 && (
          <>
            <div className="results-header">
              <h2>Live Opportunities</h2>

              <span>
                {jobs.length} jobs found
              </span>
            </div>


            <div className="job-grid">

              {jobs.map((job, index) => (

                <div
                  className="job-card"
                  key={job.job_id || index}
                >

                  <h3>
                    {job.title}
                  </h3>

                  <h4>
                    {job.company}
                  </h4>

                  <p className="location">
                    📍 {job.location}
                  </p>

                  {job.via && (
                    <p className="via">
                      Via {job.via}
                    </p>
                  )}

                  <p className="description">
                    {job.description
                      ? job.description.substring(0, 250) + "..."
                      : "No description available."}
                  </p>


                  <div className="job-footer">

                    {job.source_link && (
                      <a
                        href={job.source_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Opportunity →
                      </a>
                    )}

                  </div>

                </div>

              ))}

            </div>
          </>
        )}

      </main>

    </div>
  );
}

export default App;