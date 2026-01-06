import React, { useEffect, useState } from "react";
import axios from "axios";

// API base (Vite env or fallback)
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/*
Expected normalized shape of `sections`:

sections = {
  architecture: {
    heading: "",
    paragraphs: [],
    carousel_cards: []
  },
  interior: {...}
}
*/

const AboutSectionUpdates = () => {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState({});

  /* ---------------- FETCH & NORMALIZE ---------------- */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/content/about`);
        const data = res.data;

        const normalized = {};

        // Case 1: backend returns ARRAY
        if (Array.isArray(data)) {
          data.forEach((item) => {
            if (item.section && item.content) {
              normalized[item.section] = {
                heading: item.content.heading || "",
                paragraphs: item.content.paragraphs || [],
                carousel_cards: item.content.carousel_cards || [],
              };
            }
          });
        }

        // Case 2: backend returns OBJECT
        else if (typeof data === "object" && data !== null) {
          Object.keys(data).forEach((key) => {
            normalized[key] = {
              heading: data[key]?.heading || "",
              paragraphs: data[key]?.paragraphs || [],
              carousel_cards: data[key]?.carousel_cards || [],
            };
          });
        }

        setSections(normalized);
      } catch (err) {
        console.error("Failed to load About sections", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------------- SECTION HELPERS ---------------- */

  const addSection = () => {
    const key = `section_${Date.now()}`;
    setSections((prev) => ({
      ...prev,
      [key]: {
        heading: "",
        paragraphs: [],
        carousel_cards: [],
      },
    }));
  };

  const updateSection = (key, field, value) => {
    setSections((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const removeSection = (key) => {
    setSections((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  /* ---------------- PARAGRAPHS ---------------- */

  const addParagraph = (key) => {
    updateSection(key, "paragraphs", [
      ...(sections[key]?.paragraphs || []),
      { id: Date.now(), text: "" },
    ]);
  };

  const updateParagraph = (key, id, text) => {
    updateSection(
      key,
      "paragraphs",
      (sections[key]?.paragraphs || []).map((p) =>
        p.id === id ? { ...p, text } : p
      )
    );
  };

  /* ---------------- CARDS ---------------- */

  const addImageCard = (key) => {
    updateSection(key, "carousel_cards", [
      ...(sections[key]?.carousel_cards || []),
      {
        id: Date.now(),
        type: "image",
        image: null,
        preview: "",
        project_name: "",
        project_location: "",
      },
    ]);
  };

  const addTextCard = (key) => {
    updateSection(key, "carousel_cards", [
      ...(sections[key]?.carousel_cards || []),
      {
        id: Date.now(),
        type: "text",
        text: "",
      },
    ]);
  };

  const updateCard = (key, cardId, field, value) => {
    updateSection(
      key,
      "carousel_cards",
      (sections[key]?.carousel_cards || []).map((c) =>
        c.id === cardId ? { ...c, [field]: value } : c
      )
    );
  };

  const removeCard = (key, cardId) => {
    updateSection(
      key,
      "carousel_cards",
      (sections[key]?.carousel_cards || []).filter((c) => c.id !== cardId)
    );
  };

  /* ---------------- IMAGE PICKER ---------------- */

  const handleImageSelect = (key, cardId, file) => {
    if (!file) return;

    const preview = URL.createObjectURL(file);

    updateCard(key, cardId, "image", file);
    updateCard(key, cardId, "preview", preview);
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const payload = { content: sections, lastModifiedBy: "admin1" };

      await axios.post(`${API_BASE}/content/about/sections`, payload, {
        headers,
      });

      alert("About sections saved successfully!");
    } catch (err) {
      console.error(err?.response || err);
      const serverMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message;
      alert(`Failed to save sections: ${serverMsg}`);
    }
  };

  /* ---------------- UI ---------------- */

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-[#f3efee] space-y-10">
      <h2 className="text-2xl font-bold text-[#3E3C3C]">
        About Sections Updates
      </h2>

      <button
        onClick={addSection}
        className="bg-black text-white px-4 py-2 rounded text-sm pr-2"
      >
        + Add New Section
      </button>

      {Object.keys(sections).map((key, idx) => {
        const section = sections[key];

        return (
          <div key={key} className="bg-white border rounded p-6 space-y-6 ">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Section {idx + 1}</h3>
              <button
                onClick={() => removeSection(key)}
                className="text-sm text-red-500"
              >
                Remove Section
              </button>
            </div>

            {/* Heading */}
            <input
              value={section.heading}
              onChange={(e) => updateSection(key, "heading", e.target.value)}
              placeholder="Section heading"
              className="border p-2 w-full text-sm"
            />

            {/* Paragraphs */}
            <div className="space-y-3">
              <button
                onClick={() => addParagraph(key)}
                className="bg-gray-200 px-3 py-1 rounded text-sm"
              >
                + Add Paragraph
              </button>

              {(section.paragraphs || []).map((p) => (
                <textarea
                  key={p.id}
                  value={p.text}
                  onChange={(e) => updateParagraph(key, p.id, e.target.value)}
                  rows={3}
                  className="border p-2 w-full text-sm"
                />
              ))}
            </div>

            {/* Cards */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <button
                  onClick={() => addImageCard(key)}
                  className="bg-gray-200 px-3 py-1 rounded text-sm"
                >
                  + Image Card
                </button>
                <button
                  onClick={() => addTextCard(key)}
                  className="bg-gray-200 px-3 py-1 rounded text-sm"
                >
                  + Text Card
                </button>
              </div>

              {(section.carousel_cards || []).map((card) => (
                <div key={card.id} className="border rounded p-4 space-y-3">
                  {card.type === "image" ? (
                    <>
                      {card.preview && (
                        <img
                          src={card.preview}
                          alt=""
                          className="h-32 rounded object-cover"
                        />
                      )}

                      <label className="inline-block">
                        <span className="bg-black text-white px-3 py-1 rounded text-sm cursor-pointer">
                          Choose Image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageSelect(key, card.id, e.target.files[0])
                          }
                        />
                      </label>

                      <input
                        type="text"
                        placeholder="Project Name"
                        value={card.project_name}
                        onChange={(e) =>
                          updateCard(
                            key,
                            card.id,
                            "project_name",
                            e.target.value
                          )
                        }
                        className="border p-2 w-full text-sm"
                      />

                      <input
                        type="text"
                        placeholder="Project Location"
                        value={card.project_location}
                        onChange={(e) =>
                          updateCard(
                            key,
                            card.id,
                            "project_location",
                            e.target.value
                          )
                        }
                        className="border p-2 w-full text-sm"
                      />
                    </>
                  ) : (
                    <textarea
                      value={card.text}
                      onChange={(e) =>
                        updateCard(key, card.id, "text", e.target.value)
                      }
                      rows={4}
                      className="border p-2 w-full text-sm"
                    />
                  )}

                  <button
                    onClick={() => removeCard(key, card.id)}
                    className="text-sm text-red-500"
                  >
                    Remove Card
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="w-full flex justify-start pt-6 border-t">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-black text-white rounded text-sm"
        >
          Save All About Sections
        </button>
      </div>
    </div>
  );
};

export default AboutSectionUpdates;
