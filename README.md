# SkillVoyage
### From skill gaps to career goals.

SkillVoyage is a personalized career discovery and preparation platform built to help students move from finding opportunities to preparing for them. It uses live job-search results to help students explore internships and jobs, understand how their skills align with a role, identify skill gaps, and plan their preparation.

> **Project:** SkillVoyage  
> **Tagline:** From skill gaps to career goals.  
> **Hackathon:** SerpApi India Hackathon 2026

---

## Table of Contents

- [Problem](#problem)
- [Solution](#solution)
- [Features](#features)
- [How It Works](#how-it-works)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Run Locally](#run-locally)
- [Configuration and API Key Safety](#configuration-and-api-key-safety)
- [Limitations](#limitations)
- [Future Improvements](#future-improvements)

## Problem

Students often find it difficult to discover relevant internships, determine which skills employers expect, and decide what to learn before applying. Job discovery, skill development, and interview preparation can feel like separate tasks.

## Solution

SkillVoyage brings these steps into one workflow:

1. Discover relevant job and internship opportunities.
2. Compare a student's listed skills with skills detected in a job description.
3. Review a match percentage and an Opportunity Score.
4. Identify skill gaps and explore suggested learning roadmaps.
5. Save opportunities and prepare with job-specific interview practice and application-pitch tools.

## Features

### 🔎 Job and Internship Discovery
- Search for opportunities by role and location.
- Retrieve job-search results through SerpApi's Google Jobs search.
- Load additional results when available.
- Filter and sort opportunities, including by company, location, and skill match.

### 🎯 Personalized Matching
- Compare skills in the student's profile with skills detected in available job descriptions.
- Show matched skills and potential skill gaps.
- Display a skill-match percentage when the job description contains enough identifiable skills.
- Provide an Opportunity Score based on the profile and job information.

**Note:** These scores are guidance for comparing opportunities, not a guarantee of selection or hiring.

### 🧭 Skill-Gap Learning Roadmaps
- Highlight skills that may need improvement.
- Show suggested learning topics and practice activities where a roadmap is available.

### 🎙️ Interview and Application Preparation
- Open job-specific interview-practice tools.
- Use the application-pitch feature to help prepare outreach or application content.

### ⭐ Saved Jobs and Student Dashboard
- Save jobs and revisit them later.
- Review profile information and job-search summaries in the dashboard.
- Store supported profile and saved-job information in browser local storage.

### 👤 Student Profile
- Add skills, education details, preferred roles, and preferred locations.
- Use profile information to personalize job matching.

## How It Works

1. **Search:** A student enters a role and location.
2. **Retrieve:** The Flask backend requests job results through SerpApi.
3. **Compare:** Skill-matching logic compares the profile with the available job description.
4. **Prioritize:** Skill-match information and the Opportunity Score help the student compare roles.
5. **Prepare:** The student reviews skill gaps, learning roadmaps, and interview/application preparation tools.

## Technology Stack

| Area | Technology |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Python, Flask |
| Job search | SerpApi — Google Jobs search, SerpApi Google Search API |
| Browser-side persistence | Local storage |


## Project Structure

The project is organized into a frontend and a Flask backend. The frontend includes React components for job cards, job details, profile management, the dashboard, filters, roadmaps, and preparation tools.

```text
├── .gitignore
├── README.md
├── backend
|     ├── app.py
|     ├── test_serpapi.py
├── frontend
|     ├── .gitignore
|     ├── README.md
|     ├── eslint.config.js
|     ├── index.html
|     ├── package-lock.json
|     ├── package.json
|     ├── public
|     |     ├── favicon.svg
|     |     ├── icons.svg
|     ├── src
|     |     ├── App.css
|     |     ├── App.jsx
|     |     ├── assets
|     |     |     ├── hero.png
|     |     |     ├── react.svg
|     |     |     ├── vite.svg
|     |     ├── components
|     |     |     ├── AuthPage.jsx
|     |     |     ├── CoverLetterModal.jsx
|     |     |     ├── Dashboard.jsx
|     |     |     ├── HomePage.css
|     |     |     ├── HomePage.jsx
|     |     |     ├── JobCard.jsx
|     |     |     ├── JobDetailsModal.jsx
|     |     |     ├── JobFilters.jsx
|     |     |     ├── JobResults.jsx
|     |     |     ├── KanbanTracker.jsx
|     |     |     ├── MockInterviewModal.jsx
|     |     |     ├── Navbar.jsx
|     |     |     ├── ProfileForm.jsx
|     |     |     ├── ResultsHeader.jsx
|     |     |     ├── ResultsMessage.jsx
|     |     |     ├── ResumeUploadModal.jsx
|     |     |     ├── SearchBar.jsx
|     |     ├── constants.js
|     |     ├── data
|     |     |     ├── skillRoadmaps.js
|     |     ├── index.css
|     |     ├── main.jsx
|     |     ├── utils
|     |     |     ├── coverLetterGenerator.js
|     |     |     ├── interviewQuestions.js
|     |     |     ├── jobApi.js
|     |     |     ├── jobmatching.js
|     |     |     ├── resumeParser.js
|     |     |     ├── storage.js
|     ├── vite.config.js

```


## Run Locally

### Prerequisites

- Git
- Node.js and npm
- Python
- A SerpApi API key

### 1. Clone the repository

```bash
git clone https://github.com/Sanskriti029/SkillVoyage.git
cd SkillVogaye
```

### 2. Start the backend

Open a terminal in the directory containing the Flask application.

Create and activate a virtual environment if your project setup uses one:

**Windows PowerShell**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install the backend dependencies using the dependency file included in your repository. If no dependency file exists, install the dependencies listed in the backend source and add a reproducible dependency file before submission.

Configure the SerpApi API key using the environment-variable name expected by your backend. Then start the Flask application using the command appropriate for your entry-point file.

### 3. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your browser.

> **Important:** Confirm the backend URL configured in the frontend matches the address and port where Flask is running. If your frontend currently calls `http://127.0.0.1:5000`, the backend must be available there during local development.

## Configuration and API Key Safety

- Keep your SerpApi API key on the backend.
- Store secrets in a local environment file or another server-side configuration mechanism supported by your backend.
- Add secret files such as `.env` to `.gitignore`.
- Never commit real API keys, passwords, access tokens, or private credentials.
- If a key was accidentally committed, revoke or rotate it; deleting it from the latest commit alone may not remove it from Git history.
- Do not expose a private API key in frontend code or a public repository.

## Limitations

- Job results depend on the data returned by SerpApi and may change over time.
- Match percentages depend on the skills detectable in the available job description and the skills entered in the profile.
- An Opportunity Score is an aid for comparing roles, not an objective hiring probability.
- Learning roadmaps are available only for skills supported by the project's roadmap data.
- Profile and saved-job persistence using browser local storage is browser-specific and is not the same as secure account-based cloud storage.
- Interview-practice and application-pitch features should be reviewed by the student before use. Do not describe them as powered by a live AI model unless the submitted implementation actually uses one.

## Future Improvements

- Secure user accounts and cloud-based profile synchronization.
- More robust skill extraction and synonym handling.
- More transparent explanations of each Opportunity Score component.
- Expanded learning resources and practice roadmaps.
- Automated tests for job search, scoring, filtering, and saved jobs.

---
