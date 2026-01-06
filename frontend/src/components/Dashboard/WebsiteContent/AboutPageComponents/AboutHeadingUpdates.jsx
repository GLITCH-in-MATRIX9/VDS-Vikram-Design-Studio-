import React, { useEffect, useState } from "react";
import axios from "axios";

// API base (Vite env or fallback)
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AboutHeadingUpdates = () => {
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("ABOUT");
  const [subTitle, setSubTitle] = useState("");
  const [heroImage, setHeroImage] = useState(null);
  const [paragraphs, setParagraphs] = useState([]);

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/content/about`);
        const data = res.data;

        // Support both response shapes:
        // - Array of sections: [{ section: 'hero', content: {...} }, ...]
        // - Object with hero field: { hero: { title, subtitle, image, paragraphs }, ... }
        let heroContent = null;

        if (Array.isArray(data)) {
          heroContent = data.find((s) => s.section === "hero")?.content || null;
        } else if (data && typeof data === "object" && data.hero) {
          heroContent = data.hero;
        }

        if (heroContent) {
          setTitle(heroContent.title || "ABOUT");
          setSubTitle(heroContent.subtitle || "");
          setHeroImage(heroContent.image || null);
          setParagraphs(heroContent.paragraphs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------------- HELPERS ---------------- */

  const addParagraph = () => {
    setParagraphs((prev) => [...prev, { id: Date.now(), text: "" }]);
  };

  const updateParagraph = (id, value) => {
    setParagraphs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, text: value } : p))
    );
  };

  const removeParagraph = (id) => {
    setParagraphs((prev) => prev.filter((p) => p.id !== id));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setHeroImage(URL.createObjectURL(file));
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const payload = {
        content: {
          title,
          subtitle: subTitle,
          image: heroImage,
          paragraphs,
        },
        lastModifiedBy: "admin1",
      };

      await axios.post(`${API_BASE}/content/about/hero`, payload, { headers });

      alert("About heading updated successfully!");
    } catch (err) {
      console.error(err?.response || err);
      const serverMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message;
      alert(`Failed to update About heading: ${serverMsg}`);
    }
  };

  /* ---------------- UI ---------------- */

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-8 bg-[#f3efee]">
      <h2 className="text-2xl font-bold text-[#3E3C3C]">
        About Heading Updates
      </h2>

      {/* Instructions */}
      <ul className="text-sm text-[#6D6D6D] list-disc pl-5 space-y-1">
        <li>Edit the main heading and introductory content.</li>
        <li>Add, update, or remove story paragraphs.</li>
        <li>Upload a hero image shown on the About page.</li>
        <li>Click save to apply changes live.</li>
      </ul>

      {/* Title */}
      <div className="space-y-2">
        <label className="font-semibold text-[#3E3C3C]">Main Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full bg-white"
        />
      </div>

      {/* Subtitle */}
      <div className="space-y-2">
        <label className="font-semibold text-[#3E3C3C]">Subtitle Line</label>
        <input
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
          className="border p-2 w-full bg-white"
        />
      </div>

      {/* Hero Image */}
      <div className="space-y-2">
        <label className="font-semibold text-[#3E3C3C]">Hero Image</label>

        {heroImage ? (
          <img
            src={heroImage}
            alt="Hero"
            className="w-full max-w-md h-48 object-cover rounded"
          />
        ) : (
          <button
            onClick={() => document.getElementById("heroImageInput").click()}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            + Add Hero Image
          </button>
        )}

        <input
          id="heroImageInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* Paragraphs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[#3E3C3C]">Story Paragraphs</h3>
          <button
            onClick={addParagraph}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            + Add Paragraph
          </button>
        </div>

        {paragraphs.map((p, idx) => (
          <div key={p.id} className="space-y-2">
            <textarea
              value={p.text}
              onChange={(e) => updateParagraph(p.id, e.target.value)}
              className="border p-2 w-full bg-white"
              rows={4}
              placeholder={`Paragraph ${idx + 1}`}
            />

            <button
              onClick={() => removeParagraph(p.id)}
              className="text-sm text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="px-6 py-2 bg-black text-white rounded"
      >
        Save About Heading
      </button>
    </div>
  );
};

export default AboutHeadingUpdates;
