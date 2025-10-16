import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFilters } from "../context/filterContext";
import CategorySelectedIcon from "../assets/Icons/CategorySelected.svg";
import SubCategorySelectedIcon from "../assets/Icons/SubCategorySelected.svg";
import CloseIcon from "../assets/Icons/CloseIcon.svg";

import {
  FaYoutube,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

import logo from "../assets/navbar/LogoIcon.png";
import searchIcon from "../assets/Icons/Search.png";
import filterIcon from "../assets/Icons/Vector.png";
import hamburgerIcon from "../assets/navbar/HamburgerMenu.png";
import closeIcon from "../assets/navbar/Close.png";

import FilterSidebar from "./FilterSideBar";

// Filter options data (used for both desktop and mobile versions)
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

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const {
    categoryContext,
    setCategoryContext,
    subCategoryContext,
    setSubCategoryContext,
    clearFilters,
  } = useFilters();

  useEffect(() => {
    // If the menu is open, add the 'no-scroll' class to the body
    if (menuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [menuOpen]);

  const location = useLocation();
  const isHome = location.pathname === "/";

  const handleFilterClose = () => {
    setFilterOpen(false);
    clearFilters();
  };

  const closeAllMenus = () => {
    setMenuOpen(false);
    handleFilterClose();
  };

  useEffect(() => {
    if (!isHome) {
      clearFilters();
      setFilterOpen(false);
    }
  }, [isHome, clearFilters]);

  return (
    <>
      {/* Main Navbar */}
      <nav className="w-full px-4 md:px-8 xl:px-20 bg-[#f2efee]  relative z-50">
        <div className="  mx-auto py-4 flex justify-between items-center">
          {/* Left - Logo */}
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={closeAllMenus}
            >
              <img
                src={logo}
                alt="Vikram Design Studio Logo"
                className="h-8 md:h-12 w-auto"
              />
              <span className="text-[#454545] leading-[1em] hidden md:block text-xs md:text-xl xl:text-2xl font-humanist">
                Vikram Design Studio
              </span>
            </Link>
          </div>

          {/* Center - Desktop menu */}
          <div className="hidden md:flex flex-grow justify-center">
            <ul
              className={`flex transition gap-8 text-sm font-medium text-gray-700 tracking-wider ${
                filterOpen && "opacity-0"
              }`}
            >
              <li>
                <Link to="/about" onClick={closeAllMenus}>
                  ABOUT
                </Link>
              </li>
              <li>
                <Link to="/team" onClick={closeAllMenus}>
                  TEAM
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={closeAllMenus}>
                  CONTACT
                </Link>
              </li>
            </ul>
          </div>

          {/* Right - Search / Filter / Hamburger */}
          <div className="flex items-center gap-4">
            {/* Desktop Icons (visible on md and up) */}
            <div
              className={`hidden md:flex items-center gap-4 uppercase text-[#474545] ${
                !isHome && "invisible pointer-events-none"
              }`}
            >
              {!filterOpen ? (
                <button
                  onClick={() => {
                    setFilterOpen(true);
                    setMenuOpen(false);
                  }}
                  className="transition cursor-pointer"
                >
                  <img
                    src={filterIcon}
                    alt="filter"
                    className="h-4 w-4 object-contain"
                  />
                </button>
              ) : (
                "Filter"
              )}
              {!filterOpen ? (
                <div className="relative flex items-center">
                  <img
                    src={searchIcon}
                    alt="search"
                    className="h-7 w-4 object-contain absolute left-2"
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-8 pr-3 py-1 h-8 w-56 text-sm rounded-full border border-gray-300 outline-none focus:border-gray-500 transition"
                  />
                </div>
              ) : (
                <div
                  onClick={() => {
                    handleFilterClose();
                    setMenuOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <img src={closeIcon} className="grayscale w-4 " />
                </div>
              )}
            </div>

            {/* Mobile Icons (visible below md) */}
            <div className={`md:hidden flex items-center gap-4`}>
              <button
                onClick={() => {
                  setMobileFilterOpen((prev) => !prev);
                  setMenuOpen(false);
                }}
                className="relative"
              >
                {/* Badge */}
                <div
                  className={`badge h-[6px] w-[6px] rounded-2xl transition bg-[#C94A4A] absolute top-[-2px] right-[-2px] opacity-0 ${
                    (categoryContext || subCategoryContext) && "opacity-100"
                  }`}
                ></div>
                <img
                  src={filterIcon}
                  alt={"filter"}
                  className={`h-3 object-contain ${
                    !isHome && "invisible pointer-events-none"
                  }`}
                />
              </button>
              <button onClick={() => setMenuOpen(true)}>
                <img
                  src={hamburgerIcon}
                  alt="menu"
                  className="w-4 object-contain"
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Desktop Filter Categories Bar */}
      <AnimatePresence>
        {isHome && filterOpen && (
          <motion.div
            key="filters"
            initial={{ height: 0, opacity: 1 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.83, 0, 0.17, 1] }}
            className="w-full bg-[#F2EFEE] border-b border-[#e0dcd7] overflow-hidden z-40"
          >
            <div className="max-w-7xl mx-auto px-6 py-3 grid grid-cols-2 md:flex justify-evenly flex-wrap gap-2">
              {Object.keys(filterOptions).map((category) => (
                <button
                  key={category}
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
                    setSelectedSubCategory(null);
                    setSubCategoryContext(null);
                  }}
                  className={`flex gap-2 items-center px-4 py-2 rounded-md font-inter font-medium transition text-[#474545] uppercase ${
                    selectedCategory === null
                      ? "text-[#474545]"
                      : selectedCategory?.toUpperCase() ===
                        category?.toUpperCase()
                      ? "text-[#474545]"
                      : " text-[#BEBBBC]"
                  } text-xs xl:text-sm `}
                >
                  <img
                    src={CategorySelectedIcon}
                    className={`transition w-3 h-3 opacity-0 ${
                      selectedCategory?.toUpperCase() ===
                        category?.toUpperCase() && "opacity-100"
                    } `}
                  />
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Subcategories Bar */}
      <AnimatePresence>
        {isHome && selectedCategory && filterOpen && (
          <motion.div
            key="subfilters"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.83, 0, 0.17, 1] }}
            className="w-full bg-[#F2EFEE] overflow-hidden z-30"
          >
            <div className="max-w-7xl mx-auto px-6 py-3 flex justify-evenly flex-wrap gap-2 text-[#474545]">
              {filterOptions[selectedCategory].map((option, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedSubCategory(
                      selectedSubCategory?.toUpperCase() ===
                        option.toUpperCase()
                        ? null
                        : option
                    );
                    setSubCategoryContext(
                      subCategoryContext?.toUpperCase() === option.toUpperCase()
                        ? null
                        : option
                    );
                  }}
                  className={`px-3 py-1 text-[10px] rounded-md cursor-pointer transition uppercase xl:text-xs flex gap-1 items-center ${
                    selectedSubCategory === null
                      ? "text-[#474545]"
                      : selectedSubCategory?.toUpperCase() ===
                        option.toUpperCase()
                      ? "text-[#474545]"
                      : " text-[#BEBBBC]"
                  }`}
                >
                  <img
                    src={SubCategorySelectedIcon}
                    className={`transition w-[5.25px] h-[5.25px] opacity-0 ${
                      selectedSubCategory?.toUpperCase() ===
                        option.toUpperCase() && "opacity-100"
                    } `}
                  />
                  {option}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sliding Menu - MODIFIED FOR RIGHT SLIDE-IN */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 1, x: "100%" }}
            animate={{ opacity: 1, x: "0%" }}
            exit={{ opacity: 1, x: "100%" }}
            transition={{ duration: 1, ease: [0.83, 0, 0.17, 1] }}
            className="fixed top-0 right-0 z-[100] bg-[#f9f6f3] w-[187px] h-[764px] shadow-[-2px_0px_2px_0px_#3E3C3C0A]"
          >
            <div className="w-full h-full flex flex-col shadow-[-4px_0px_8px_-4px_#3E3C3C29]">
              <div className="w-full flex justify-end pt-6 pr-6">
                <button onClick={() => closeAllMenus()}>
                  <img src={closeIcon} alt="close" className="h-4" />
                </button>
              </div>

              <ul className="flex flex-col mt-30 text-[#C94A4A] font-semibold text-xs gap-6 ml-6">
                <li>
                  <Link to="/" onClick={closeAllMenus}>
                    HOME
                  </Link>
                </li>
                <li>
                  <Link to="/about" onClick={closeAllMenus}>
                    ABOUT
                  </Link>
                </li>
                <li>
                  <Link to="/team" onClick={closeAllMenus}>
                    TEAM
                  </Link>
                </li>
                {/* <li><Link to="/careers" onClick={closeAllMenus}>CAREERS</Link></li> */}
                <li>
                  <Link to="/contact" onClick={closeAllMenus}>
                    CONTACT
                  </Link>
                </li>
              </ul>

              <div className="mt-auto flex flex-col gap-8 px-4 pb-6">
                <div className="flex space-x-6 text-[#C94A4A] justify-center">
                  <a
                    href="https://www.youtube.com/@vikramdesignstudio4300/featured"
                    target="_blank"
                  >
                    <FaYoutube />
                  </a>
                  <a
                    href="https://www.facebook.com/VikramDesignStudioOfficial/"
                    target="_blank"
                  >
                    <FaFacebookF />
                  </a>
                  <a
                    href="https://www.instagram.com/vikramdesignstudio/"
                    target="_blank"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/74880921/admin/dashboard/"
                    target="_blank"
                  >
                    <FaLinkedinIn />
                  </a>
                </div>
                <p className="uppercase text-[8px] text-[#5D5D5D]">
                  Vikram Design Studio @ 2025. All rights reserved.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render the new FilterSidebar component for mobile only */}
      <FilterSidebar isOpen={mobileFilterOpen} />
    </>
  );
};

export default Navbar;
