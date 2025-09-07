const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";
const APP_ID = process.env.REACT_APP_WOLFRAM_APPID || "3QX287W2VP";
const WOLFRAM_QUERY_JSON = "https://api.wolframalpha.com/v2/query";
const WOLFRAM_SHORT_ANSWER = "https://api.wolframalpha.com/v1/result";

export async function queryWolfram(input) {
  const params = new URLSearchParams({ q: input });
  const url = `${API_BASE}/api/wolfram?${params.toString()}`;
  let response = null;
  try {
    response = await fetch(url, { headers: { Accept: "application/json" } });
    if (response.ok) {
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        return response.json();
      }
    }
  } catch (_) {}

  // Fallback: call Wolfram JSON API directly from browser (uses APP_ID)
  const jsonParams = new URLSearchParams({ appid: APP_ID, input, output: "json" });
  const jsonUrl = `${WOLFRAM_QUERY_JSON}?${jsonParams.toString()}`;
  const direct = await fetch(jsonUrl, { headers: { Accept: "application/json" } });
  if (!direct.ok) {
    const text = await direct.text();
    throw new Error(`HTTP ${direct.status}: ${text.slice(0, 200)}`);
  }
  return direct.json();
}

export async function shortAnswer(input) {
  const params = new URLSearchParams({ i: input, appid: APP_ID, units: "metric" });
  const url = `${WOLFRAM_SHORT_ANSWER}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Short answer HTTP ${res.status}`);
  return res.text();
}

export function getSimpleImageUrl(input, opts = {}) {
  const base = "https://api.wolframalpha.com/v1/simple";
  const params = new URLSearchParams({
    appid: APP_ID,
    i: input,
    layout: opts.layout || "labelbar",
    background: opts.background || "333333",
    foreground: opts.foreground || "white",
    width: String(opts.width || 700),
    fontsize: String(opts.fontsize || 14),
    units: opts.units || "metric",
  });
  if (opts.timeout) params.set("timeout", String(opts.timeout));
  if (opts.ts) params.set("ts", String(opts.ts)); // cache-buster
  return `${base}?${params.toString()}`;
}


