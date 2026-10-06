import os
import io
import re

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import serpapi


# Load environment variables
load_dotenv()

# Create Flask application
flask_app = Flask(__name__)

# Enable CORS
CORS(flask_app)

# Get SerpApi API key
api_key = os.getenv("SERPAPI_KEY")

if not api_key:
    raise ValueError("SERPAPI_KEY not found in .env")

# Create SerpApi client
client = serpapi.Client(api_key=api_key)
INTERNSHIP_KEYWORDS = [
    "intern",
    "internship",
    "summer intern",
    "winter intern",
    "sde intern",
    "software engineer intern",
    "software developer intern",
    "technology intern",
    "engineering intern"
]

def is_internship(title):
    title = (title or "").lower()

    return any(
        keyword in title
        for keyword in INTERNSHIP_KEYWORDS
    )

COMMON_SKILLS_PY = [
    "javascript", "typescript", "java", "python", "c++", "c", "c#", "go", "rust",
    "kotlin", "swift", "php", "ruby", "react", "next.js", "angular", "vue",
    "node.js", "express", "flask", "django", "fastapi", "html", "css", "tailwind",
    "bootstrap", "sql", "mysql", "postgresql", "mongodb", "redis", "firebase",
    "git", "github", "docker", "kubernetes", "aws", "azure", "gcp",
    "machine learning", "deep learning", "tensorflow", "pytorch", "scikit-learn",
    "pandas", "numpy", "opencv", "nlp", "rest api", "graphql", "data structures",
    "algorithms", "system design", "devops", "ci/cd", "agile", "communication",
    "problem solving", "teamwork"
]

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

def extract_text_from_file(file_storage):
    filename = file_storage.filename.lower()
    if filename.endswith(".pdf"):
        import pypdf
        reader = pypdf.PdfReader(file_storage.stream)
        text_pages = [page.extract_text() or "" for page in reader.pages]
        return "\n".join(text_pages)
    elif filename.endswith(".docx") or filename.endswith(".doc"):
        import docx
        doc = docx.Document(file_storage.stream)
        text_paragraphs = [p.text for p in doc.paragraphs]
        return "\n".join(text_paragraphs)
    else:
        content = file_storage.read()
        try:
            return content.decode("utf-8")
        except Exception:
            return content.decode("latin-1", errors="ignore")

def parse_resume_content(text):
    if not text:
        return {}

    lines = [l.strip() for l in text.splitlines() if l.strip()]

    # Email
    email = ""
    email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b', text)
    if email_match:
        email = email_match.group(0)

    # Phone
    phone = ""
    phone_match = re.search(r'(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}', text)
    if phone_match:
        phone = phone_match.group(0)

    # Name
    name = ""
    for line in lines[:8]:
        clean_line = re.sub(r'[^a-zA-Z\s.]', '', line).strip()
        word_count = len(clean_line.split())
        if (not re.search(r'resume|cv|contact|email|phone|github|linkedin|education|skills', line, re.I)
            and '@' not in line
            and 2 <= word_count <= 4
            and re.match(r'^[A-Z][a-z]+(\s+[A-Z][a-z]+)+$', clean_line)):
            name = clean_line
            break

    if not name and lines:
        clean_first = re.sub(r'[^a-zA-Z\s]', '', lines[0]).strip()
        if 2 <= len(clean_first.split()) <= 4 and not re.search(r'resume|cv|profile', clean_first, re.I):
            name = clean_first

    # Skills
    detected_skills = []
    for skill in COMMON_SKILLS_PY:
        escaped = re.escape(skill)
        pattern = re.compile(rf'(?:^|[^a-zA-Z0-9+#]){escaped}(?:$|[^a-zA-Z0-9+#])', re.I)
        if pattern.search(text):
            disp = skill
            if skill in ["c++", "c#"]: disp = skill.upper()
            elif skill in ["javascript", "typescript", "node.js", "next.js", "html", "css", "sql", "aws", "gcp"]: disp = skill.capitalize() if len(skill) > 4 else skill.upper()
            else: disp = " ".join([w.capitalize() for w in skill.split()])
            if disp not in detected_skills:
                detected_skills.append(disp)

    # Degree
    degree = ""
    if re.search(r'b\.?tech|bachelor of technology', text, re.I): degree = "B.Tech"
    elif re.search(r'b\.?e\b|bachelor of engineering', text, re.I): degree = "B.E."
    elif re.search(r'm\.?tech|master of technology', text, re.I): degree = "M.Tech"
    elif re.search(r'm\.?s\b|master of science', text, re.I): degree = "M.S."
    elif re.search(r'b\.?sc|bachelor of science', text, re.I): degree = "B.Sc"
    elif re.search(r'm\.?ca|master of computer applications', text, re.I): degree = "MCA"
    elif re.search(r'b\.?ca|bachelor of computer applications', text, re.I): degree = "BCA"
    elif re.search(r'ph\.?d|doctorate', text, re.I): degree = "Ph.D."
    elif re.search(r'diploma', text, re.I): degree = "Diploma"

    # Branch
    branch = ""
    if re.search(r'computer science|cse', text, re.I): branch = "Computer Science & Engineering"
    elif re.search(r'information technology|\bit\b', text, re.I): branch = "Information Technology"
    elif re.search(r'artificial intelligence|\bai\b|machine learning|\bml\b', text, re.I): branch = "Artificial Intelligence & ML"
    elif re.search(r'data science', text, re.I): branch = "Data Science"
    elif re.search(r'electronics|ece', text, re.I): branch = "Electronics & Communication"

    # Year
    year = ""
    if re.search(r'4th year|final year|2025', text, re.I): year = "4th Year"
    elif re.search(r'3rd year|penultimate|2026', text, re.I): year = "3rd Year"
    elif re.search(r'2nd year|2027', text, re.I): year = "2nd Year"
    elif re.search(r'1st year|2028', text, re.I): year = "1st Year"

    # Target Role
    preferredRole = ""
    role_match = re.search(r'(full stack|frontend|backend|software engineer|data scientist|machine learning engineer|sde|web developer|devops engineer|mobile developer)', text, re.I)
    if role_match:
        cap_role = " ".join([w.capitalize() for w in role_match.group(0).split()])
        preferredRole = cap_role if "intern" in cap_role.lower() else f"{cap_role} Intern"

    # Location
    preferredLocation = ""
    loc_match = re.search(r'(bangalore|bengaluru|mumbai|pune|hyderabad|delhi|noida|gurgaon|chennai|remote|san francisco|india)', text, re.I)
    if loc_match:
        loc = loc_match.group(0).capitalize()
        preferredLocation = "Bangalore, India" if loc.lower() == "bengaluru" else ("Remote" if loc.lower() == "remote" else f"{loc}, India")

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "degree": degree,
        "branch": branch,
        "year": year,
        "skills": ", ".join(detected_skills),
        "skillsList": detected_skills,
        "preferredRole": preferredRole,
        "preferredLocation": preferredLocation,
        "detectedSkillsCount": len(detected_skills)
    }

