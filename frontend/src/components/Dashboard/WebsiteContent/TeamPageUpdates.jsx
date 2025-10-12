import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, Plus, X, ChevronDown, ChevronUp } from "lucide-react";

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

  // Add or update member
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

  // Edit member
  const handleEdit = (member) => {
    setEditingId(member.id);
    setNewMember({ name: member.name, position: member.position });
    setExpandedId(member.id);
  };

  // Delete member
  const handleDelete = (id) => {
    setTeam((prev) => prev.filter((m) => m.id !== id));
    if (editingId === id) setEditingId(null);
    if (expandedId === id) setExpandedId(null);
  };

  return (
    <div className="p-6 bg-white text-[#454545] rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Team Members</h2>

      {/* Add / Edit Form */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Name"
          value={newMember.name}
          onChange={(e) =>
            setNewMember((prev) => ({ ...prev, name: e.target.value }))
          }
          className="px-3 py-2 rounded border w-full sm:w-1/3"
        />
        <input
          type="text"
          placeholder="Position"
          value={newMember.position}
          onChange={(e) =>
            setNewMember((prev) => ({ ...prev, position: e.target.value }))
          }
          className="px-3 py-2 rounded border w-full sm:w-1/3"
        />
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
        >
          <Plus size={16} /> {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setNewMember({ name: "", position: "" });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
          >
            <X size={16} /> Cancel
          </button>
        )}
      </div>

      {/* Team List */}
      <div className="space-y-2">
        <AnimatePresence>
          {team.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="border rounded p-3 flex flex-col"
            >
              <button
                onClick={() => toggleExpand(member.id)}
                className="flex justify-between items-center w-full text-left"
              >
                <span className="font-medium">{member.name}</span>
                {expandedId === member.id ? <ChevronUp /> : <ChevronDown />}
              </button>

              <AnimatePresence>
                {expandedId === member.id && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 space-y-2"
                  >
                    <p className="text-sm">Position: {member.position}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-300 text-[#454545] rounded hover:bg-gray-400 transition"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-300 text-[#454545] rounded hover:bg-gray-400 transition"
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

      {/* Team Images Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Team Images</h3>
        <p className="text-sm text-gray-600">
          Upload images of the full team here.
        </p>
        <input type="file" multiple className="mt-2" />
        <div className="mt-2 space-y-2">
          {/* Placeholder for uploaded images */}
        </div>
      </div>
    </div>
  );
};

export default TeamPageUpdates;
