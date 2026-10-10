import { useEffect, useState } from "react";
import "./App.css";

import SearchBar from "./components/SearchBar";
import Navbar from "./components/Navbar";
import ProfileForm from "./components/ProfileForm";
import Dashboard from "./components/Dashboard";
import KanbanTracker from "./components/KanbanTracker";
import JobResults from "./components/JobResults";
import ResultsMessage from "./components/ResultsMessage";
import JobDetailsModal from "./components/JobDetailsModal";
import CoverLetterModal from "./components/CoverLetterModal";
import MockInterviewModal from "./components/MockInterviewModal";
import AuthPage from "./components/AuthPage";
import HomePage from "./components/HomePage";

import {
  calculateJobMatch,
  calculateOpportunityScore,
} from "./utils/jobMatching";
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

  // Navigation tab state: 'search' | 'saved' | 'dashboard' | 'profile'
const [activeTab, setActiveTab] = useState("home");

  const [nextPageToken, setNextPageToken] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [companyFilter, setCompanyFilter] = useState("");
  const [jobLocationFilter, setJobLocationFilter] = useState("");

  const [sortBy, setSortBy] = useState("match");
  const [selectedJob, setSelectedJob] = useState(null);

  // Hackathon Modal state triggers
  const [pitchJob, setPitchJob] = useState(null);
  const [interviewJob, setInterviewJob] = useState(null);

  const [savedJobs, setSavedJobs] = useState(loadSavedJobs);
  const [profile, setProfile] = useState(loadProfile);


  const [loggedInUser, setLoggedInUser] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("SkillVoyage_logged_in")) || null;
  } catch {
    return null;
  }
});

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const updateProfile = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const profileFields = [
    profile.name,
    profile.degree,
    profile.branch,
    profile.year,
    profile.skills,
    profile.preferredRole,
    profile.preferredLocation,
  ];
  const completedFields = profileFields.filter((f) => f && f.trim() !== "").length;
  const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

  const showSavedJobs = activeTab === "saved";
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
    .filter((company) => !companySuggestions.includes(company))
    .slice(0, 5);

  async function searchJobs(queryOverride = query) {
  const searchQuery = queryOverride.trim();

  if (!searchQuery) return;

  setLoading(true);
  setSearched(true);

  if (activeTab !== "saved") {
    setActiveTab("search");
  }

  try {
    const data = await fetchJobs(
      searchQuery,
      location,
      "",
      profile
    );

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
    if (!nextPageToken || loadingMore) return;

    setLoadingMore(true);

    try {
      const data = await fetchJobs(query, location, nextPageToken, profile);
      setJobs((currentJobs) => [...currentJobs, ...(data.jobs || [])]);
      setNextPageToken(data.next_page_token || "");
    } catch (error) {
      console.error("Error loading more jobs:", error);
    } finally {
      setLoadingMore(false);
    }
  }

  // Sorting
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "company") {
      return (a.company || "").localeCompare(b.company || "", undefined, {
        sensitivity: "base",
      });
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

  const toggleSaveJob = (job) => {
    setSavedJobs((currentSavedJobs) => {
      const alreadySaved = currentSavedJobs.some(
        (savedJob) => savedJob.job_id === job.job_id
      );

      const updatedJobs = alreadySaved
        ? currentSavedJobs.filter(
            (savedJob) => savedJob.job_id !== job.job_id
          )
        : [...currentSavedJobs, { ...job, status: "saved" }];

      saveSavedJobs(updatedJobs);
      return updatedJobs;
    });
  };
if (!loggedInUser) {
  return (
    <AuthPage
  onLogin={(user) => {
    setLoggedInUser(user);
    setActiveTab("home");
  }}
/>
  );
}
  return (
    <div className="app-shell">
      <Navbar
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  savedJobsCount={savedJobs.length}
  profileCompletion={profileCompletion}
  loggedInUser={loggedInUser}
  onLogout={() => {
    localStorage.removeItem("SkillVoyage_logged_in");
    setLoggedInUser(null);
  }}
/>

      {/* Main Content Body */}
      <main className="main-content">
  {activeTab === "home" ? (
    <HomePage
      loggedInUser={loggedInUser}
      profile={profile}
      savedJobs={savedJobs}
      profileCompletion={profileCompletion}
      setActiveTab={setActiveTab}
    />
  ) : activeTab === "profile" ? (
          <ProfileForm
            profile={profile}
            updateProfile={updateProfile}
            setProfile={setProfile}
          />
        ) : activeTab === "dashboard" ? (
          <Dashboard
            profile={profile}
            savedJobs={savedJobs}
            setActiveTab={setActiveTab}
            setSelectedJob={setSelectedJob}
          />
        ) : activeTab === "saved" ? (
          <KanbanTracker
            savedJobs={savedJobs}
            setSavedJobs={setSavedJobs}
            setSelectedJob={setSelectedJob}
            toggleSaveJob={toggleSaveJob}
          />
        ) : (
          <>
            {/* Hero & Search Header */}
            <SearchBar
              query={query}
              setQuery={setQuery}
              location={location}
              setLocation={setLocation}
              internshipsOnly={internshipsOnly}
              setInternshipsOnly={setInternshipsOnly}
              searchJobs={searchJobs}
              loading={loading}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              savedJobsCount={savedJobs.length}
            />

            {/* Results / Empty Messages */}
            <div className="results-container">
              <ResultsMessage
                loading={loading}
                searched={searched}
                filteredJobs={filteredJobs}
                showSavedJobs={showSavedJobs}
                companyFilter={companyFilter}
                setCompanyFilter={setCompanyFilter}
              />

              {!loading && (searched || showSavedJobs) && filteredJobs.length > 0 && (
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
                  onOpenPitch={(j) => setPitchJob(j)}
                  onOpenInterview={(j) => setInterviewJob(j)}
                />
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>🎯 <strong>SkillVoyage</strong> — AI-Powered Internship Search & Candidate Skill Matching</p>
          <p className="footer-sub">
            Built with React, Flask & SerpApi. Features AI Resume Parsing, Application Pitch Generators, and Job Mock Interviews.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <JobDetailsModal
        selectedJob={selectedJob}
        profile={profile}
        setSelectedJob={setSelectedJob}
        calculateJobMatch={calculateJobMatch}
        onOpenPitch={(j) => setPitchJob(j)}
        onOpenInterview={(j) => setInterviewJob(j)}
      />

      {pitchJob && (
        <CoverLetterModal
          job={pitchJob}
          profile={profile}
          match={calculateJobMatch(pitchJob.description, profile.skills)}
          onClose={() => setPitchJob(null)}
        />
      )}

      {interviewJob && (
        <MockInterviewModal
          job={interviewJob}
          match={calculateJobMatch(interviewJob.description, profile.skills)}
          onClose={() => setInterviewJob(null)}
        />
      )}
    </div>
  );
}

export default App;