// src/components/FilterSidebar.jsx

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import CloseIcon from "../assets/Icons/CloseIcon.svg";
import SubCategorySelectedIcon from "../assets/Icons/SubCategorySelected.svg";
import { useFilters } from "../context/filterContext";
const filterOptions = {
  Education: [
    "Schools",
    "Training Institutions/Centres",
    "Research Centres",
    "Colleges & Universities",
  ],
  Healthcare: ["Hospitals", "Medical Colleges", "Diagnostic Labs", "Clinics"],
  Civic: [
    "Auditoriums",
    "Town Halls",
    "Police Stations",
    "Public toilets & amenities",
  ],
  Workspace: ["Government offices", "Corporate offices", "Research Centres"],
  Sports: ["Stadiums", "Sports complex", "Multipurpose sports halls"],
  Culture: ["Religious", "Memorials", "Cultural complex", "Museums"],
  Residential: [
    "Staff quarters",
    "Private Villas",
    "Private Apartments",
    "Housing",
    "Hostels",
    "Guest Houses",
  ],
  Hospitality: ["Hotels", "Resorts", "Restaurants", "Tourism Lodges"],
  Retail: [
    "Showrooms",
    "Shopping complex",
    "Departmental stores",
    "Multiplexes",
  ],
};

const FilterSidebar = ({ isOpen }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const {
    categoryContext,
    setCategoryContext,
    subCategoryContext,
    setSubCategoryContext,
  } = useFilters();

  console.log(subCategoryContext);

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
          className="fixed mt-[2px] right-0 h-[calc(100vh-80px)] w-[187px] bg-[#F2EFEE] z-[99] flex flex-col shadow-[-2px_0_2px_0_#3E3C3C0A,-4px_0_8px_-4px_#3E3C3C29]"
        >
          {/* Filter Categories */}
          <div className="flex-1 overflow-y-auto pb-4 ">
            {Object.keys(filterOptions).map((category) => (
              <div key={category}>
                <div
                  className="font-inter flex items-center gap-1 px-6 py-3 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSelectedCategory(
                      selectedCategory?.toUpperCase() ===
                        category?.toUpperCase()
                        ? null
                        : category
                    );
                    setCategoryContext(
                      categoryContext?.toUpperCase() === category?.toUpperCase()
                        ? null
                        : category
                    );
                    setSubCategoryContext(null);
                  }}
                >
                  <span className="text-gray-[#474545] font-medium text-[10px] uppercase ">
                    {category}
                  </span>
                  <img
                    src={CloseIcon}
                    className={`text-gray-[#474545] transition w-[6px] ${
                      selectedCategory?.toUpperCase() ===
                      category?.toUpperCase()
                        ? "rotate-0"
                        : "rotate-[-45deg]"
                    }`}
                  />
                </div>
                <AnimatePresence>
                  {selectedCategory?.toUpperCase() ===
                    category?.toUpperCase() && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden bg-[#F2EFEE]"
                    >
                      <ul className=" pl-9">
                        {filterOptions[category].map((option) => (
                          <li
                            key={option}
                            onClick={(prev) => {
                              setSubCategoryContext(
                                subCategoryContext?.toUpperCase() ===
                                  option.toUpperCase()
                                  ? null
                                  : option
                              );
                            }}
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
