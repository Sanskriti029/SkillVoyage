const API_BASE_URL = "http://127.0.0.1:5000";

export async function fetchJobs(query, location, pageToken = "") {
  const params = new URLSearchParams({
    q: query,
    location: location,
  });

  if (pageToken) {
    params.append("next_page_token", pageToken);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/jobs?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return await response.json();
}