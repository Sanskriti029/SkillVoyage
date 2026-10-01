import { useState } from "react";
import "./App.css";
import skillRoadmaps from "./data/skillRoadmaps";

const COMMON_SKILLS = [
  "javascript",
  "typescript",
  "java",
  "python",
  "c++",
  "react",
  "angular",
  "vue",
  "node.js",
  "express",
  "html",
  "css",
  "tailwind",
  "sql",
  "mysql",
  "postgresql",
  "mongodb",
  "git",
  "github",
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "machine learning",
  "deep learning",
  "tensorflow",
  "pytorch",
  "flask",
  "django",
  "rest api",
  "api",
  "data structures",
  "algorithms"
];
function calculateJobMatch(jobDescription, studentSkills) {
  const description = (jobDescription || "").toLowerCase();

  const skills = studentSkills
    .split(",")
    .map((skill) => skill.trim().toLowerCase())
    .filter((skill) => skill !== "");

  // Skills mentioned in the job description
  const requiredSkills = COMMON_SKILLS.filter((skill) => {
  const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const pattern = new RegExp(
    `\\b${escapedSkill}\\b`,
    "i"
  );

  return pattern.test(description);
});

  // Skills the student has that are required by the job
  const matchedSkills = requiredSkills.filter((skill) =>
    skills.some((studentSkill) =>
      studentSkill.includes(skill) || skill.includes(studentSkill)
    )
  );

  // Skills required by the job but missing from student's profile
  const missingSkills = requiredSkills.filter(
    (skill) => !matchedSkills.includes(skill)
  );

  let matchPercentage = 0;

  if (requiredSkills.length > 0) {
    matchPercentage = Math.round(
      (matchedSkills.length / requiredSkills.length) * 100
    );
  }

  return {
    requiredSkills,
    matchedSkills,
    missingSkills,
    matchPercentage
  };
}

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("software engineer intern");
  const [location, setLocation] = useState("Bangalore, India");
  const [searched, setSearched] = useState(false);
  const [internshipsOnly, setInternshipsOnly] = useState(true);

  // Student profile
  const [profile, setProfile] = useState({
    name: "",
    degree: "",
    branch: "",
    year: "",
    skills: "",
    preferredRole: "",
    preferredLocation: ""
  });

  const updateProfile = (field, value) => {
    setProfile({
      ...profile,
      [field]: value
    });
  };

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


      {/* Student Profile */}
      <section className="profile-section">

        <h1>👤 Your Student Profile</h1>

        <p className="subtitle">
          Tell InternScout about yourself to find better opportunities.
        </p>

        <div className="profile-grid">

          <div className="input-group">
            <label>Name</label>

            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                updateProfile("name", e.target.value)
              }
              placeholder="Your name"
            />
          </div>


          <div className="input-group">
            <label>Degree</label>

            <input
              type="text"
              value={profile.degree}
              onChange={(e) =>
                updateProfile("degree", e.target.value)
              }
              placeholder="B.Tech"
            />
          </div>


          <div className="input-group">
            <label>Branch</label>

            <input
              type="text"
              value={profile.branch}
              onChange={(e) =>
                updateProfile("branch", e.target.value)
              }
              placeholder="Computer Science"
            />
          </div>


          <div className="input-group">
            <label>Year</label>

            <select
              value={profile.year}
              onChange={(e) =>
                updateProfile("year", e.target.value)
              }
            >
              <option value="">Select year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>


          <div className="input-group full-width">
            <label>Skills</label>

            <input
              type="text"
              value={profile.skills}
              onChange={(e) =>
                updateProfile("skills", e.target.value)
              }
              placeholder="Java, Python, React, SQL, HTML, CSS"
            />

            <small>
              Separate skills using commas.
            </small>
          </div>


          <div className="input-group">
            <label>Preferred Role</label>

            <input
              type="text"
              value={profile.preferredRole}
              onChange={(e) =>
                updateProfile(
                  "preferredRole",
                  e.target.value
                )
              }
              placeholder="Software Engineer Intern"
            />
          </div>


          <div className="input-group">
            <label>Preferred Location</label>

            <input
              type="text"
              value={profile.preferredLocation}
              onChange={(e) =>
                updateProfile(
                  "preferredLocation",
                  e.target.value
                )
              }
              placeholder="Bangalore"
            />
          </div>

        </div>

      </section>


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
            <label className="internship-filter">
  <input
    type="checkbox"
    checked={internshipsOnly}
    onChange={(e) => setInternshipsOnly(e.target.checked)}
  />
  Internships only
</label>
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

              <h2>
                Live Opportunities
              </h2>

              <span>
                {jobs.length} jobs found
              </span>

            </div>


           <div className="job-grid">

  
    {jobs
  .filter((job) => !internshipsOnly || job.is_internship)
  .map((job, index) => {

    const match = calculateJobMatch(
      job.description,
      profile.skills
    );

    return (
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
        {job.is_internship && (
  <span className="internship-badge">
    🎓 Internship
  </span>
)}
       <div
  className={`match-score ${
    match.matchPercentage >= 70
      ? "high"
      : match.matchPercentage >= 40
      ? "medium"
      : "low"
  }`}
>
  🎯 Skill Match: {match.matchPercentage}%
</div>

<p className="match-explanation">
  Based on the skills detected in this job description and the skills in your profile.
</p>

        <p className="location">
          📍 {job.location}
        </p>

        {job.via && (
          <p className="via">
            Via {job.via}
          </p>
        )}

        {match.matchedSkills.length > 0 && (
          <div className="skills-section">

            <strong>✅ Your matched skills</strong>

            <div className="skill-tags">

              {match.matchedSkills.map((skill) => (
                <span
                  className="skill-tag matched"
                  key={skill}
                >
                  {skill}
                </span>
              ))}

            </div>

          </div>
        )}

        {match.missingSkills.length > 0 && (
  <div className="skills-section">

    <strong>⚠️ Skill gap</strong>

    <div className="skill-tags">

      {match.missingSkills.map((skill) => (
        <span
          className="skill-tag missing"
          key={skill}
        >
          {skill}
        </span>
      ))}

    </div>


    <div className="roadmap-section">

      <strong>📚 How to close your skill gap</strong>

      {match.missingSkills.map((skill) => {

        const roadmap = skillRoadmaps[skill];

        if (!roadmap) {
          return null;
        }

        return (
          <div
            className="roadmap-card"
            key={skill}
          >

            <h5>
              {roadmap.title}
            </h5>


            <p className="roadmap-label">
              Learn:
            </p>

            <ul>
              {roadmap.learn.map((item, index) => (
                <li key={index}>
                  {item}
                </li>
              ))}
            </ul>


            <p className="roadmap-practice">
              💻 Practice: {roadmap.practice}
            </p>

          </div>
        );
      })}

    </div>

  </div>
)}
        

        <p className="description">
          {job.description
            ? job.description.substring(0, 250) + "..."
            : "No description available."}
        </p>

        <div className="job-footer">
  {job.source_link && (
    <a
      className="apply-button"
      href={job.source_link}
      target="_blank"
      rel="noopener noreferrer"
    >
      Apply / View Opportunity →
    </a>
  )}
</div>
      </div>
    );

  })}

</div>
    </>
        )}

      </main>

    </div>
  );
}

export default App;