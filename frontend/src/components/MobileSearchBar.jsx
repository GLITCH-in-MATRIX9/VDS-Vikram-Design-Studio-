import { useCallback } from "react";
import { useSearch } from "../context/searchContext";
import { AnimatePresence, motion } from "framer-motion";
import CloseIcon from "../assets/Icons/CloseIcon.svg";
import searchIcon from "../assets/Icons/Search.png";


import debounce from "lodash/debounce";

const MobileSearchBar = ({ isOpen, onClose }) => {
  const { searchQuery, setSearchQuery } = useSearch();

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
          key="searchbar"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: "tween", duration: 1, ease: [0.83, 0, 0.17, 1] }}
          className="sticky  right-0 w-full bg-[#F2EFEE] z-[49] shadow-[0px_2px_2px_0_#3E3C3C0A,0px_4px_8px_0_#3E3C3C0A] overflow-hidden"
        >
          {/* Search Input */}
          <div className="flex gap-2 px-4 py-2 items-center">
            <img src={searchIcon} alt="search-icon" className="w-3 h-3"/>
            <input
              type="text"
              defaultValue={searchQuery}
              placeholder="Search projects..."
              className="flex-1 shrink-0 w-full py-1 px-2 rounded-full border border-gray-300 text-[10px] outline-none"
              onChange={(e) => handleSearchDebounced(e.target.value)}
            />
            <div
              className="grow-0 h-3 w-3 grid place-content-center"
              onClick={onClose}
            >
              <img src={CloseIcon} alt="close" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileSearchBar;
