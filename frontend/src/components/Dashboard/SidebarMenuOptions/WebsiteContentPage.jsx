import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TeamPageUpdates from "../WebsiteContent/TeamPageUpdates"; // Team CRUD
import AboutPageUpdates from "../WebsiteContent/AboutPageUpdates"; // About CRUD
import ContactContent from "../WebsiteContent/ContactContentUpdates"; // Contact simple CRUD

// Main page
const WebsiteContentPage = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    { name: "About Page", key: "about", component: <AboutPageUpdates /> }, // full CRUD About
    { name: "Team Page", key: "team", component: <TeamPageUpdates /> }, // full CRUD Team
    { name: "Contact Page", key: "contact", component: <ContactContent /> }, // Contact content
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Website Content Management</h1>

      {sections.map((section) => (
        <div key={section.key} className="border-b">
          <button
            className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition"
            onClick={() => toggleSection(section.key)}
          >
            <span className="font-semibold">{section.name}</span>
            {openSection === section.key ? <ChevronUp /> : <ChevronDown />}
          </button>

          <AnimatePresence initial={false}>
            {openSection === section.key && (
              <motion.div
                key="content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 overflow-hidden"
              >
                {section.component}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default WebsiteContentPage;
