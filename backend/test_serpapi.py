import os
from dotenv import load_dotenv
import serpapi

load_dotenv()

api_key = os.getenv("SERPAPI_KEY")

client = serpapi.Client(api_key=api_key)

results = client.search({
    "engine": "google_jobs",
    "q": "software engineer",
    "location": "Bangalore, India",
    "gl": "in",
    "hl": "en"
})

print("SEARCH STATUS:")
print(results.get("search_metadata"))

print("\nSEARCH PARAMETERS:")
print(results.get("search_parameters"))

print("\nNUMBER OF JOBS:")
print(len(results.get("jobs_results", [])))

print("\nFIRST JOB:")
if results.get("jobs_results"):
    print(results["jobs_results"][0])
else:
    print("NO JOBS FOUND")