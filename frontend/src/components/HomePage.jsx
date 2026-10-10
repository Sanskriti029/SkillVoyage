import React from "react";
import "./HomePage.css";

function HomePage({
  loggedInUser,
  profile,
  savedJobs,
  profileCompletion,
  setActiveTab,
}) {
  const firstName =
    profile?.name?.trim()?.split(" ")[0] ||
    loggedInUser?.name?.trim()?.split(" ")[0] ||
    "there";

  const skills = (profile?.skills || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="home-eyebrow">
            YOUR CAREER JOURNEY STARTS HERE
          </span>

          <h1>
            Welcome back, {firstName} <span>👋</span>
          </h1>

          <p>
            Turn your skills into opportunities. Discover relevant jobs,
            understand your skill gaps, and take the next step toward your
            career goals.
          </p>

          <div className="home-hero-actions">
            <button
              className="home-primary-btn"
              onClick={() => setActiveTab("search")}
            >
              Explore Opportunities <span>→</span>
            </button>

            <button
              className="home-secondary-btn"
              onClick={() => setActiveTab("dashboard")}
            >
              View My Dashboard
            </button>
          </div>
        </div>

        <div className="home-hero-visual" aria-hidden="true">
          <div className="home-orbit orbit-one"></div>
          <div className="home-orbit orbit-two"></div>
          <div className="home-visual-icon">🚀</div>
          <div className="home-floating-card floating-top">
            <span>🎯</span>
            <div>
              <strong>Find your fit</strong>
              <small>Discover opportunities</small>
            </div>
          </div>
          <div className="home-floating-card floating-bottom">
            <span>📈</span>
            <div>
              <strong>Keep growing</strong>
              <small>Build career-ready skills</small>
            </div>
          </div>
        </div>
      </section>

      <section className="home-stats">
        <article className="home-stat-card">
          <div className="home-stat-icon purple">👤</div>
          <div>
            <span>Profile completion</span>
            <strong>{profileCompletion}%</strong>
            <div className="home-progress-track">
              <div
                className="home-progress-fill"
                style={{
                  width: `${Math.min(100, Math.max(0, profileCompletion))}%`,
                }}
              ></div>
            </div>
          </div>
        </article>

        <article className="home-stat-card">
          <div className="home-stat-icon blue">⭐</div>
          <div>
            <span>Saved opportunities</span>
            <strong>{savedJobs.length}</strong>
            <small>Jobs you want to revisit</small>
          </div>
        </article>

        <article className="home-stat-card">
          <div className="home-stat-icon green">💡</div>
          <div>
            <span>Skills in your profile</span>
            <strong>{skills.length}</strong>
            <small>Skills used for job matching</small>
          </div>
        </article>
      </section>

      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <span className="home-section-label">YOUR NEXT STEP</span>
            <h2>Make progress toward your goals</h2>
            <p>Choose where you want to continue.</p>
          </div>
        </div>

        <div className="home-action-grid">
          <button
            className="home-action-card"
            onClick={() => setActiveTab("search")}
          >
            <span className="home-action-icon">🔎</span>
            <span className="home-action-title">Explore Jobs</span>
            <span className="home-action-description">
              Search opportunities by role and location, then compare your
              skills with job requirements.
            </span>
            <span className="home-action-link">Find opportunities →</span>
          </button>

          <button
            className="home-action-card"
            onClick={() => setActiveTab("profile")}
          >
            <span className="home-action-icon">🧑‍💻</span>
            <span className="home-action-title">Improve Your Profile</span>
            <span className="home-action-description">
              Keep your education, skills, and preferred role up to date for
              more relevant matching.
            </span>
            <span className="home-action-link">Update profile →</span>
          </button>

          <button
            className="home-action-card"
            onClick={() => setActiveTab("dashboard")}
          >
            <span className="home-action-icon">📊</span>
            <span className="home-action-title">Track Your Progress</span>
            <span className="home-action-description">
              Review your profile completion, saved opportunities, and career
              search activity.
            </span>
            <span className="home-action-link">Open dashboard →</span>
          </button>

          <button
            className="home-action-card"
            onClick={() => setActiveTab("saved")}
          >
            <span className="home-action-icon">🔖</span>
            <span className="home-action-title">Saved Opportunities</span>
            <span className="home-action-description">
              Return to the jobs you saved and manage your opportunity tracker.
            </span>
            <span className="home-action-link">
              View saved jobs ({savedJobs.length}) →
            </span>
          </button>
        </div>
      </section>

      <section className="home-career-banner">
        <div>
          <span className="home-section-label">SKILLVOYAGE</span>
          <h2>From skill gaps to career goals.</h2>
          <p>
            Find opportunities that fit your skills. Discover what to learn
            next. Keep moving forward.
          </p>
        </div>

        <button
          className="home-primary-btn"
          onClick={() => setActiveTab("search")}
        >
          Start Exploring <span>→</span>
        </button>
      </section>
    </main>
  );
}

export default HomePage;