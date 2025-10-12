import React, { useState } from "react";

const initialMetrics = [
  { id: 1, title: "Number of Projects Completed", value: 200 },
  { id: 2, title: "Total Square Foot Area Designed Till Date", value: 20000, suffix: "sq.ft." },
  { id: 3, title: "Years in the Industry", value: 25 },
];

const categories = ["Architecture", "Interior", "Landscape", "Planning", "Collaborators"];

const AboutPageUpdates = () => {
  const [mainImage, setMainImage] = useState(null);
  const [categoryImages, setCategoryImages] = useState({
    Architecture: [],
    Interior: [],
    Landscape: [],
    Planning: [],
    Collaborators: [],
  });
  const [metrics, setMetrics] = useState(initialMetrics);

  // Handle main image change
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setMainImage(URL.createObjectURL(file));
  };

  // Handle category images change
  const handleCategoryChange = (category, files) => {
    setCategoryImages((prev) => ({
      ...prev,
      [category]: [...prev[category], ...Array.from(files).map(f => URL.createObjectURL(f))],
    }));
  };

  // Remove image from category
  const handleRemoveCategoryImage = (category, index) => {
    setCategoryImages((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  // Handle metric value change
  const handleMetricChange = (id, newValue) => {
    setMetrics((prev) =>
      prev.map((m) => (m.id === id ? { ...m, value: newValue } : m))
    );
  };

  return (
    <div className="p-6 bg-white text-[#454545] space-y-8">
      <h2 className="text-2xl font-bold">About Page Updates</h2>

      {/* Main Image */}
      <div className="space-y-2">
        <h3 className="font-semibold">Main Image</h3>
        {mainImage && (
          <img
            src={mainImage}
            alt="Main"
            className="w-full max-w-xl h-64 object-cover rounded-md"
          />
        )}
        <input type="file" accept="image/*" onChange={handleMainImageChange} />
      </div>

      {/* Editable Metrics Section */}
      <div className="space-y-4">
        <h3 className="font-semibold mb-2">Metrics Section</h3>
        {metrics.map((metric) => (
          <div key={metric.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="flex-1">{metric.title}:</label>
            <input
              type="number"
              value={metric.value}
              onChange={(e) => handleMetricChange(metric.id, Number(e.target.value))}
              className="border rounded p-2 w-24 text-black"
            />
            {metric.suffix && <span>{metric.suffix}</span>}
          </div>
        ))}
      </div>

      {/* Category Image Uploads */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat} className="space-y-2">
            <h3 className="font-semibold">{cat} Images</h3>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleCategoryChange(cat, e.target.files)}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {categoryImages[cat].map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img}
                    alt={`${cat}-${idx}`}
                    className="w-32 h-20 object-cover rounded"
                  />
                  <button
                    onClick={() => handleRemoveCategoryImage(cat, idx)}
                    className="absolute top-1 right-1 bg-gray-300 text-gray-800 rounded-full p-1 hover:bg-gray-400"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition">
        Save About Page
      </button>
    </div>
  );
};

export default AboutPageUpdates;
