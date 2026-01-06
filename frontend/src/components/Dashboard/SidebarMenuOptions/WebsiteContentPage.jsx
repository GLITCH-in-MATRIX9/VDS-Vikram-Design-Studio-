import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TeamPageUpdates from "../WebsiteContent/TeamPageUpdates";
import AboutPageUpdates from "../WebsiteContent/AboutPageUpdates";
import ContactContent from "../WebsiteContent/ContactContentUpdates";

const WebsiteContentPage = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    { name: "About Page", key: "about", component: <AboutPageUpdates /> },
    { name: "Team Page", key: "team", component: <TeamPageUpdates /> },
    { name: "Contact Page", key: "contact", component: <ContactContent /> },
  ];

  return (
    <div className="p-6 space-y-6 bg-[#f3efee] min-h-screen">
      <h1 className="text-2xl font-bold text-[#3E3C3C]">
        Website Content Management
      </h1>

      {sections.map((section) => {
        const isActive = openSection === section.key;

        return (
          <div key={section.key} className="border-b border-[#d8d3d0]">
            {/* Header Button */}
            <button
              onClick={() => toggleSection(section.key)}
              className={`w-full flex justify-between items-center px-4 py-4 text-left transition
                ${
                  isActive
                    ? "bg-[#ebe6e3] text-[#3E3C3C]"
                    : "text-[#6D6D6D] hover:bg-[#f0ebe8]"
                }`}
            >
              <span className="font-semibold tracking-wide">
                {section.name}
              </span>

              {isActive ? (
                <ChevronUp className="text-[#3E3C3C]" />
              ) : (
                <ChevronDown className="text-[#6D6D6D]" />
              )}
            </button>

            {/* Active underline */}
            <div
              className={`h-[2px] transition-all duration-300 ${
                isActive
                  ? "bg-[#3E3C3C] w-full"
                  : "bg-transparent w-0"
              }`}
            />

            {/* Content */}
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="overflow-hidden px-4 py-6"
                >
                  {section.component}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default WebsiteContentPage;
