import React, { useEffect, useRef, useState } from "react";
import { queryWolframAlpha, getSimpleImageUrl, extractPrimaryResults } from "../services/wolfram";

export default function Insights() {
  const [query, setQuery] = useState("crime rate in odisha by district");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const curated = [
    { label: "Odisha Crime by District", q: "crime rate in odisha by district" },
    { label: "Women Literacy Odisha", q: "female literacy rate odisha by district" },
    { label: "Safety Index Bhubaneswar", q: "safety index of Bhubaneswar" },
    { label: "India Crime Trend", q: "crime rate in india 2010-2023 time series" },
    { label: "Police Stations Odisha", q: "number of police stations in odisha" },
    { label: "Self-Defense Classes", q: "self defense classes availability in odisha" },
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await queryWolframAlpha(query);
      if (!res.success) {
        setError(res.error || "Failed to query Wolfram|Alpha");
        setResult(null);
      } else {
        setResult(res.data);
      }
    } catch (e) {
      setError(e.message || "Unexpected error");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const simpleImgUrl = getSimpleImageUrl(`${query}, India`);

  const { primaryPod, interpretations, pods } = extractPrimaryResults(result);

  const hasRun = useRef(false);
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    handleSearch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Wolfram Insights</h1>
          <p className="text-gray-600 dark:text-gray-400">Explore safety-related data and visualizations powered by Wolfram|Alpha</p>
        </div>

        <div className="card">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about safety stats, e.g., 'crime rate in Odisha'"
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <button onClick={handleSearch} className="btn-primary">Search</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {curated.map((c) => (
              <button
                key={c.label}
                onClick={() => { setQuery(c.q); setTimeout(() => handleSearch(), 0); }}
                className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors duration-200"
              >
                {c.label}
              </button>
            ))}
          </div>
          {error && (
            <div className="mt-4 p-3 rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">{error}</div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card min-h-[240px] flex items-center justify-center">
              {loading ? (
                <div className="text-gray-600 dark:text-gray-300">Loading...</div>
              ) : primaryPod?.subpods?.[0]?.img?.src ? (
                <img src={primaryPod.subpods[0].img.src} alt={primaryPod.subpods[0].title || "Primary visualization"} className="max-h-[420px] w-full object-contain" />
              ) : simpleImgUrl ? (
                <img src={simpleImgUrl} alt="Wolfram Visualization" className="max-h-[420px] w-full object-contain" />
              ) : (
                <div className="text-gray-600 dark:text-gray-300">No visualization available for this query.</div>
              )}
            </div>

            {primaryPod && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Primary Result</h3>
                <div className="space-y-2">
                  {primaryPod.subpods?.map((sp, i) => (
                    <div key={i} className="text-gray-800 dark:text-gray-200">
                      {sp.plaintext || (sp.img?.src ? <img src={sp.img.src} alt={sp.title || "result"} /> : null)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {interpretations && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Interpretation</h3>
                <div className="text-gray-700 dark:text-gray-300">
                  {interpretations.subpods?.map((sp, i) => (
                    <div key={i}>{sp.plaintext}</div>
                  ))}
                </div>
              </div>
            )}

            {pods && pods.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Related Pods</h3>
                <div className="space-y-3">
                  {pods
                    .filter((p) => !p.primary && p.id !== interpretations?.id)
                    .slice(0, 6)
                    .map((pod) => (
                      <div key={pod.id} className="p-3 rounded bg-gray-50 dark:bg-gray-700">
                        <div className="font-medium text-gray-800 dark:text-gray-200 mb-1">{pod.title}</div>
                        {pod.subpods?.slice(0, 1).map((sp, i) => (
                          <div key={i} className="text-sm text-gray-700 dark:text-gray-300">
                            {sp.plaintext || (sp.img?.src ? <img src={sp.img.src} alt={pod.title} /> : null)}
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


