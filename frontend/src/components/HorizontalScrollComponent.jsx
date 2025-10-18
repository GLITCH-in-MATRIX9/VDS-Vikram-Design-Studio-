import React, { useRef, useState, useEffect } from "react";
import { FiMapPin } from "react-icons/fi";
import { motion } from "framer-motion";
import ProjectSectionDisplay from "./ProjectSectionDisplay";
import LeftArrowIcon from "../assets/Icons/LeftArrowIcon.svg";
import RightArrowIcon from "../assets/Icons/RightArrowIcon.svg";
import CloseIcon from "../assets/Icons/CloseIcon.svg";

const HorizontalScrollComponent = ({ onClose, project }) => {
  const [xOffset, setXOffset] = useState(0);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [maxScroll, setMaxScroll] = useState(0);
  const scrollAmount = 960;

  const [transition, setTransition] = useState({
    duration: 1.4,
    ease: [0.76, 0, 0.24, 1],
  });

  // Drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const calculateMaxScroll = () => {
      const max =
        container.clientWidth - content.scrollWidth < 0
          ? container.clientWidth - content.scrollWidth
          : 0;
      setMaxScroll(max);
    };

    calculateMaxScroll();
    const resizeObserver = new ResizeObserver(calculateMaxScroll);
    resizeObserver.observe(content);

    return () => resizeObserver.disconnect();
  }, [project]);

  const scrollLeft = () => {
    setTransition({ duration: 1.4, ease: [0.76, 0, 0.24, 1] });
    setXOffset((prev) => Math.min(prev + scrollAmount, 0));
  };

  const scrollRight = () => {
    setTransition({ duration: 1.4, ease: [0.76, 0, 0.24, 1] });
    setXOffset((prev) => Math.max(prev - scrollAmount, maxScroll));
  };

  // Drag handlers
  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    scrollStart.current = xOffset;
    setTransition({ duration: 0 });
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    const delta = e.clientX - startX.current;
    setXOffset(Math.min(0, Math.max(maxScroll, scrollStart.current + delta)));
  };

  const onMouseUp = () => {
    isDragging.current = false;
    setTransition({ duration: 0.8, ease: [0.76, 0, 0.24, 1] });
  };

  const onTouchStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
    scrollStart.current = xOffset;
    setTransition({ duration: 0 });
  };

  const onTouchMove = (e) => {
    if (!isDragging.current) return;
    const delta = e.touches[0].clientX - startX.current;
    setXOffset(Math.min(0, Math.max(maxScroll, scrollStart.current + delta)));
  };

  const onTouchEnd = () => {
    isDragging.current = false;
    setTransition({ duration: 0.8, ease: [0.76, 0, 0.24, 1] });
  };

  return (
    <div className="relative w-full font-inter overflow-hidden">
      {/* Close Button */}
      <div className="absolute top-4 left-2 flex items-center z-20">
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-full border border-[#7E797A] bg-[#F2EFEE33] w-8 h-8 sm:w-10 sm:h-10 cursor-pointer flex items-center justify-center backdrop-blur-sm"
        >
          <img src={CloseIcon} alt="Close" className="w-3" />
        </button>
      </div>

      {/* Scroll Buttons */}
      <button
        onClick={scrollLeft}
        className="absolute z-10 left-2 top-1/2 transform -translate-y-1/2 bg-[#2B262433] w-8 h-8 rounded-full shadow-md hidden xl:flex items-center justify-center"
      >
        <img src={LeftArrowIcon} alt="Scroll Left" className="w-4" />
      </button>

      <button
        onClick={scrollRight}
        className="absolute z-10 right-2 top-1/2 transform -translate-y-1/2 bg-[#2B262433] w-8 h-8 rounded-full shadow-md hidden xl:flex items-center justify-center"
      >
        <img src={RightArrowIcon} className="w-4" alt="Scroll Right" />
      </button>

      {/* Scrollable Area */}
      <div
        ref={containerRef}
        className="flex overflow-x-hidden h-full cursor-grab"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseUp}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <motion.div
          ref={contentRef}
          animate={{ x: xOffset }}
          transition={transition}
          className="flex flex-nowrap h-full items-center"
        >
          {/* Desktop Project Info */}
          <div className="hidden xl:flex w-[240px] flex-col ml-12 pr-3 text-right items-end flex-shrink-0">
            <div className="flex flex-col gap-1 text-xs sm:text-sm">
              <div className="text-[#7E797A] font-medium uppercase">
                {project?.category || "RESIDENTIAL"}
              </div>
              <h1 className="text-[#3E3C3C] font-sora font-semibold text-xl m-0">
                {project?.title || project?.name || "Project Name"}
              </h1>
            </div>
            <div className="flex flex-col gap-1 text-[#474545] text-xs mt-4">
              <p className="flex items-center justify-end gap-1">
                <FiMapPin />
                <span>{project?.location || "Location"}</span>
              </p>
              <p>{project?.year || "Year"}</p>
            </div>
            <div className="mt-[46px] flex flex-col gap-6 text-[#474545] text-[10px] uppercase">
              <div>
                <div className="text-[#6E6A6B] mb-1">CLIENT</div>
                <div>{project?.client || "Client Name"}</div>
              </div>
              <div>
                <div className="text-[#6E6A6B] mb-1">PROJECT TEAM</div>
                <div>
                  {project?.projectLeaders + " | "}
                  {project?.project_team || project?.projectTeam || "Team Name"}
                </div>
              </div>
              <div>
                <div className="text-[#6E6A6B] mb-1">COLLABORATORS</div>
                <div>{project?.collaborators || "Collaborator Name"}</div>
              </div>
              <div>
                <div className="text-[#6E6A6B] mb-1">STATUS</div>
                <div>{project?.status || "Status"}</div>
              </div>
              <div>
                <div className="text-[#6E6A6B] mb-1">SIZE (M2/FT2)</div>
                <div>{project?.sizeM2FT2 || "Size"}</div>
              </div>

            </div>
          </div>

          {/* Project Sections */}
          <div className="flex-grow flex-shrink-0 flex items-center gap-6 md:gap-8 w-auto h-full">
            <ProjectSectionDisplay sections={project?.sections} />
          </div>
        </motion.div>
      </div>

      {/* Tablet/Smaller Project Info */}
      <div className="grid grid-cols-2 py-3 leading-[1.4] xl:hidden px-2">
        <div>
          <div className="text-[#7E797A] font-medium text-xs uppercase">
            {project?.category || "RESIDENTIAL"}
          </div>
          <h1 className="text-[#3E3C3C] font-sora font-semibold text-xl m-0">
            {project?.title || project?.name || "Project Name"}
          </h1>
        </div>
        <div className="flex flex-col items-end gap-1 text-[#474545] text-xs text-right">
          <p className="flex items-center justify-end gap-1">
            <FiMapPin />
            <span>{project?.location || "Location"}</span>
          </p>
          <p>{project?.year || "Year"}</p>
        </div>
        <div className="status text-[#474545] text-[10px] uppercase leading-normal mt-4">
          <div className="text-[#6E6A6B]">STATUS</div>
          <div>{project?.status || "Status"}</div>
        </div>
      </div>

      {/* Hide scrollbar */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default HorizontalScrollComponent;
