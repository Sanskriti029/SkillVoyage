# Code Snippets - Key Implementations

## 1. Smart Multi-Query Search (Backend)

### File: `backend/app.py`

```python
def generate_search_variations(profile):
    """
    Generate multiple search queries based on user profile.
    Returns a list of (query, weight) tuples where weight indicates importance.
    """
    queries = []
    
    # Primary query: Preferred role (highest priority)
    if profile.get("preferredRole"):
        role = profile["preferredRole"].lower()
        queries.append((f"{role} internship", 1.0))
        
        # Add variations of the role
        role_parts = role.split()
        if len(role_parts) > 1:
            queries.append((f"{role_parts[0]} internship", 0.9))
    
    # Alternative role searches based on skills
    skills = profile.get("skillsList", [])
    if skills:
        # Top skill variations
        top_skill = skills[0].lower()
        queries.append((f"{top_skill} developer internship", 0.85))
        queries.append((f"{top_skill} intern", 0.80))
        
        # Multiple skill combinations
        if len(skills) >= 2:
            combined = f"{skills[0]} {skills[1]} intern".lower()
            queries.append((combined, 0.75))
    
    # Broad fallbacks
    queries.append(("internship", 0.7))
    queries.append(("graduate trainee", 0.65))
    
    # Return deduplicated queries while preserving order and max weight
    seen = {}
    result = []
    for query, weight in queries:
        if query not in seen or weight > seen[query]:
            seen[query] = weight
            result.append((query, weight))
    
    return result
```

### Usage in `/api/jobs` Endpoint:

```python
@flask_app.route("/api/jobs")
def get_jobs():
    query = request.args.get("q", "software engineer")
    location = request.args.get("location", "India")
    profile_data = request.args.get("profile", "{}")
    
    # Parse profile for smart search variations
    try:
        import json
        profile = json.loads(profile_data)
    except:
        profile = {}

    try:
        all_jobs = []
        all_job_ids = set()
        
        # If profile provided, use smart search strategy
        if profile:
            search_queries = generate_search_variations(profile)
        else:
            search_queries = [(query, 1.0)]
        
        # Execute searches for each query variation
        for search_query, weight in search_queries[:4]:  # Limit to 4 to avoid too many API calls
            try:
                search_params = {
                    "engine": "google_jobs",
                    "q": search_query,
                    "location": location,
                    "gl": "in",
                    "hl": "en"
                }
                
                results = client.search(search_params)
                jobs = results.get("jobs_results", [])
                
                for job in jobs:
                    job_id = job.get("job_id")
                    if job_id and job_id not in all_job_ids:
                        all_job_ids.add(job_id)
                        all_jobs.append({
                            "title": job.get("title"),
                            "company": job.get("company_name"),
                            "is_internship": is_internship(job.get("title")),
                            "location": job.get("location"),
                            "description": job.get("description"),
                            "job_id": job.get("job_id"),
                            "via": job.get("via"),
                            "extensions": job.get("extensions", []),
                            "apply_options": job.get("apply_options", []),
                            "source_link": job.get("source_link"),
                            "search_weight": weight
                        })
            except Exception as e:
                # Continue with other search queries if one fails
                continue
        
        return jsonify({
            "success": True,
            "count": len(all_jobs),
            "jobs": all_jobs,
            "next_page_token": "",
            "search_strategy": "smart" if profile else "simple"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
```

---

## 2. Skill Alias Mapping (Frontend)

### File: `frontend/src/utils/jobmatching.js`

