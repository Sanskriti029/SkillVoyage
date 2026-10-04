import { useEffect, useState } from "react";
import "./App.css";

import JobCard from "./components/JobCard";
import JobDetailsModal from "./components/JobDetailsModal";
import ProfileForm from "./components/ProfileForm";
import SearchBar from "./components/SearchBar";
import JobFilters from "./components/JobFilters";
import ResultsHeader from "./components/ResultsHeader";
import ResultMessage from "./components/ResultsMessage";
import JobResults from "./components/JobResults";
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
const [selectedJob, setSelectedJob] = useState(null);




const [savedJobs, setSavedJobs] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("internscout_saved_jobs")) || [];
  } catch {
    return [];
  }
});

const [showSavedJobs, setShowSavedJobs] = useState(false);


  // Student profile
  const [profile, setProfile] = useState(() => {
  try {
    const savedProfile = localStorage.getItem("internscout_profile");

    return savedProfile
      ? JSON.parse(savedProfile)
      : {
          name: "",
          degree: "",
          branch: "",
          year: "",
          skills: "",
          preferredRole: "",
          preferredLocation: "",
        };
  } catch {
    return {
      name: "",
      degree: "",
      branch: "",
      year: "",
      skills: "",
      preferredRole: "",
      preferredLocation: "",
    };
  }
});
useEffect(() => {
  localStorage.setItem(
    "internscout_profile",
    JSON.stringify(profile)
  );
}, [profile]);

  const updateProfile = (field, value) => {
    setProfile({
      ...profile,
      [field]: value
    });
  };
const baseJobs = showSavedJobs ? savedJobs : jobs;

const filteredJobs = baseJobs
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


// saved jobs functionality
const toggleSaveJob = (job) => {
  setSavedJobs((currentSavedJobs) => {
    const alreadySaved = currentSavedJobs.some(
      (savedJob) => savedJob.job_id === job.job_id
    );

    const updatedJobs = alreadySaved
      ? currentSavedJobs.filter(
          (savedJob) => savedJob.job_id !== job.job_id
        )
      : [...currentSavedJobs, job];

    localStorage.setItem(
      "internscout_saved_jobs",
      JSON.stringify(updatedJobs)
    );

    return updatedJobs;
  });
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
      <ProfileForm
        profile={profile}
        updateProfile={updateProfile}
      />


      {/* Search Section */}
   
      
      <SearchBar
  query={query}
  setQuery={setQuery}
  location={location}
  setLocation={setLocation}
  internshipsOnly={internshipsOnly}
  setInternshipsOnly={setInternshipsOnly}
  searchJobs={searchJobs}
  showSavedJobs={showSavedJobs}
  setShowSavedJobs={setShowSavedJobs}
  savedJobs={savedJobs}
/>



      {/* Results */}
      <main className="results">
  <ResultMessage

loading={loading}
searched={searched}
filteredJobs={filteredJobs}
showSavedJobs={showSavedJobs}
companyFilter={companyFilter}
setCompanyFilter={setCompanyFilter}
/>

        

{!loading && filteredJobs.length > 0 && (
  <JobResults
    filteredJobs={sortedJobs}
    showSavedJobs={showSavedJobs}
    sortBy={sortBy}
    setSortBy={setSortBy}
    companyFilter={companyFilter}
    setCompanyFilter={setCompanyFilter}
    companySuggestions={companySuggestions}
    allCompanies={allCompanies}
    fallbackCompanies={fallbackCompanies}
    profile={profile}
    savedJobs={savedJobs}
    toggleSaveJob={toggleSaveJob}
    setSelectedJob={setSelectedJob}
    calculateJobMatch={calculateJobMatch}
    nextPageToken={nextPageToken}
    loadMoreJobs={loadMoreJobs}
    loadingMore={loadingMore}
  />
)}

      </main>

      {/*  Job Details Modal */}
<JobDetailsModal
  selectedJob={selectedJob}
  profile={profile}
  setSelectedJob={setSelectedJob}
  calculateJobMatch={calculateJobMatch}
/>
    </div>
  );
}

export default App;