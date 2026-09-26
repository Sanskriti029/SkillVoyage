import os

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


# -------------------------
# HOME ROUTE
# -------------------------

@flask_app.route("/")
def home():
    return jsonify({
        "message": "InternScout backend is running!"
    })


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

    try:

        results = client.search({
            "engine": "google_jobs",
            "q": query,
            "location": location,
            "gl": "in",
            "hl": "en"
        })

        jobs = results.get("jobs_results", [])

        cleaned_jobs = []

        for job in jobs:

            cleaned_jobs.append({
                "title": job.get("title"),
                "company": job.get("company_name"),
                "location": job.get("location"),
                "description": job.get("description"),
                "job_id": job.get("job_id"),
                "via": job.get("via"),
                "extensions": job.get("extensions", []),
                "apply_options": job.get("apply_options", []),
                "source_link": job.get("source_link")
            })

        return jsonify({
            "success": True,
            "count": len(cleaned_jobs),
            "jobs": cleaned_jobs
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