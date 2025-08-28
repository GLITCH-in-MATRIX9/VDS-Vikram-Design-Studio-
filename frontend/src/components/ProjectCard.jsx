import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import ProjectImageGallery from "./ProjectImageGallery";
import HorizontalScrollComponent from "./HorizontalScrollComponent";

const ProjectCard = ({ project }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <motion.div
      layout
      className={`relative w-full max-w-7xl r ounded-xl p-4 overflow-hidden`}
      transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            key="collapsed"
            ref={cardRef}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="cursor-pointer"
            onClick={handleToggleExpand}
          >

            <div className="flex flex-col-reverse md:flex-row gap-4 items-start overflow-x-hidden w-full">

              <div className="flex flex-col items-start md:items-end text-left md:text-right min-w-[300px] md:min-w-[420px] max-w-lg pr-2 space-y-3">
                <p className="text-sm text-gray-600 uppercase tracking-wider">
                  Residential
                </p>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Shanti Villa
                </h2>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span>Dimapur, Nagaland</span>
                </div>
                <p className="text-sm text-gray-500">2015</p>
              </div>


              <ProjectImageGallery sections={project.sections} isZoomed={false} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full overflow-hidden"
          >
            <HorizontalScrollComponent onClose={handleToggleExpand} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectCard;
