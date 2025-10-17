import { AnimatePresence, motion } from "framer-motion";
import { useState, useCallback } from "react";
import { useFilters } from "../context/filterContext";
import debounce from "lodash/debounce";

import CloseIcon from "../assets/Icons/CloseIcon.svg";
import SubCategorySelectedIcon from "../assets/Icons/SubCategorySelected.svg";

const filterOptions = {
  Education: ["Schools","Training Institutions/Centres","Research Centres","Colleges & Universities"],
  Healthcare: ["Hospitals","Medical Colleges","Diagnostic Labs","Clinics"],
  Civic: ["Auditoriums","Town Halls","Police Stations","Public toilets & amenities"],
  Workspace: ["Government offices","Corporate offices","Research Centres"],
  Sports: ["Stadiums","Sports complex","Multipurpose sports halls"],
  Culture: ["Religious","Memorials","Cultural complex","Museums"],
  Residential: ["Staff quarters","Private Villas","Private Apartments","Housing","Hostels","Guest Houses"],
  Hospitality: ["Hotels","Resorts","Restaurants","Tourism Lodges"],
  Retail: ["Showrooms","Shopping complex","Departmental stores","Multiplexes"],
};

const FilterSidebar = ({ isOpen }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { categoryContext, setCategoryContext, subCategoryContext, setSubCategoryContext, searchQuery, setSearchQuery } = useFilters();

  // Debounced search
  const handleSearchDebounced = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="filter-sidebar"
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 1, ease: [0.83, 0, 0.17, 1] }}
          className="fixed mt-[2px] right-0 h-[calc(100vh-80px)] w-[187px] bg-[#F2EFEE] z-[99] flex flex-col shadow-[-2px_0_2px_0_#3E3C3C0A,-4px_0_8px_-4px_#3E3C3C29]"
        >
          {/* Search Input */}
          <div className="px-4 py-2">
            <input
              type="text"
              defaultValue={searchQuery}
              placeholder="Search projects..."
              className="w-full py-1 px-2 rounded-full border border-gray-300 text-[10px] outline-none"
              onChange={(e) => handleSearchDebounced(e.target.value)}
            />
          </div>

          {/* Filter Categories */}
          <div className="flex-1 overflow-y-auto pb-4">
            {Object.keys(filterOptions).map((category) => (
              <div key={category}>
                <div
                  className="font-inter flex items-center gap-1 px-6 py-3 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    const newCat = selectedCategory?.toUpperCase() === category?.toUpperCase() ? null : category;
                    setSelectedCategory(newCat);
                    setCategoryContext(categoryContext?.toUpperCase() === category?.toUpperCase() ? null : category);
                    setSubCategoryContext(null);
                  }}
                >
                  <span className="text-[#474545] font-medium text-[10px] uppercase">{category}</span>
                  <img
                    src={CloseIcon}
                    className={`w-[6px] transition ${selectedCategory?.toUpperCase() === category?.toUpperCase() ? "rotate-0" : "rotate-[-45deg]"}`}
                  />
                </div>

                <AnimatePresence>
                  {selectedCategory?.toUpperCase() === category?.toUpperCase() && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden bg-[#F2EFEE]"
                    >
                      <ul className="pl-9">
                        {filterOptions[category].map((option) => (
                          <li
                            key={option}
                            onClick={() => {
                              const newSub = subCategoryContext?.toUpperCase() === option.toUpperCase() ? null : option;
                              setSubCategoryContext(newSub);
                            }}
                            className="py-2 text-[#474545] cursor-pointer text-[8px] font-medium uppercase flex gap-1 items-center"
                          >
                            <img src={SubCategorySelectedIcon} alt="" className="w-1" />
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
