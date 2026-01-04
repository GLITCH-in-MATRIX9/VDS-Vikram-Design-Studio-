import React from "react";
import { FaTrash } from "react-icons/fa";

const ProjectTags = ({
  formData,
  tagInput,
  savedTags,
  handleAddTag,
  handleRemoveTag,
  setTagInput,
  showDropdown,
  setShowDropdown,
}) => (
  <div>
    <h2 className="font-bold text-lg mb-2 text-[#454545]">2. Project Tags</h2>

    <div className="relative">
      <div className="flex border rounded border-[#C9BEB8] overflow-hidden">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => {
            setTagInput(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag();
            }
          }}
          placeholder="Add tags..."
          className="p-2 flex-grow focus:outline-none"
        />
        <button
          type="button"
          onClick={() => handleAddTag()}
          className="px-4 py-2 bg-[#722F37] text-white hover:bg-[#632932] text-sm font-medium"
        >
          Add
        </button>
      </div>

      {showDropdown && tagInput.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-t-0 rounded-b shadow-lg max-h-60 overflow-y-auto">
          {savedTags
            .filter(
              (tag) =>
                tag.includes(tagInput.toUpperCase()) &&
                !formData.tags.includes(tag)
            )
            .map((tag) => (
              <div
                key={tag}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleAddTag(tag);
                }}
                className="p-2 cursor-pointer hover:bg-gray-100"
              >
                {tag}
              </div>
            ))}
        </div>
      )}
    </div>

    <div className="mt-2 flex gap-2 flex-wrap">
      {formData.tags.map((tag) => (
        <div
          key={tag}
          className="bg-[#722F37] text-white px-2 py-1 rounded flex items-center gap-1 text-xs font-medium"
        >
          {tag}
          <FaTrash
            className="cursor-pointer text-white"
            size={12}
            onClick={() => handleRemoveTag(tag)}
          />
        </div>
      ))}
    </div>
  </div>
);

export default ProjectTags;