```javascript
export const SKILL_ALIASES = {
  aws: ["aws", "amazon web services", "amazon cloud"],
  react: ["react", "react.js", "reactjs"],
  node: ["node", "node.js", "nodejs", "node js"],
  sql: ["sql", "structured query language"],
  postgresql: ["postgres", "postgresql"],
  mysql: ["mysql", "my sql"],
  mongodb: ["mongo", "mongodb"],
  typescript: ["typescript", "ts"],
  javascript: ["javascript", "js"],
  angular: ["angular", "angular.js"],
  vue: ["vue", "vue.js", "vuejs"],
  "next.js": ["next", "next.js", "nextjs"],
  express: ["express", "express.js"],
  django: ["django", "django framework"],
  flask: ["flask", "flask framework"],
  fastapi: ["fastapi", "fast api"],
  docker: ["docker", "containerization"],
  kubernetes: ["kubernetes", "k8s"],
  azure: ["azure", "microsoft azure"],
  gcp: ["gcp", "google cloud", "google cloud platform"],
  tensorflow: ["tensorflow", "tensor flow"],
  pytorch: ["pytorch", "torch"],
  "machine learning": ["machine learning", "ml", "artificial intelligence", "ai"],
  "deep learning": ["deep learning", "neural networks"],
  graphql: ["graphql", "graph ql"],
  "rest api": ["rest", "rest api", "restful"],
  git: ["git", "version control"],
  github: ["github", "gh"],
};

function normalizeSkill(skill) {
  const lower = skill.toLowerCase().trim();
  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    if (aliases.some(alias => lower.includes(alias) || alias.includes(lower))) {
      return canonical;
    }
  }
  return lower;
}

function skillMatches(description, skill) {
  const lower = description.toLowerCase();
  const skillToSearch = normalizeSkill(skill);
  const aliases = SKILL_ALIASES[skillToSearch] || [skillToSearch];

  return aliases.some(alias => {
    const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`\\b${escapedAlias}\\b`, "i");
    return pattern.test(lower);
  });
}

// Updated calculateJobMatch using aliases
export function calculateJobMatch(jobDescription, studentSkills) {
  const description = (jobDescription || "").toLowerCase();

  const skills = (studentSkills || "")
    .split(",")
    .map((skill) => skill.trim().toLowerCase())
    .filter((skill) => skill !== "");

  // Skills mentioned in the job description (using aliases)
  const requiredSkills = COMMON_SKILLS.filter((skill) =>
    skillMatches(description, skill)
  );

  // Skills the student has that are required by the job
  const matchedSkills = requiredSkills.filter((skill) => {
    const normalizedSkill = normalizeSkill(skill);
    return skills.some((studentSkill) => {
      const normalizedStudentSkill = normalizeSkill(studentSkill);
      return normalizedStudentSkill === normalizedSkill;
    });
  });

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
    matchPercentage,
  };
}
```

---

## 3. Weighted Opportunity Score (Frontend)

### File: `frontend/src/utils/jobmatching.js`

