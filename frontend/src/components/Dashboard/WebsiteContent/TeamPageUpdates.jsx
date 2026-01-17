import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, Plus, X, ChevronDown, ChevronUp } from "lucide-react";

const TeamPageUpdates = () => {
  const [team, setTeam] = useState([
    { id: 1, name: "Anjali Sharma", position: "CEO" },
    { id: 2, name: "Rohit Verma", position: "CTO" },
    { id: 3, name: "Priya Singh", position: "Lead Designer" },
    { id: 4, name: "Amit Kumar", position: "Frontend Developer" },
  ]);

  const [heading, setHeading] = useState({
    title: "",
    subtitle: "",
    image: "",
  });
  const [marquee, setMarquee] = useState([]);
  const [imagePreviews, setImagePreviews] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await (
          await import("../../../services/teamapi")
        ).default.getTeamPage();
        if (data) {
          setHeading(data.heading || { title: "", subtitle: "", image: "" });
          setTeam(data.members || []);
          setMarquee(data.marquee_images || []);
        }
      } catch (err) {
        console.error("Failed to load Team page:", err);
      }
    };

    fetchData();
  }, []);

  const [newMember, setNewMember] = useState({
    name: "",
    position: "",
    description: "",
    featured: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [headingStatus, setHeadingStatus] = useState({
    message: "",
    error: "",
  });
  const [membersStatus, setMembersStatus] = useState({
    message: "",
    error: "",
  });
  const [marqueeStatus, setMarqueeStatus] = useState({
    message: "",
    error: "",
  });
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSave = () => {
    // clear old errors
    setFormErrors({});
    // clear section statuses
    setHeadingStatus({ message: "", error: "" });
    setMembersStatus({ message: "", error: "" });
    setMarqueeStatus({ message: "", error: "" });

    const errors = {};
    if (!newMember.name || !newMember.name.trim())
      errors.name = "Name is required";
    if (!newMember.position || !newMember.position.trim())
      errors.position = "Position is required";
    if (newMember.featured) {
      if (!newMember.description || !newMember.description.trim())
        errors.description = "Description is required for featured members";
      if (!newMember.photo)
        errors.photo = "Photo is required for featured members";
    }
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    if (editingId) {
      setTeam((prev) =>
        prev.map((m) => (m.id === editingId ? { ...m, ...newMember } : m))
      );
      setEditingId(null);
    } else {
      const id = Math.max(0, ...team.map((m) => m.id)) + 1;
      setTeam([...team, { id, ...newMember }]);
    }
    setNewMember({
      name: "",
      position: "",
      description: "",
      featured: false,
      photo: "",
    });
  };

  /* ---------------- HEADING PARAGRAPHS HELPERS ---------------- */
  const addHeadingParagraph = () => {
    setHeading((h) => ({
      ...h,
      paragraphs: [...(h.paragraphs || []), { id: Date.now(), text: "" }],
    }));
  };

  const updateHeadingParagraph = (id, text) => {
    setHeading((h) => ({
      ...h,
      paragraphs: (h.paragraphs || []).map((p) =>
        p.id === id ? { ...p, text } : p
      ),
    }));
  };

  const removeHeadingParagraph = (id) => {
    setHeading((h) => ({
      ...h,
      paragraphs: (h.paragraphs || []).filter((p) => p.id !== id),
    }));
  };

  /* ---------------- SAVE ACTIONS (API) ---------------- */
  const saveHeading = async () => {
    try {
      const teamApi = (await import("../../../services/teamapi")).default;
      await teamApi.updateHeading(heading, "admin1");
      setHeadingStatus({ message: "Heading saved", error: "" });
    } catch (err) {
      console.error(err);
      setHeadingStatus({ message: "", error: "Failed to save heading" });
    }
  };

  const saveMembers = async () => {
    try {
      const teamApi = (await import("../../../services/teamapi")).default;
      await teamApi.updateMembers(team, "admin1");
      setMembersStatus({ message: "Members saved", error: "" });
    } catch (err) {
      console.error(err);
      setMembersStatus({ message: "", error: "Failed to save members" });
    }
  };

  const saveMarquee = async () => {
    try {
      const teamApi = (await import("../../../services/teamapi")).default;
      await teamApi.updateMarquee(marquee, "admin1");
      setMarqueeStatus({ message: "Marquee saved", error: "" });
    } catch (err) {
      console.error(err);
      setMarqueeStatus({ message: "", error: "Failed to save marquee images" });
    }
  };

  /* Auto-clear status messages after 3s */
  useEffect(() => {
    if (!headingStatus.message && !headingStatus.error) return undefined;
    const t = setTimeout(
      () => setHeadingStatus({ message: "", error: "" }),
      3000
    );
    return () => clearTimeout(t);
  }, [headingStatus]);

  useEffect(() => {
    if (!membersStatus.message && !membersStatus.error) return undefined;
    const t = setTimeout(
      () => setMembersStatus({ message: "", error: "" }),
      3000
    );
    return () => clearTimeout(t);
  }, [membersStatus]);

  useEffect(() => {
    if (!marqueeStatus.message && !marqueeStatus.error) return undefined;
    const t = setTimeout(
      () => setMarqueeStatus({ message: "", error: "" }),
      3000
    );
    return () => clearTimeout(t);
  }, [marqueeStatus]);

  /* ---------------- IMAGE HELPERS ---------------- */
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleHeadingImage = async (file) => {
    if (!file) return;
    const b64 = await fileToBase64(file);
    setHeading((prev) => ({ ...prev, image: b64 }));
  };

  const handleMemberPhoto = async (memberId, file) => {
    if (!file) return;
    const b64 = await fileToBase64(file);
    setTeam((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, photo: b64 } : m))
    );
    setImagePreviews((p) => ({
      ...p,
      [`member_${memberId}`]: URL.createObjectURL(file),
    }));
  };

  const handleNewMemberPhoto = async (file) => {
    if (!file) return;
    const b64 = await fileToBase64(file);
    setNewMember((prev) => ({ ...prev, photo: b64 }));
    setImagePreviews((p) => ({ ...p, new_member: URL.createObjectURL(file) }));
  };

  const addMarqueeImages = async (files) => {
    const items = Array.from(files || []);
    const converted = await Promise.all(
      items.map(async (file) => ({
        id: Date.now() + Math.random(),
        img_src: await fileToBase64(file),
        alt: file.name,
      }))
    );
    setMarquee((prev) => [...prev, ...converted]);
  };

  // ref to the add/edit form container so we can scroll to it when editing
  const formRef = React.useRef(null);

  const handleEdit = (member) => {
    setEditingId(member.id);
    setNewMember({
      name: member.name,
      position: member.position,
      description: member.description || "",
      featured: !!member.featured,
      photo: member.photo || "",
    });
    setExpandedId(member.id);

    // give React a tick to update expanded state/layout, then scroll the nearest scrollable container to top
    setTimeout(() => {
      try {
        const isScrollable = (el) => {
          if (!el) return false;
          const style = getComputedStyle(el);
          const overflowY = style.overflowY;
          const canScroll = el.scrollHeight > el.clientHeight;
          return (
            canScroll &&
            (overflowY === "auto" ||
              overflowY === "scroll" ||
              overflowY === "overlay")
          );
        };

        // walk up from the formRef to find a scrollable ancestor
        let node = formRef.current;
        let scroller = null;
        while (node && node !== document.body) {
          if (isScrollable(node)) {
            scroller = node;
            break;
          }
          node = node.parentElement;
        }

        // fallback to document.scrollingElement or window
        if (!scroller)
          scroller =
            document.scrollingElement ||
            document.documentElement ||
            document.body;

        if (scroller && typeof scroller.scrollTo === "function") {
          scroller.scrollTo({ top: 0, behavior: "smooth" });
        } else if (
          typeof window !== "undefined" &&
          typeof window.scrollTo === "function"
        ) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch {
        // fallback to window scroll if anything unexpected occurs
        if (
          typeof window !== "undefined" &&
          typeof window.scrollTo === "function"
        ) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }

      // focus the name input inside the form for quicker edit
      const nameInput = formRef.current?.querySelector(
        'input[placeholder="Name"]'
      );
      if (nameInput) nameInput.focus();
    }, 60);
  };

  const handleDelete = (id) => {
    setTeam((prev) => prev.filter((m) => m.id !== id));
    if (editingId === id) setEditingId(null);
    if (expandedId === id) setExpandedId(null);
  };

  /* ---------------- DRAG & DROP HELPERS ---------------- */
  const handleDragStart = (e, id) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(id));
    setDraggingId(id);
  };

  const handleDragOver = (e, id) => {
    e.preventDefault(); // allow drop
    if (dragOverId !== id) setDragOverId(id);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const draggedId = Number(e.dataTransfer.getData("text/plain"));
    if (!draggedId) {
      setDraggingId(null);
      setDragOverId(null);
      return;
    }

    if (draggedId === targetId) {
      setDraggingId(null);
      setDragOverId(null);
      return;
    }

    setTeam((prev) => {
      const copy = [...prev];
      const fromIndex = copy.findIndex((x) => x.id === draggedId);
      const toIndex = copy.findIndex((x) => x.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;

      const [moved] = copy.splice(fromIndex, 1);
      // insert before target index
      copy.splice(toIndex, 0, moved);
      return copy;
    });

    setDraggingId(null);
    setDragOverId(null);
  };

  return (
    <div className="p-6 bg-[#f3efee] space-y-8">
      {/* Title */}
      <h2 className="text-2xl font-bold text-[#3E3C3C]">Team Members</h2>

      {/* Add / Edit Form */}
      <div ref={formRef} className="bg-white p-4 rounded border space-y-4">
        {/* Name and Position on same line */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 w-full">
            <input
              type="text"
              placeholder="Name"
              value={newMember.name}
              onChange={(e) =>
                setNewMember((prev) => ({ ...prev, name: e.target.value }))
              }
              className="border p-2 text-sm w-full sm:w-1/2"
            />
            {formErrors.name && (
              <div className="text-sm text-red-500 mt-1">{formErrors.name}</div>
            )}

            <input
              type="text"
              placeholder="Position"
              value={newMember.position}
              onChange={(e) =>
                setNewMember((prev) => ({
                  ...prev,
                  position: e.target.value,
                }))
              }
              className="border p-2 text-sm w-full sm:w-1/2"
            />
            {formErrors.position && (
              <div className="text-sm text-red-500 mt-1">
                {formErrors.position}
              </div>
            )}
          </div>

          {/* Featured checkbox */}
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!newMember.featured}
                onChange={(e) =>
                  setNewMember((prev) => ({
                    ...prev,
                    featured: e.target.checked,
                  }))
                }
              />
              <span>Featured</span>
            </label>
          </div>

          {/* Description only when featured */}
          {newMember.featured && (
            <div>
              <textarea
                placeholder="Short description / bio"
                value={newMember.description}
                onChange={(e) =>
                  setNewMember((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="border p-2 text-sm w-full h-28 mt-1"
              />
              {formErrors.description && (
                <div className="text-sm text-red-500 mt-1">
                  {formErrors.description}
                </div>
              )}
            </div>
          )}

          {/* Photo upload only when featured */}
          {newMember.featured && (
            <div className="flex items-start gap-4 mt-1">
              <div className="flex items-start gap-4">
                <label
                  className={`inline-block ${
                    imagePreviews.new_member || newMember.photo
                      ? "opacity-40 pointer-events-none"
                      : ""
                  }`}
                >
                  <span
                    className={`bg-gray-200 px-3 py-1 rounded text-sm ${
                      imagePreviews.new_member || newMember.photo
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    Add Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleNewMemberPhoto(e.target.files?.[0])}
                    disabled={!!(imagePreviews.new_member || newMember.photo)}
                  />
                </label>

                {imagePreviews.new_member || newMember.photo ? (
                  <div className="relative">
                    <img
                      src={imagePreviews.new_member || newMember.photo}
                      alt="new member preview"
                      className="h-28 w-28 object-cover rounded"
                    />
                    <button
                      onClick={() => {
                        // remove preview and photo
                        setNewMember((prev) => ({ ...prev, photo: "" }));
                        setImagePreviews((p) => {
                          const copy = { ...p };
                          delete copy.new_member;
                          return copy;
                        });
                      }}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow"
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : null}
                {formErrors.photo && (
                  <div className="text-sm text-red-500 mt-1">
                    {formErrors.photo}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded text-sm"
            >
              <Plus size={14} />
              {editingId ? "Update" : "Add"}
            </button>

            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setNewMember({ name: "", position: "" });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-[#3E3C3C] rounded text-sm"
              >
                <X size={14} /> Cancel
              </button>
            )}
          </div>
          {/* Save members for this section */}
          <div className="pt-3">
            <button
              onClick={saveMembers}
              className="px-4 py-2 bg-black text-white rounded text-sm"
            >
              Save Members
            </button>
            <div className="pt-2">
              {membersStatus.message && (
                <div className="text-sm text-green-600">
                  {membersStatus.message}
                </div>
              )}
              {membersStatus.error && (
                <div className="text-sm text-red-600">
                  {membersStatus.error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Team List */}
      <div className="space-y-3">
        <AnimatePresence>
          {team.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className={`bg-white border rounded p-4 ${
                dragOverId === member.id
                  ? "ring-2 ring-offset-2 ring-blue-300"
                  : ""
              } ${draggingId === member.id ? "opacity-60" : ""}`}
              draggable
              onDragStart={(e) => handleDragStart(e, member.id)}
              onDragOver={(e) => handleDragOver(e, member.id)}
              onDrop={(e) => handleDrop(e, member.id)}
            >
              <button
                onClick={() => toggleExpand(member.id)}
                className="flex justify-between items-center w-full text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-[#3E3C3C] text-sm">
                    {member.name}
                  </span>
                  <span className="text-sm text-[#6D6D6D]">
                    {member.position}
                  </span>
                </div>
                {expandedId === member.id ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              <AnimatePresence>
                {expandedId === member.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 space-y-3"
                  >
                    {/* show position only in header; description and photo only when featured */}
                    <div>
                      <div className="mt-2">
                        <label className="block text-sm text-[#6D6D6D]">
                          Description
                        </label>
                        {member.featured ? (
                          <textarea
                            value={member.description || ""}
                            onChange={(e) =>
                              setTeam((prev) =>
                                prev.map((m) =>
                                  m.id === member.id
                                    ? { ...m, description: e.target.value }
                                    : m
                                )
                              )
                            }
                            className="border p-2 w-full text-sm h-28 mt-1"
                          />
                        ) : (
                          <p className="text-sm text-[#6D6D6D] mt-1">
                            Not featured
                          </p>
                        )}
                      </div>

                      {member.featured && (
                        <div className="mt-2 flex items-start gap-4">
                          <label
                            className={`inline-block ${
                              imagePreviews[`member_${member.id}`] ||
                              member.photo
                                ? "opacity-40 pointer-events-none"
                                : ""
                            }`}
                          >
                            <span
                              className={`bg-gray-200 px-3 py-1 rounded text-sm ${
                                imagePreviews[`member_${member.id}`] ||
                                member.photo
                                  ? "cursor-not-allowed"
                                  : "cursor-pointer"
                              }`}
                            >
                              Change Photo
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleMemberPhoto(
                                  member.id,
                                  e.target.files?.[0]
                                )
                              }
                              disabled={
                                !!(
                                  imagePreviews[`member_${member.id}`] ||
                                  member.photo
                                )
                              }
                            />
                          </label>

                          {imagePreviews[`member_${member.id}`] ||
                          member.photo ? (
                            <div className="relative">
                              <img
                                src={
                                  imagePreviews[`member_${member.id}`] ||
                                  member.photo
                                }
                                alt="member"
                                className="h-28 w-28 object-cover rounded mt-2"
                              />
                              <button
                                onClick={() => {
                                  // remove member image
                                  setTeam((prev) =>
                                    prev.map((m) =>
                                      m.id === member.id
                                        ? { ...m, photo: "" }
                                        : m
                                    )
                                  );
                                  setImagePreviews((p) => {
                                    const copy = { ...p };
                                    delete copy[`member_${member.id}`];
                                    return copy;
                                  });
                                }}
                                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow"
                                title="Remove image"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : null}

                          <div className="mt-2">
                            <label className="inline-flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={!!member.featured}
                                onChange={(e) =>
                                  setTeam((prev) =>
                                    prev.map((m) =>
                                      m.id === member.id
                                        ? { ...m, featured: e.target.checked }
                                        : m
                                    )
                                  )
                                }
                              />
                              <span>Featured</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(member)}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded text-sm"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded text-sm"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Team Images */}
      {/* Heading */}
      <div className="bg-white p-4 rounded border space-y-3">
        <h3 className="font-semibold text-[#3E3C3C]">Team Page Hero Section</h3>

        <input
          value={heading.title}
          onChange={(e) => setHeading((s) => ({ ...s, title: e.target.value }))}
          placeholder="Title"
          className="border p-2 w-full text-sm"
        />

        <input
          value={heading.subtitle}
          onChange={(e) =>
            setHeading((s) => ({ ...s, subtitle: e.target.value }))
          }
          placeholder="Subtitle"
          className="border p-2 w-full text-sm"
        />

        {heading.image && (
          <img
            src={heading.image}
            alt="heading"
            className="h-36 object-cover rounded"
          />
        )}

        <label className="inline-block">
          <span className="bg-gray-200 px-3 py-1 rounded text-sm cursor-pointer">
            Change Heading Image
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleHeadingImage(e.target.files?.[0])}
          />
        </label>
        <div className="space-y-3 pt-4">
          <h4 className="font-semibold">Intro Paragraphs</h4>
          {(heading.paragraphs || []).map((p) => (
            <div key={p.id} className="space-y-2">
              <textarea
                value={p.text}
                onChange={(e) => updateHeadingParagraph(p.id, e.target.value)}
                className="border p-2 w-full text-sm h-20"
              />
              <div>
                <button
                  onClick={() => removeHeadingParagraph(p.id)}
                  className="text-sm text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addHeadingParagraph}
            className="px-3 py-1 bg-gray-200 rounded text-sm"
          >
            + Add Paragraph
          </button>
          <div className="pt-3">
            <button
              onClick={saveHeading}
              className="px-4 py-2 bg-[#3E3C3C] text-white rounded text-sm"
            >
              Save Content
            </button>
            <div className="pt-2">
              {headingStatus.message && (
                <div className="text-sm text-green-600">
                  {headingStatus.message}
                </div>
              )}
              {headingStatus.error && (
                <div className="text-sm text-red-600">
                  {headingStatus.error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded border space-y-2">
        <h3 className="font-semibold text-[#3E3C3C]">Marquee Images</h3>
        <p className="text-sm text-[#6D6D6D]">
          Upload images of the full team here.
        </p>
        <label className="inline-block">
          <span className="bg-black text-white px-4 py-2 rounded text-sm cursor-pointer">
            Choose Images
          </span>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => addMarqueeImages(e.target.files)}
          />
        </label>

        {/* marquee previews */}
        <div className="flex flex-wrap gap-3 pt-3">
          {marquee.map((img) => (
            <div key={img.id} className="relative">
              <img
                src={img.img_src}
                alt={img.alt || "marquee"}
                className="h-28 w-40 object-cover rounded"
              />
              <button
                onClick={() =>
                  setMarquee((prev) => prev.filter((i) => i.id !== img.id))
                }
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow"
                title="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-3">
          <button
            onClick={saveMarquee}
            className="px-4 py-2 bg-gray-700 text-white rounded text-sm"
          >
            Save Marquee
          </button>
        </div>
        <div className="pt-2">
          {marqueeStatus.message && (
            <div className="text-sm text-green-600">
              {marqueeStatus.message}
            </div>
          )}
          {marqueeStatus.error && (
            <div className="text-sm text-red-600">{marqueeStatus.error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamPageUpdates;
