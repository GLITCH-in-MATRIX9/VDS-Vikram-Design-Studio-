import React, { useEffect, useState } from "react";
import aboutApi from "../../../../services/aboutapi";

const MAX_METRICS = 3;

const AboutMetricsUpdates = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState([]);

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await aboutApi.getAboutPage();

        if (Array.isArray(data?.metrics)) {
          setMetrics(
            data.metrics.slice(0, MAX_METRICS).map((m) => ({
              id: m.id ?? Date.now(),
              value: String(m.value ?? ""),
              label: m.label ?? "",
              suffix: m.suffix ?? "",
            }))
          );
        } else {
          setMetrics([]);
        }
      } catch (err) {
        console.error("Failed to load metrics:", err);
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

  const updateMetric = (id, field, value) => {
    setMetrics((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
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
        id: m.id,
        value: Number(m.value || 0),
        label: m.label,
        suffix: m.suffix,
      }));

      await aboutApi.updateMetrics(cleanedMetrics, "admin1");

      alert("Metrics updated successfully!");
    } catch (err) {
      console.error("Failed to update metrics:", err);
      alert("Failed to update metrics");
    }
  };

  /* ---------------- UI ---------------- */

  if (loading) return <p>Loading...</p>;

  return (
    <section className="bg-[#f2efee] p-8 rounded-lg space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[#3E3C3C]">
          About Metrics Updates
        </h2>
        <p className="text-sm text-[#6D6D6D]">
          Update the key numbers displayed on the About page. Maximum of three
          metrics allowed.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white p-5 rounded-lg shadow-sm space-y-4"
          >
            {/* Value */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#3E3C3C]">
                Value
              </label>
              <input
                type="number"
                value={metric.value}
                onChange={(e) =>
                  updateMetric(metric.id, "value", e.target.value)
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E3C3C]"
                placeholder="e.g. 120"
              />
            </div>

            {/* Label */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#3E3C3C]">
                Label
              </label>
              <input
                type="text"
                value={metric.label}
                onChange={(e) =>
                  updateMetric(metric.id, "label", e.target.value)
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E3C3C]"
                placeholder="e.g. Projects Completed"
              />
            </div>

            {/* Remove */}
            <button
              onClick={() => removeMetric(metric.id)}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Remove Metric
            </button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={addMetric}
          disabled={metrics.length >= MAX_METRICS}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            metrics.length >= MAX_METRICS
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-white border border-[#3E3C3C] text-[#3E3C3C] hover:bg-[#3E3C3C] hover:text-white"
          }`}
        >
          + Add Metric
        </button>

        <button
          onClick={handleSave}
          className="px-6 py-2 bg-[#3E3C3C] text-white rounded-md text-sm font-semibold hover:bg-black transition"
        >
          Save Metrics
        </button>
      </div>
    </section>
  );
};

export default AboutMetricsUpdates;
