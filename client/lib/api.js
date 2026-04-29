const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Generate a new roadmap via the backend AI service
 */
export async function generateRoadmap(goal, userId = "anonymous") {
  const res = await fetch(`${API_BASE}/api/generate-roadmap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal, userId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Server error: ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch a roadmap by its ID
 */
export async function getRoadmap(id) {
  const res = await fetch(`${API_BASE}/api/roadmap/${id}`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Server error: ${res.status}`);
  }

  return res.json();
}

/**
 * List all roadmaps
 */
export async function listRoadmaps(userId) {
  const url = userId
    ? `${API_BASE}/api/roadmaps?userId=${encodeURIComponent(userId)}`
    : `${API_BASE}/api/roadmaps`;

  const res = await fetch(url);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Server error: ${res.status}`);
  }

  return res.json();
}

/**
 * Update a step's status
 */
export async function updateStep(roadmapId, stepId, status) {
  const res = await fetch(`${API_BASE}/api/update-step`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roadmapId, stepId, status }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Server error: ${res.status}`);
  }

  return res.json();
}

/**
 * Delete a roadmap
 */
export async function deleteRoadmap(id) {
  const res = await fetch(`${API_BASE}/api/roadmap/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Server error: ${res.status}`);
  }

  return res.json();
}
