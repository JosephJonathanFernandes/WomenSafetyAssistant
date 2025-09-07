// Lightweight Wolfram|Alpha API client for the frontend
// Uses the v2 JSON API for data and the Simple API for quick visual images

const WOLFRAM_APP_ID = process.env.REACT_APP_WOLFRAM_APPID || process.env.VITE_WOLFRAM_APPID || "3QX287W2VP";

if (!WOLFRAM_APP_ID) {
  // eslint-disable-next-line no-console
  console.warn("Wolfram App ID not found. Set REACT_APP_WOLFRAM_APPID or VITE_WOLFRAM_APPID in your environment.");
}

const BASE_QUERY_URL = "https://api.wolframalpha.com/v2/query";
const SIMPLE_IMAGE_URL = "https://api.wolframalpha.com/v1/simple";

export async function queryWolframAlpha(input) {
  if (!WOLFRAM_APP_ID) {
    return { success: false, error: "Missing Wolfram App ID" };
  }

  const params = new URLSearchParams({
    appid: WOLFRAM_APP_ID,
    input,
    output: "json",
  });

  const url = `${BASE_QUERY_URL}?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    return { success: false, error: `HTTP ${response.status}` };
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


