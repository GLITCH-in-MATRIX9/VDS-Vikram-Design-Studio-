import React from "react";
import LeaderDropdown from "./LeaderDropdown";
import { TAG_OPTIONS, STATES_AND_UTS } from "../constants";

const MandatoryFields = ({
  formData,
  handleChange,
  handleCategoryChange,
  selectedCategory,
  availableSubCategories,
  handleLeaderToggle,
  showLeaderDropdown,
  setShowLeaderDropdown,
  PROJECT_LEADERS_OPTIONS,
}) => (
  <div className="flex flex-col gap-4">
    <h2 className="font-bold text-lg text-[#454545]">1. Mandatory Fields</h2>

    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      placeholder="Project Name *"
      className="border p-2 rounded w-full border-[#C9BEB8]"
      required
    />

    <select
      name="location"
      value={formData.location}
      onChange={handleChange}
      className="border p-2 rounded w-full border-[#C9BEB8]"
      required
    >
      <option value="">Select State/UT *</option>
      {STATES_AND_UTS.map((state) => (
        <option key={state} value={state}>
          {state}
        </option>
      ))}
    </select>

    {/* Latitude and Longitude Fields */}
    <div className="grid grid-cols-2 gap-2">
      <input
        type="number"
        name="latitude"
        value={formData.latitude}
        onChange={handleChange}
        placeholder="Latitude"
        step="any"
        className="border p-2 rounded w-full border-[#C9BEB8]"
      />

      <input
        type="number"
        name="longitude"
        value={formData.longitude}
        onChange={handleChange}
        placeholder="Longitude"
        step="any"
        className="border p-2 rounded w-full border-[#C9BEB8]"
      />
    </div>

    <div className="grid grid-cols-2 gap-2">
      <select
        name="category"
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="border p-2 rounded w-full border-[#C9BEB8]"
        required
      >
        <option value="">Select Category *</option>
        {TAG_OPTIONS.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select
        name="subCategory"
        value={formData.subCategory}
        onChange={handleChange}
        className="border p-2 rounded w-full border-[#C9BEB8]"
        disabled={!availableSubCategories.length}
      >
        <option value="">Select Sub-Category</option>
        {availableSubCategories.map((sub) => (
          <option key={sub} value={sub}>
            {sub}
          </option>
        ))}
      </select>
    </div>

    <input
      type="text"
      name="client"
      value={formData.client}
      onChange={handleChange}
      placeholder="Client *"
      className="border p-2 rounded w-full border-[#C9BEB8]"
      required
    />

    <input
      type="text"
      name="collaborators"
      value={formData.collaborators}
      onChange={handleChange}
      placeholder="Collaborators *"
      className="border p-2 rounded w-full border-[#C9BEB8]"
      required
    />

    <LeaderDropdown
      options={PROJECT_LEADERS_OPTIONS}
      selected={formData.projectLeaders}
      onToggle={handleLeaderToggle}
      show={showLeaderDropdown}
      setShow={setShowLeaderDropdown}
    />

    <input
      type="text"
      name="projectTeam"
      value={formData.projectTeam}
      onChange={handleChange}
      placeholder="Project Team *"
      className="border p-2 rounded w-full border-[#C9BEB8]"
      required
    />
  </div>
);

export default MandatoryFields;