# -------------------------
# HOME ROUTE
# -------------------------

@flask_app.route("/")
def home():
    return jsonify({
        "message": "InternScout backend is running!"
    })


# -------------------------
# RESUME PARSE ROUTE
# -------------------------

@flask_app.route("/api/parse-resume", methods=["POST"])
def parse_resume():
    try:
        extracted_text = ""
        filename = ""

        if "file" in request.files:
            uploaded_file = request.files["file"]
            filename = uploaded_file.filename
            extracted_text = extract_text_from_file(uploaded_file)
        elif request.is_json:
            data = request.get_json() or {}
            extracted_text = data.get("text", "")
        else:
            return jsonify({
                "success": False,
                "error": "No file or text payload provided"
            }), 400

        parsed_data = parse_resume_content(extracted_text)

        return jsonify({
            "success": True,
            "filename": filename,
            "raw_text": extracted_text[:1000],  # preview of raw text
            "extracted": parsed_data
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Failed to parse resume: {str(e)}"
        }), 500


# -------------------------
# JOBS ROUTE
# -------------------------

@flask_app.route("/api/jobs")
def get_jobs():

    query = request.args.get(
        "q",
        "software engineer"
    )

    location = request.args.get(
        "location",
        "India"
    )
    
    profile_data = request.args.get("profile", "{}")
    
    # Try to parse profile for smart search variations
    try:
        import json
        profile = json.loads(profile_data)
    except:
        profile = {}

    try:
        # Collect all jobs from multiple search variations
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

                # Request the next page only when a token is supplied
                next_page_token = request.args.get("next_page_token")

                if next_page_token and search_query == query:  # Only use pagination for main query
                    search_params["next_page_token"] = next_page_token

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
        
        # Get pagination token only from main query
        pagination_token = ""
        if not profile:
            try:
                search_params = {
                    "engine": "google_jobs",
                    "q": query,
                    "location": location,
                    "gl": "in",
                    "hl": "en"
                }
                results = client.search(search_params)
                pagination_token = results.get("serpapi_pagination", {}).get("next_page_token", "")
            except:
                pass

        return jsonify({
            "success": True,
            "count": len(all_jobs),
            "jobs": all_jobs,
            "next_page_token": pagination_token,
            "search_strategy": "smart" if profile else "simple"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# -------------------------
# START SERVER
# -------------------------

if __name__ == "__main__":
    flask_app.run(debug=True)