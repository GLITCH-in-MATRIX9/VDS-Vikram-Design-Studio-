// Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

import logo from "../assets/navbar/LogoIcon.png";
// import searchIcon from "../assets/icons/Search.png";
import filterIcon from "../assets/icons/Vector.png";
import hamburgerIcon from "../assets/navbar/HamburgerMenu.png";
import closeIcon from "../assets/navbar/Close.png";

// Filter options
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
  const [selectedCategory, setSelectedCategory] = useState(null);

  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      {/* Main Navbar */}
      <nav className="w-full bg-[#f3efee] border-b border-[#e0dcd7] relative z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-3 items-center">
          {/* Left column - Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src={logo}
                alt="Vikram Design Studio Logo"
                className="h-10 w-auto"
              />
              <span className="text-gray-700 text-lg">
                Vikram Design Studio
              </span>
            </Link>
          </div>

          {/* Middle column - Menu items */}
          <div className="flex justify-center">
            <ul className="hidden md:flex gap-8 text-sm font-medium text-gray-700 tracking-wider">
              <li>
                <Link to="/about">ABOUT</Link>
              </li>
              <li>
                <Link to="/team">TEAM</Link>
              </li>
              <li>
                <Link to="/contact">CONTACT</Link>
              </li>
            </ul>
          </div>

          {/* Right column */}
          <div className="flex justify-end items-center gap-4">
            {isHome ? (
              <>
                {/* Filter button */}
                <button
                  onClick={() => {
                    setFilterOpen((prev) => !prev);
                    setSelectedCategory(null);
                  }}
                  className="hover:text-[#af2b1e] transition"
                >
                  <img
                    src={filterIcon}
                    alt="filter"
                    className="h-4 w-4 object-contain"
                  />
                </button>

                {/* Search box */}
                <div className="relative flex items-center">
                  <img
                    src={filterIcon}
                    alt="search"
                    className="h-4 w-4 object-contain absolute left-2 cursor-pointer"
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-8 pr-3 py-1 h-8 w-56 text-sm rounded-full border border-gray-300 outline-none"
                  />
                </div>
              </>
            ) : (
              <div className="h-8 w-56" /> // placeholder for layout
            )}

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button onClick={() => setMenuOpen(true)}>
                <img
                  src={hamburgerIcon}
                  alt="menu"
                  className="h-8 w-8 object-contain"
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Filter Categories Bar */}
      {isHome && filterOpen && (
        <div className="w-full bg-[#f3efee] border-b border-[#e0dcd7]">
          <div className="max-w-7xl mx-auto px-6 py-3 flex justify-evenly flex-wrap">
            {Object.keys(filterOptions).map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category ? null : category
                  )
                }
                className={`px-4 py-2 rounded-md font-medium transition ${
                  selectedCategory === category
                    ? "bg-[#b9b9b9] text-white"
                    : " text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Subcategories Bar */}
      {isHome && selectedCategory && (
        <div className="w-full bg-[#f3efee]">
          <div className="max-w-7xl mx-auto px-6 py-3 flex justify-evenly flex-wrap">
            {filterOptions[selectedCategory].map((option, i) => (
              <div
                key={i}
                className="px-3 py-1 text-sm rounded-md cursor-pointer hover:bg-gray-100"
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
