import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const TeamPageUpdates = () => {
  const [team, setTeam] = useState([
    { id: 1, name: "Anjali Sharma", position: "CEO" },
    { id: 2, name: "Rohit Verma", position: "CTO" },
    { id: 3, name: "Priya Singh", position: "Lead Designer" },
    { id: 4, name: "Amit Kumar", position: "Frontend Developer" },
  ]);

  const [newMember, setNewMember] = useState({ name: "", position: "" });
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSave = () => {
    if (!newMember.name || !newMember.position) return;

    if (editingId) {
      setTeam((prev) =>
        prev.map((m) => (m.id === editingId ? { ...m, ...newMember } : m))
      );
      setEditingId(null);
    } else {
      const id = Math.max(0, ...team.map((m) => m.id)) + 1;
      setTeam([...team, { id, ...newMember }]);
    }
    setNewMember({ name: "", position: "" });
  };

  const handleEdit = (member) => {
    setEditingId(member.id);
    setNewMember({ name: member.name, position: member.position });
    setExpandedId(member.id);
  };

  const handleDelete = (id) => {
    setTeam((prev) => prev.filter((m) => m.id !== id));
    if (editingId === id) setEditingId(null);
    if (expandedId === id) setExpandedId(null);
  };

  return (
    <div className="p-6 bg-[#f3efee] space-y-8">
      {/* Title */}
      <h2 className="text-2xl font-bold text-[#3E3C3C]">
        Team Members
      </h2>

      {/* Add / Edit Form */}
      <div className="bg-white p-4 rounded border space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newMember.name}
            onChange={(e) =>
              setNewMember((prev) => ({ ...prev, name: e.target.value }))
            }
            className="border p-2 text-sm w-full sm:w-1/3"
          />
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
            className="border p-2 text-sm w-full sm:w-1/3"
          />
        </div>

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
              className="bg-white border rounded p-4"
            >
              <button
                onClick={() => toggleExpand(member.id)}
                className="flex justify-between items-center w-full text-left"
              >
                <span className="font-semibold text-[#3E3C3C] text-sm">
                  {member.name}
                </span>
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
                    <p className="text-sm text-[#6D6D6D]">
                      Position: {member.position}
                    </p>

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
      <div className="bg-white p-4 rounded border space-y-2">
        <h3 className="font-semibold text-[#3E3C3C]">
          Team Images
        </h3>
        <p className="text-sm text-[#6D6D6D]">
          Upload images of the full team here.
        </p>

        <label className="inline-block">
          <span className="bg-black text-white px-4 py-2 rounded text-sm cursor-pointer">
            Choose Images
          </span>
          <input type="file" multiple className="hidden" />
        </label>
      </div>
    </div>
  );
};

export default TeamPageUpdates;
