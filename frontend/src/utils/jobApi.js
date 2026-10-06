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

export async function parseResumeApi({ file, text }) {
  let response;

  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    response = await fetch(`${API_BASE_URL}/api/parse-resume`, {
      method: "POST",
      body: formData,
    });
  } else {
    response = await fetch(`${API_BASE_URL}/api/parse-resume`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
  }

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to parse resume on server");
  }

  return data;
}