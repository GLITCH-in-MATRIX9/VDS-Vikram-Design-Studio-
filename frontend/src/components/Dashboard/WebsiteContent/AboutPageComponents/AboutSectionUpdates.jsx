import React, { useEffect, useState } from "react";
import aboutApi from "../../../../services/aboutapi";

const AboutSectionUpdates = () => {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});


  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await aboutApi.getAboutPage();

        if (data?.sections && typeof data.sections === "object") {
          setSections(data.sections);
        } else {
          setSections({});
        }
      } catch (err) {
        console.error("Failed to load About sections", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------------- HELPERS ---------------- */

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
      [key]: { ...prev[key], [field]: value },
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
      sections[key].paragraphs.map((p) =>
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
        img_src: "",
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
        text: "",
      },
    ]);
  };

  const updateCard = (key, cardId, field, value) => {
    updateSection(
      key,
      "carousel_cards",
      sections[key].carousel_cards.map((c) =>
        c.id === cardId ? { ...c, [field]: value } : c
      )
    );
  };

  const removeCard = (key, cardId) => {
    updateSection(
      key,
      "carousel_cards",
      sections[key].carousel_cards.filter((c) => c.id !== cardId)
    );
  };

  /* ---------------- IMAGE PICKER (BASE64) ---------------- */

  const handleImageSelect = (key, cardId, file) => {
    if (!file) return;

    // 1️⃣ Preview (UI only)
    const previewUrl = URL.createObjectURL(file);
    setImagePreviews((prev) => ({
      ...prev,
      [`${key}_${cardId}`]: previewUrl,
    }));

    // 2️⃣ Base64 (backend upload)
    const reader = new FileReader();
    reader.onloadend = () => {
      updateCard(key, cardId, "img_src", reader.result);
    };
    reader.readAsDataURL(file);
  };


  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    try {
      await aboutApi.updateSections(sections, "admin1");
      alert("About sections saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save sections");
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
        className="bg-black text-white px-4 py-2 rounded text-sm"
      >
        + Add New Section
      </button>

      {Object.keys(sections).map((key, idx) => {
        const section = sections[key];

        return (
          <div key={key} className="bg-white border rounded p-6 space-y-6">
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
              onChange={(e) =>
                updateSection(key, "heading", e.target.value)
              }
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

              {section.paragraphs.map((p) => (
                <textarea
                  key={p.id}
                  value={p.text}
                  onChange={(e) =>
                    updateParagraph(key, p.id, e.target.value)
                  }
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

              {section.carousel_cards.map((card) => (
                <div
                  key={card.id}
                  className="border rounded p-4 space-y-3"
                >
                  {"img_src" in card ? (
                    <>
                      {(imagePreviews[`${key}_${card.id}`] || card.img_src) && (
                        <img
                          src={
                            imagePreviews[`${key}_${card.id}`] || card.img_src
                          }
                          alt={card.project_name || ""}
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
                            handleImageSelect(
                              key,
                              card.id,
                              e.target.files[0]
                            )
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
