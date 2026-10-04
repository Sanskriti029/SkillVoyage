import { DEFAULT_PROFILE } from "../constants";

export function loadSavedJobs() {
  try {
    return (
      JSON.parse(localStorage.getItem("internscout_saved_jobs")) || []
    );
  } catch {
    return [];
  }
}

export function saveSavedJobs(jobs) {
  localStorage.setItem(
    "internscout_saved_jobs",
    JSON.stringify(jobs)
  );
}

export function loadProfile() {
  try {
    const savedProfile = localStorage.getItem("internscout_profile");

    return savedProfile
      ? JSON.parse(savedProfile)
      : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile) {
  localStorage.setItem(
    "internscout_profile",
    JSON.stringify(profile)
  );
}