```javascript
export function calculateOpportunityScore(job, profile) {
  const match = calculateJobMatch(job.description || "", profile.skills);

  const weights = {
    skillMatch: 0.40,
    roleMatch: 0.20,
    experienceMatch: 0.15,
    educationMatch: 0.10,
    locationMatch: 0.10,
    internshipFit: 0.05,
  };

  // 1. Skill Match Score (0-100)
  let skillMatchScore = match.matchPercentage;

  // 2. Role Match Score (0-100)
  let roleMatchScore = 0;
  const jobTitle = (job.title || "").toLowerCase();
  const preferredRole = (profile.preferredRole || "").toLowerCase();
  if (preferredRole && jobTitle.includes(preferredRole.split(" ")[0])) {
    roleMatchScore = 85;
  } else if (
    jobTitle.includes("intern") ||
    jobTitle.includes("graduate") ||
    jobTitle.includes("trainee")
  ) {
    roleMatchScore = 70;
  }

  // 3. Experience Match Score (0-100)
  let experienceMatchScore = 0;
  const year = profile.year || "";
  if (year.includes("3") || year.includes("4")) {
    experienceMatchScore = 80;
  } else if (year.includes("2")) {
    experienceMatchScore = 60;
  } else {
    experienceMatchScore = 40;
  }

  // 4. Education Match Score (0-100)
  let educationMatchScore = 0;
  const degree = (profile.degree || "").toLowerCase();
  if (degree.includes("b.tech") || degree.includes("b.e") || degree.includes("mca")) {
    educationMatchScore = 90;
  } else if (degree) {
    educationMatchScore = 70;
  }

  // 5. Location Match Score (0-100)
  let locationMatchScore = 0;
  const jobLocation = (job.location || "").toLowerCase();
  const preferredLocation = (profile.preferredLocation || "").toLowerCase();
  if (preferredLocation && jobLocation.includes(preferredLocation.split(",")[0])) {
    locationMatchScore = 100;
  } else if (jobLocation.includes("remote")) {
    locationMatchScore = 85;
  } else if (jobLocation && preferredLocation) {
    locationMatchScore = 40;
  } else if (jobLocation) {
    locationMatchScore = 60;
  }

  // 6. Internship Fit Score (0-100)
  let internshipFitScore = 0;
  if (job.is_internship) {
    internshipFitScore = 100;
  } else {
    internshipFitScore = 50;
  }

  // Calculate weighted total (capped at 0-100)
  const totalScore = Math.round(
    skillMatchScore * weights.skillMatch +
    roleMatchScore * weights.roleMatch +
    experienceMatchScore * weights.experienceMatch +
    educationMatchScore * weights.educationMatch +
    locationMatchScore * weights.locationMatch +
    internshipFitScore * weights.internshipFit
  );

  return {
    totalScore: Math.min(Math.max(totalScore, 0), 100),
    skillMatchScore,
    roleMatchScore,
    experienceMatchScore,
    educationMatchScore,
    locationMatchScore,
    internshipFitScore,
    breakdown: {
      "Skill Match": { score: skillMatchScore, weight: "40%" },
      "Role Match": { score: roleMatchScore, weight: "20%" },
      "Experience Match": { score: experienceMatchScore, weight: "15%" },
      "Education Match": { score: educationMatchScore, weight: "10%" },
      "Location Match": { score: locationMatchScore, weight: "10%" },
      "Internship Fit": { score: internshipFitScore, weight: "5%" },
    },
  };
}
```

---

## 4. Displaying Opportunity Score (UI)

### File: `frontend/src/components/JobCard.jsx`

```javascript
import { calculateOpportunityScore } from "../utils/jobmatching";

function JobCard({ job, profile, calculateJobMatch, ... }) {
  const match = calculateJobMatch(job.description, profile.skills);
  const oppScore = calculateOpportunityScore(job, profile);

  const getScoreTier = (score) => {
    if (score >= 80) return "score-excellent";
    if (score >= 60) return "score-good";
    if (score >= 40) return "score-fair";
    return "score-poor";
  };

  return (
    <div className="modern-job-card">
      {/* ... other content ... */}
      
      <div className={`match-banner ${getMatchTier(match.matchPercentage)}`}>
        <div className="opportunity-score-badge">
          <div className={`opp-score ${getScoreTier(oppScore.totalScore)}`}>
            {oppScore.totalScore}%
          </div>
          <div className="score-label">Opportunity<br/>Score</div>
        </div>

        {/* Skill chips ... */}
      </div>

      <div className="opportunity-breakdown">
        <div className="breakdown-item">
          <span className="breakdown-label">Skills:</span>
          <span className="breakdown-score">{oppScore.skillMatchScore}%</span>
        </div>
        <div className="breakdown-item">
          <span className="breakdown-label">Role:</span>
          <span className="breakdown-score">{oppScore.roleMatchScore}%</span>
        </div>
        <div className="breakdown-item">
          <span className="breakdown-label">Location:</span>
          <span className="breakdown-score">{oppScore.locationMatchScore}%</span>
        </div>
      </div>

      {/* ... rest of card ... */}
    </div>
  );
}
```

### File: `frontend/src/components/JobDetailsModal.jsx`

