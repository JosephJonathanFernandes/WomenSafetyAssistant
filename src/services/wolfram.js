// Lightweight Wolfram|Alpha API client for the frontend
// Uses the v2 JSON API for data and the Simple API for quick visual images

const WOLFRAM_APP_ID = process.env.REACT_APP_WOLFRAM_APPID || process.env.VITE_WOLFRAM_APPID || "3QX287W2VP";

if (!WOLFRAM_APP_ID) {
  // eslint-disable-next-line no-console
  console.warn("Wolfram App ID not found. Set REACT_APP_WOLFRAM_APPID or VITE_WOLFRAM_APPID in your environment.");
}

const BASE_QUERY_URL = "https://api.wolframalpha.com/v2/query";
const API_BASE = process.env.REACT_APP_API_BASE || process.env.VITE_API_BASE || "http://localhost:3001";
const SIMPLE_IMAGE_URL = "https://api.wolframalpha.com/v1/simple";

export async function queryWolframAlpha(input) {
  if (!WOLFRAM_APP_ID) {
    return { success: false, error: "Missing Wolfram App ID" };
  }
  // Try backend proxy first (avoid CORS and hide key). Fallback to direct API.
  const proxyParams = new URLSearchParams({ q: input });
  const sameOriginProxy = `${window.location.origin}/api/wolfram?${proxyParams.toString()}`;
  let response = await fetch(sameOriginProxy, { headers: { Accept: "application/json" } }).catch(() => null);
  if (!response || !response.ok) {
    const proxyUrl = `${API_BASE}/api/wolfram?${proxyParams.toString()}`;
    response = await fetch(proxyUrl, { headers: { Accept: "application/json" } }).catch(() => null);
  }
  if (!response || !response.ok) {
    const params = new URLSearchParams({ appid: WOLFRAM_APP_ID, input, output: "json" });
    const url = `${BASE_QUERY_URL}?${params.toString()}`;
    response = await fetch(url, { headers: { Accept: "application/json" } });
  }
  if (!response.ok) {
    return { success: false, error: `HTTP ${response.status}` };
  }
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    return { success: false, error: "Non-JSON response from server", details: text.slice(0, 300) };
  }
  const data = await response.json();
  return { success: true, data };
}

export function getSimpleImageUrl(input) {
  if (!WOLFRAM_APP_ID) {
    return null;
  }
  const params = new URLSearchParams({
    appid: WOLFRAM_APP_ID,
    i: input,
    background: "333333",
    foreground: "FFFFFF",
    layout: "labelbar",
  });
  return `${SIMPLE_IMAGE_URL}?${params.toString()}`;
}

export function extractPrimaryResults(jsonData) {
  // Safely walk the structure and extract key pods
  try {
    const pods = jsonData?.queryresult?.pods || [];
    const primaryPod = pods.find((p) => p.primary) || pods[0];
    const interpretations = pods.find((p) => p.title?.toLowerCase().includes("interpretation"));
    const inputPod = pods.find((p) => p.title?.toLowerCase().includes("input"));
    return {
      primaryPod,
      interpretations,
      inputPod,
      pods,
    };
  } catch (e) {
    return { pods: [] };
  }
}


