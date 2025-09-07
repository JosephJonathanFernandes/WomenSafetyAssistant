import React, { useEffect, useRef, useState } from "react";
import { queryWolfram, getSimpleImageUrl, shortAnswer } from "../services/wolfram";

export default function Insights() {
  const [query, setQuery] = useState("crime rate in odisha by district");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [headline, setHeadline] = useState("");
  const hasRun = useRef(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await queryWolfram(query);
      setData(res);
      try {
        const sa = await shortAnswer(query);
        setHeadline(sa);
      } catch (_) {
        setHeadline("");
      }
    } catch (e) {
      setError(e.message || "Failed to load insights");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    handleSearch();
  }, []);

  const pods = data?.queryresult?.pods || [];
  const primaryPod = pods.find((p) => p.primary) || pods[0];
  const simpleUrl = getSimpleImageUrl(`${query}, India`, { ts: Date.now() });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Insights</h1>

        <div className="card">
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Ask Wolfram e.g., crime rate in Odisha"
            />
            <button className="btn-primary" onClick={handleSearch}>Search</button>
          </div>
          {error && <div className="mt-3 p-3 rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">{error}</div>}
          {headline && !error && (
            <div className="mt-3 p-3 rounded bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200">
              {headline}
            </div>
          )}
        </div>

        <div className="card min-h-[220px] flex items-center justify-center">
          {loading ? (
            <div className="text-gray-600 dark:text-gray-300">Loading...</div>
          ) : primaryPod?.subpods?.[0]?.img?.src ? (
            <img src={primaryPod.subpods[0].img.src} alt={primaryPod.subpods[0].title || "Visualization"} className="max-h-[420px] w-full object-contain" />
          ) : simpleUrl ? (
            <img src={simpleUrl} alt="Wolfram Visualization" className="max-h-[420px] w-full object-contain" />
          ) : (
            <div className="text-gray-600 dark:text-gray-300">No visualization available.</div>
          )}
        </div>

        {/* Detailed pods output */}
        {pods && pods.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6">
            {pods.slice(0, 8).map((pod) => (
              <details key={pod.id} className="card" open>
                <summary className="cursor-pointer font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {pod.title}
                </summary>
                <div className="space-y-3 mt-2">
                  {pod.subpods?.map((sp, i) => (
                    <div key={i} className="text-sm text-gray-800 dark:text-gray-200">
                      {sp.img?.src ? (
                        <img src={sp.img.src} alt={sp.title || pod.title} className="w-full object-contain" />
                      ) : (
                        <div className="whitespace-pre-wrap">{sp.plaintext || ""}</div>
                      )}
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


