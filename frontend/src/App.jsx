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
import { calculateJobMatch } from "./utils/jobmatching";

import {
  loadSavedJobs,
  saveSavedJobs,
  loadProfile,
  saveProfile,
} from "./utils/storage";
import { fetchJobs } from "./utils/jobApi";

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




const [savedJobs, setSavedJobs] = useState(loadSavedJobs);

const [showSavedJobs, setShowSavedJobs] = useState(false);


  // Student profile
 const [profile, setProfile] = useState(loadProfile);

 
useEffect(() => {
  saveProfile(profile);
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


  async function searchJobs() {
  if (!query.trim()) {
    return;
  }

  setLoading(true);
  setSearched(true);
  setShowSavedJobs(false);

  try {
    const data = await fetchJobs(query, location);

    setJobs(data.jobs || []);
    setNextPageToken(data.next_page_token || "");
  } catch (error) {
    console.error("Error fetching jobs:", error);
    setJobs([]);
    setNextPageToken("");
  } finally {
    setLoading(false);
  }
}

async function loadMoreJobs() {
  if (!nextPageToken || loadingMore) {
    return;
  }

  setLoadingMore(true);

  try {
    const data = await fetchJobs(
      query,
      location,
      nextPageToken
    );

    setJobs((currentJobs) => [
      ...currentJobs,
      ...(data.jobs || []),
    ]);

    setNextPageToken(data.next_page_token || "");
  } catch (error) {
    console.error("Error loading more jobs:", error);
  } finally {
    setLoadingMore(false);
  }
}



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

   saveSavedJobs(updatedJobs);

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