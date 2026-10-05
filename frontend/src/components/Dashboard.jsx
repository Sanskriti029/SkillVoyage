function Dashboard({ profile, savedJobs }) {
  const profileFields = [
    profile.name,
    profile.degree,
    profile.branch,
    profile.year,
    profile.skills,
    profile.preferredRole,
    profile.preferredLocation,
  ];

  const completedFields = profileFields.filter(
    (field) => field && field.trim() !== ""
  ).length;

  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100
  );

  const averageMatch =
    savedJobs.length > 0
      ? Math.round(
          savedJobs.reduce(
            (total, job) => total + (job.matchPercentage || 0),
            0
          ) / savedJobs.length
        )
      : 0;

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>📊 Your Dashboard</h1>
          <p>
            Track your internship search and skill progress.
          </p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="dashboard-card">
          <span className="dashboard-card-icon">👤</span>
          <div>
            <h3>Profile</h3>
            <strong>{profileCompletion}%</strong>
            <p>Complete</p>
          </div>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-icon">⭐</span>
          <div>
            <h3>Saved Jobs</h3>
            <strong>{savedJobs.length}</strong>
            <p>Saved opportunities</p>
          </div>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-icon">🎯</span>
          <div>
            <h3>Average Match</h3>
            <strong>{averageMatch}%</strong>
            <p>Across saved jobs</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>👤 Profile Overview</h2>

        <div className="profile-overview">
          <div>
            <span>Name</span>
            <strong>{profile.name || "Not added"}</strong>
          </div>

          <div>
            <span>Degree</span>
            <strong>{profile.degree || "Not added"}</strong>
          </div>

          <div>
            <span>Branch</span>
            <strong>{profile.branch || "Not added"}</strong>
          </div>

          <div>
            <span>Preferred Role</span>
            <strong>
              {profile.preferredRole || "Not added"}
            </strong>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>⭐ Recently Saved Jobs</h2>

        {savedJobs.length === 0 ? (
          <p className="dashboard-empty">
            You haven't saved any jobs yet.
          </p>
        ) : (
          <div className="dashboard-jobs">
            {savedJobs.slice(0, 5).map((job, index) => (
              <div
                className="dashboard-job"
                key={job.job_id || index}
              >
                <div>
                  <h3>{job.title || "Untitled Job"}</h3>
                  <p>
                    {job.company || "Unknown Company"}
                  </p>
                  <span>
                    📍 {job.location || "Location not specified"}
                  </span>
                </div>

                <strong>
                  {job.matchPercentage || 0}% match
                </strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard;