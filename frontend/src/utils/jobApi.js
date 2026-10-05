const API_BASE_URL = "http://127.0.0.1:5000";

export async function fetchJobs(query, location, pageToken = "") {
  const params = new URLSearchParams();

  params.append("q", query);

  if (location) {
    params.append("location", location);
  }

  if (pageToken) {
    params.append("next_page_token", pageToken);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/jobs?${params.toString()}`
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Backend error:", data);
    throw new Error(
      data.error || `Failed to fetch jobs (${response.status})`
    );
  }

  return data;
}