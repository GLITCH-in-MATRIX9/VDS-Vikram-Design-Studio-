// src/components/FilterSidebar.jsx

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import CloseIcon from "../assets/Icons/CloseIcon.svg";
import SubCategorySelectedIcon from "../assets/Icons/SubCategorySelected.svg";
const filterOptions = {
  EDUCATION: [
    "Schools",
    "Training Institutions/Centres",
    "Research Centres",
    "Colleges & Universities",
  ],
  HEALTHCARE: ["Hospitals", "Medical Colleges", "Diagnostic Labs", "Clinics"],
  CIVIC: [
    "Auditoriums",
    "Town Halls",
    "Police Stations",
    "Public toilets & amenities",
  ],
  WORKSPACE: ["Government offices", "Corporate offices", "Research Centres"],
  SPORTS: ["Stadiums", "Sports complex", "Multipurpose sports halls"],
  CULTURE: ["Religious", "Memorials", "Cultural complex", "Museums"],
  RESIDENTIAL: [
    "Staff quarters",
    "Private Villas",
    "Housing",
    "Hostels",
    "Guest Houses",
  ],
  HOSPITALITY: ["Hotels", "Resorts", "Restaurants", "Tourism Lodges"],
  RETAIL: [
    "Showrooms",
    "Shopping complex",
    "Departmental stores",
    "Multiplexes",
  ],
};

const FilterSidebar = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedCategory(null);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="filter-sidebar"
          // Animation from the right side
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 1, ease: [0.83, 0, 0.17, 1] }}
          // Adjusted classes for positioning and height
          className="fixed top-20 right-0 h-[calc(100vh-80px)] w-80 bg-[#f3efee] shadow-lg z-[99] flex flex-col"
        >
          {/* Filter Categories */}
          <div className="flex-1 overflow-y-auto pb-4">
            {Object.keys(filterOptions).map((category) => (
              <div key={category}>
                <div
                  className="font-inter flex items-center gap-1 px-6 py-3 cursor-pointer hover:bg-gray-100"
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category ? null : category
                    )
                  }
                >
                  <span className="text-gray-[#474545] font-medium text-[10px]">
                    {category}
                  </span>
                  <img
                    src={CloseIcon}
                    className={`text-gray-[#474545] transition w-[6px] ${
                      selectedCategory === category && "rotate-[45deg]"
                    }`}
                  />
                </div>
                <AnimatePresence>
                  {selectedCategory === category && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden bg-[#f3efee]"
                    >
                      <ul className=" pl-9">
                        {filterOptions[category].map((option) => (
                          <li
                            key={option}
                            className="py-2 text-[#474545] transition cursor-pointer text-[8px] font-medium uppercase flex gap-1 items-center"
                          >
                            <img
                              src={SubCategorySelectedIcon}
                              alt=""
                              className="w-1"
                            />
                            {option}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterSidebar;
