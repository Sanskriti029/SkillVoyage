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


  const [nextPageToken, setNextPageToken] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
const [companyFilter, setCompanyFilter] = useState("");
const [jobLocationFilter, setJobLocationFilter] = useState("");


const [sortBy, setSortBy] = useState("match");


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
const filteredJobs = jobs
  .filter((job) => !internshipsOnly || job.is_internship)
  .filter((job) =>
    (job.company || "")
      .toLowerCase()
      .includes(companyFilter.trim().toLowerCase())
  )
  .filter((job) =>
    (job.location || "")
      .toLowerCase()
      .includes(jobLocationFilter.trim().toLowerCase())
  );
  const allCompanies = [
  ...new Set(
    jobs
      .map((job) => job.company?.trim())
      .filter(Boolean)
  ),
].sort((a, b) => a.localeCompare(b));

const companySuggestions = allCompanies
  .filter((company) =>
    company.toLowerCase().includes(companyFilter.trim().toLowerCase())
  )
  .filter(
    (company) =>
      company.toLowerCase() !== companyFilter.trim().toLowerCase()
  )
  .slice(0, 6);

const fallbackCompanies = allCompanies
  .filter(
    (company) => !companySuggestions.includes(company)
  )
  .slice(0, 5);


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
        setNextPageToken(data.next_page_token || null);
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

  const loadMoreJobs = async () => {
  if (!nextPageToken || loadingMore) return;

  setLoadingMore(true);



  
  try {
    const url =
      `http://127.0.0.1:5000/api/jobs?q=${encodeURIComponent(query)}` +
      `&location=${encodeURIComponent(location)}` +
      `&next_page_token=${encodeURIComponent(nextPageToken)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Unable to load more jobs.");
    }

    setJobs((previousJobs) => {
      const existingIds = new Set(
        previousJobs.map((job) => job.job_id).filter(Boolean)
      );

      const newJobs = data.jobs.filter(
        (job) => !job.job_id || !existingIds.has(job.job_id)
      );

      return [...previousJobs, ...newJobs];
    });

    setNextPageToken(data.next_page_token || null);
  } catch (error) {
    console.error("Load more jobs failed:", error);
  } finally {
    setLoadingMore(false);
  }
};



// Sorting by skills highest to lowest match percentage or by company name
const sortedJobs = [...filteredJobs].sort((a, b) => {
  if (sortBy === "company") {
    return (a.company || "").localeCompare(
      b.company || "",
      undefined,
      { sensitivity: "base" }
    );
  }

  const matchA = calculateJobMatch(
    a.description,
    profile.skills
  ).matchPercentage;

  const matchB = calculateJobMatch(
    b.description,
    profile.skills
  ).matchPercentage;

  return matchB - matchA;
});
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

      </section>


      {/* Results */}
      <main className="results">

        {loading && (
          <div className="message">
            🔎 Finding live opportunities...
          </div>
        )}

{!loading && searched && filteredJobs.length === 0 && (
  <div className="message">
  <p>
    No jobs match your current filters.
  </p>

  {companyFilter && (
    <button
      type="button"
      className="company-reset-main-button"
      onClick={() => setCompanyFilter("")}
    >
      ← Clear company filter
    </button>
  )}
</div>
)}

        {!loading && jobs.length > 0 && (
          <>
           <div className="results-header">
  <h2>Live Opportunities</h2>
  <span>
    {filteredJobs.length} opportunities shown
  </span>
</div>



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

           <div className="job-grid">

  
   {sortedJobs.map((job, index) => {

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
      <div className="match-summary">
  <div className="match-score">
    <span className="match-percentage">
      {match.matchPercentage}%
    </span>
    <span className="match-label">
      Skill Match
    </span>
  </div>

  <div className="match-explanation">
    {match.matchedSkills.length > 0 && (
      <div className="skill-section">
        <h4>✅ Skills you have</h4>

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
      <div className="skill-section">
        <h4>❌ Skills to improve</h4>

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
      </div>
    )}

    {match.matchedSkills.length === 0 &&
      match.missingSkills.length === 0 && (
        <p className="no-skill-data">
          Not enough skill information available for this job.
        </p>
    )}
  </div>
</div>
{/* <p className="match-explanation">
  Based on the skills detected in this job description and the skills in your profile.
</p> */}

        {/* <p className="location">
          📍 {job.location}
        </p>

        {job.via && (
          <p className="via">
            Via {job.via}
          </p>
        )} */}

        {/* {match.matchedSkills.length > 0 && (
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
        )} */}

        {match.missingSkills.length > 0 && (
  // <div className="skills-section">

  //   <strong>⚠️ Skill gap</strong>

  //   <div className="skill-tags">

  //     {match.missingSkills.map((skill) => (
  //       <span
  //         className="skill-tag missing"
  //         key={skill}
  //       >
  //         {skill}
  //       </span>
  //     ))}

  //   </div>

<div className="roadmap-section">

  <div className="roadmap-heading">
    <strong>📚 Your Preparation Plan</strong>
    <span>
      Build these missing skills to improve your match for this job.
    </span>
  </div>

  {/* Overall preparation summary */}
  <div className="preparation-summary">

    <div className="preparation-summary-header">
      <div>
        <h4>🎯 Job-Specific Skill Plan</h4>
        <p>
          You are currently missing{" "}
          <strong>{match.missingSkills.length}</strong>{" "}
          skill{match.missingSkills.length !== 1 ? "s" : ""} detected
          from this job description.
        </p>
      </div>

      <div className="preparation-count">
        {match.missingSkills.length}
        <span>skills</span>
      </div>
    </div>

    <div className="preparation-priority-list">

      {match.missingSkills.map((skill, index) => {

        const roadmap = skillRoadmaps[skill];

        if (!roadmap) {
          return null;
        }

        return (
          <div
            className="preparation-priority"
            key={skill}
          >

            <div className="priority-number">
              {index + 1}
            </div>

            <div className="priority-content">

              <strong>
                {roadmap.title}
              </strong>

              <span>
                {roadmap.learn.slice(0, 3).join(" → ")}
              </span>

            </div>

          </div>
        );
      })}

    </div>

    {match.missingSkills.length > 0 && (
      <div className="preparation-next-step">
        💡 <strong>Recommended next step:</strong>{" "}
        Start with{" "}
        {skillRoadmaps[match.missingSkills[0]]?.title ||
          match.missingSkills[0]}
        .
      </div>
    )}

  </div>

  {/* Detailed roadmap for each missing skill */}
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

        <div className="roadmap-card-header">

          <h5>
            🎯 {roadmap.title}
          </h5>

          <span className="roadmap-badge">
            Skill Gap
          </span>

        </div>

        <p className="roadmap-label">
          📖 Learn these topics
        </p>

        <ol className="roadmap-list">
          {roadmap.learn.map((item, index) => (
            <li key={index}>
              {item}
            </li>
          ))}
        </ol>

        <div className="roadmap-practice-box">
          <strong>💻 Practice:</strong>
          <span>{roadmap.practice}</span>
        </div>

      </div>
    );
  })}

</div>

  // </div>
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
{nextPageToken && (
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
        )}

      </main>

    </div>
  );
}

export default App;