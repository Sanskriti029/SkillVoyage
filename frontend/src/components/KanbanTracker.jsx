import React from "react";

function KanbanTracker({ savedJobs, setSavedJobs, setSelectedJob, toggleSaveJob }) {
  const columns = [
    { id: "saved", title: "📥 Saved", color: "blue" },
    { id: "applied", title: "📩 Applied", color: "amber" },
    { id: "interviewing", title: "💬 Interviewing", color: "purple" },
    { id: "offer", title: "🎉 Offer Received", color: "green" },
  ];

  const updateJobStatus = (jobId, newStatus) => {
    const updated = savedJobs.map((j) => {
      if (j.job_id === jobId) {
        return { ...j, status: newStatus };
      }
      return j;
    });
    setSavedJobs(updated);
    localStorage.setItem("SkillVoyage_saved_jobs", JSON.stringify(updated));
  };

  return (
    <div className="kanban-container">
      <div className="kanban-header">
        <h2>📋 Candidate Application Pipeline</h2>
        <p>Track your internship applications across each recruitment stage.</p>
      </div>

      <div className="kanban-grid">
        {columns.map((col) => {
          const colJobs = savedJobs.filter((j) => (j.status || "saved") === col.id);

          return (
            <div key={col.id} className={`kanban-column col-${col.color}`}>
              <div className="column-header">
                <h3>{col.title}</h3>
                <span className="column-count">{colJobs.length}</span>
              </div>

              <div className="column-body">
                {colJobs.length === 0 ? (
                  <div className="kanban-empty">No jobs in this stage</div>
                ) : (
                  colJobs.map((job) => (
                    <div key={job.job_id} className="kanban-card">
                      <div className="kanban-card-top">
                        <h4 onClick={() => setSelectedJob(job)}>{job.title}</h4>
                        <button
                          className="kanban-remove-btn"
                          onClick={() => toggleSaveJob(job)}
                          title="Remove from saved"
                        >
                          ✕
                        </button>
                      </div>

                      <p className="kanban-company">{job.company}</p>
                      {job.location && (
                        <span className="kanban-loc">📍 {job.location}</span>
                      )}

                      <div className="kanban-card-footer">
                        <select
                          className="status-select"
                          value={job.status || "saved"}
                          onChange={(e) => updateJobStatus(job.job_id, e.target.value)}
                        >
                          <option value="saved">📥 Saved</option>
                          <option value="applied">📩 Applied</option>
                          <option value="interviewing">💬 Interviewing</option>
                          <option value="offer">🎉 Offer</option>
                        </select>

                        <button
                          className="btn-card-view"
                          onClick={() => setSelectedJob(job)}
                        >
                          View →
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default KanbanTracker;
