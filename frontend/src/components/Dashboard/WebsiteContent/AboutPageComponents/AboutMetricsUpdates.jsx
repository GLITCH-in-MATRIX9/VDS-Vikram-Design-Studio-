import React, { useEffect, useState } from "react";
import axios from "axios";

const MAX_METRICS = 3;

const AboutMetricsUpdates = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState([]);

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get("/api/content/about");

        const metricsSection = res.data.find(
          (section) => section.section === "metrics"
        );

        if (metricsSection?.content) {
          const formatted = metricsSection.content
            .slice(0, MAX_METRICS)
            .map((m) => ({
              ...m,
              value: String(m.value ?? ""),
            }));

          setMetrics(formatted);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  /* ---------------- HELPERS ---------------- */

  const addMetric = () => {
    if (metrics.length >= MAX_METRICS) return;

    setMetrics((prev) => [
      ...prev,
      {
        id: Date.now(),
        value: "",
        label: "",
        suffix: "",
      },
    ]);
  };

  const updateMetric = (id, key, value) => {
    setMetrics((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, [key]: value } : m
      )
    );
  };

  const removeMetric = (id) => {
    setMetrics((prev) => prev.filter((m) => m.id !== id));
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    try {
      const cleanedMetrics = metrics.map((m) => ({
        ...m,
        value: Number(m.value || 0),
      }));

      await axios.post("/api/content", {
        page: "ABOUT",
        section: "metrics",
        content: cleanedMetrics,
        lastModifiedBy: "admin1",
      });

      alert("Metrics updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update metrics");
    }
  };

  /* ---------------- UI ---------------- */

  if (loading) return <p>Loading...</p>;

  return (
    <section className="bg-[#f2efee] p-6 space-y-8">
      {/* Title */}
      <h2 className="text-2xl font-bold text-[#3E3C3C]">
        About Metrics Updates
      </h2>

      {/* Instructions */}
      <ul className="text-sm text-[#6D6D6D] list-disc pl-5 space-y-1">
        <li>Edit the numbers and labels shown on the About page.</li>
        <li>Maximum of three metrics are supported.</li>
        <li>Units like <code>sq.ft.</code> can be added as suffix.</li>
      </ul>

      {/* Metric Cards */}
      <div className="flex flex-wrap gap-4 md:gap-5 xl:gap-6">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="shadow-[0_16px_32px_#3E3C3C1A] flex-1 basis-full md:basis-0"
          >
            <div className="h-[180px] bg-[#F9F8F7] rounded-md shadow-[0_4px_2px_#3e3c3c0a] p-6 flex flex-col justify-between">
              {/* Value */}
              <div>
                <label className="block text-sm font-semibold text-[#3E3C3C] mb-1">
                  Value
                </label>

                <div className="flex items-end gap-2">
                  <input
                    type="number"
                    value={metric.value}
                    onChange={(e) =>
                      updateMetric(metric.id, "value", e.target.value)
                    }
                    className="text-sm bg-transparent border-b border-[#ccc] w-24 focus:outline-none"
                  />

                  <input
                    type="text"
                    value={metric.suffix}
                    onChange={(e) =>
                      updateMetric(metric.id, "suffix", e.target.value)
                    }
                    placeholder="+ / sq.ft."
                    className="text-sm bg-transparent border-b border-[#ccc] w-24 focus:outline-none"
                  />
                </div>
              </div>

              {/* Label */}
              <div>
                <label className="block text-sm font-semibold text-[#3E3C3C] mb-1">
                  Label
                </label>

                <input
                  type="text"
                  value={metric.label}
                  onChange={(e) =>
                    updateMetric(metric.id, "label", e.target.value)
                  }
                  className="text-sm bg-transparent border-b border-[#ccc] w-full focus:outline-none"
                  placeholder="Metric description"
                />
              </div>

              {/* Remove */}
              <button
                onClick={() => removeMetric(metric.id)}
                className="text-sm text-red-500 self-end"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={addMetric}
          disabled={metrics.length >= MAX_METRICS}
          className={`px-4 py-2 rounded text-sm ${
            metrics.length >= MAX_METRICS
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#3E3C3C] text-white"
          }`}
        >
          + Add Metric
        </button>

        <button
          onClick={handleSave}
          className="px-6 py-2 bg-black text-white rounded text-sm"
        >
          Save Metrics
        </button>
      </div>
    </section>
  );
};

export default AboutMetricsUpdates;
