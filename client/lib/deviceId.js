/**
 * Gets or creates a unique device ID stored in localStorage.
 * This persists across sessions on the same device/browser.
 */
export function getDeviceId() {
  if (typeof window === "undefined") return "ssr"; // server-side guard

  const KEY = "roadmap_device_id";
  let deviceId = localStorage.getItem(KEY);

  if (!deviceId) {
    // Generate a random UUID-like identifier
    deviceId =
      "dev_" +
      Date.now().toString(36) +
      "_" +
      Math.random().toString(36).slice(2, 10) +
      Math.random().toString(36).slice(2, 10);
    localStorage.setItem(KEY, deviceId);
  }

  return deviceId;
}