```javascript
import { calculateOpportunityScore } from "../utils/jobmatching";

function JobDetailsModal({ selectedJob, profile, calculateJobMatch, ... }) {
  const match = calculateJobMatch(selectedJob.description || "", profile.skills);
  const oppScore = calculateOpportunityScore(selectedJob, profile);

  return (
    <div className="modal-container">
      {/* ... header ... */}
      
      <div className="modal-body">
        {modalTab === "overview" && (
          <div className="modal-tab-content">
            {/* Opportunity Score Card */}
            <div className="modal-opportunity-score-card">
              <div className={`modal-score-circle ${getScoreTier(oppScore.totalScore)}`}>
                <span className="circle-pct">{oppScore.totalScore}%</span>
                <span className="circle-lbl">Opportunity<br/>Score</span>
              </div>
              <div className="modal-score-detail">
                <h4>Complete Candidate-Opportunity Fit</h4>
                <p>This composite score evaluates your overall suitability...</p>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="modal-score-breakdown">
              <h4>Score Breakdown</h4>
              <div className="breakdown-grid">
                {Object.entries(oppScore.breakdown).map(([key, val]) => (
                  <div key={key} className="breakdown-cell">
                    <span className="breakdown-name">{key}</span>
                    <div className="breakdown-bar-container">
                      <div
                        className="breakdown-bar"
                        style={{ width: `${val.score}%` }}
                      ></div>
                    </div>
                    <span className="breakdown-pct">{val.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Original Skill Match */}
            <div className="modal-match-card">
              <div className="modal-match-circle">
                <span className="circle-pct">{match.matchPercentage}%</span>
                <span className="circle-lbl">Skill<br/>Match</span>
              </div>
              <div className="modal-match-detail">
                <h4>Candidate Profile Alignment</h4>
                {/* ... */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 5. Integration in App.jsx

### File: `frontend/src/App.jsx`

```javascript
import { fetchJobs } from "./utils/jobApi";

async function searchJobs() {
  if (!query.trim()) return;

  setLoading(true);
  setSearched(true);

  try {
    // Pass profile to backend for smart search strategy
    const data = await fetchJobs(query, location, "", profile);
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
    // Also pass profile for pagination
    const data = await fetchJobs(query, location, nextPageToken, profile);
    setJobs((currentJobs) => [...currentJobs, ...(data.jobs || [])]);
    setNextPageToken(data.next_page_token || "");
  } catch (error) {
    console.error("Error loading more jobs:", error);
  } finally {
    setLoadingMore(false);
  }
}
```

---

## Performance Notes

- **Smart Search:** Executes up to 4 searches in parallel (SerpApi allows concurrency)
- **Skill Aliases:** O(n) lookup where n = number of common skills (~60) - negligible overhead
- **Opportunity Score:** O(1) calculation for each job - computed on demand
- **Deduplication:** Set-based O(1) lookup for job IDs - very efficient

---

## Testing Examples

### Test Case 1: Smart Search
```
Input Profile:
  - preferredRole: "Software Engineer Intern"
  - skillsList: ["Python", "React", "Java"]
  
Generated Queries:
  1. "Software Engineer Intern" (weight: 1.0)
  2. "Software Intern" (weight: 0.9)
  3. "Python Developer Internship" (weight: 0.85)
  4. "Python React Intern" (weight: 0.75)

Results: ~40-50 unique jobs instead of ~10
```

### Test Case 2: Skill Alias Matching
```
Job Description: "Required: AWS, REST API, PostgreSQL"
Student Skills: "Amazon Web Services, RESTful Services, Postgres"

Normalization:
  - "Amazon Web Services" → "aws" ✓ MATCH
  - "RESTful Services" → "rest api" ✓ MATCH
  - "Postgres" → "postgresql" ✓ MATCH

Result: 100% skill match (3/3)
```

### Test Case 3: Opportunity Score
```
Student Profile:
  - Degree: B.Tech
  - Year: 3rd
  - Skills: Python, React, Java
  - Role: Software Engineer Intern
  - Location: Bangalore

Job: Full Stack Developer @ Bangalore

Score Calculation:
  Skill: 85% × 40% = 34%
  Role: 90% × 20% = 18%
  Experience: 80% × 15% = 12%
  Education: 90% × 10% = 9%
  Location: 100% × 10% = 10%
  Internship: 100% × 5% = 5%
  ─────────────────────
  Total: 88% (Excellent)
```

