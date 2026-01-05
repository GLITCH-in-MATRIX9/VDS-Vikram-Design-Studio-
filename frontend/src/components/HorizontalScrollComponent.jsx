import React, { useRef, useState, useEffect } from "react";
import { FiMapPin } from "react-icons/fi";
import { motion, useMotionValue, animate } from "framer-motion";
import SectionDivider from "./SectionDivider";
import ProjectSectionDisplay from "./ProjectSectionDisplay";
import LeftArrowIcon from "../assets/Icons/LeftArrowIcon.svg";
import RightArrowIcon from "../assets/Icons/RightArrowIcon.svg";
import CloseIcon from "../assets/Icons/CloseIcon.svg";
import "leaflet/dist/leaflet.css";
import ProjectMap from "../components/ProjectsMap";

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");
    const handleChange = (e) => setIsDesktop(e.matches);
    handleChange(mediaQuery);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  return isDesktop;
};

const HorizontalScrollComponent = ({ onClose, project }) => {
  const x = useMotionValue(0);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [maxScroll, setMaxScroll] = useState(0);
  const isDesktop = useIsDesktop();
  const scrollAmount = isDesktop ? 960 : 320;

  const [isMapHovered, setIsMapHovered] = useState(false);

  const [transition] = useState({
    duration: 1.4,
    ease: [0.76, 0, 0.24, 1],
  });

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
    if (isDesktop) animate(x, Math.min(x.get() + scrollAmount, 0), transition);
    else {
      const container = containerRef.current;
      if (!container) return;
      const newScrollLeft = container.scrollLeft - scrollAmount;
      animate(container.scrollLeft, Math.max(newScrollLeft, 0), {
        ...transition,
        onUpdate: (latest) => {
          container.scrollLeft = latest;
        },
      });
    }
  };

  const scrollRight = () => {
    if (isDesktop)
      animate(x, Math.max(x.get() - scrollAmount, maxScroll), transition);
    else {
      const container = containerRef.current;
      if (!container) return;
      const newScrollLeft = container.scrollLeft + scrollAmount;
      const nativeMaxScroll = container.scrollWidth - container.clientWidth;
      animate(container.scrollLeft, Math.min(newScrollLeft, nativeMaxScroll), {
        ...transition,
        onUpdate: (latest) => {
          container.scrollLeft = latest;
        },
      });
    }
  };

  const shouldDrag = isDesktop && !isMapHovered;

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
        className="absolute z-20 left-2 top-[110px] md:top-[225px] xl:top-1/2 -translate-y-1/2 bg-[#2B262433] w-8 h-8 cursor-pointer rounded-full shadow-md flex items-center justify-center"
      >
        <img src={LeftArrowIcon} alt="Scroll Left" className="w-4" />
      </button>
      <button
        onClick={scrollRight}
        className="absolute z-20 right-2 top-[110px] md:top-[225px] xl:top-1/2 -translate-y-1/2 bg-[#2B262433] w-8 h-8 cursor-pointer rounded-full shadow-md flex items-center justify-center"
      >
        <img src={RightArrowIcon} alt="Scroll Right" className="w-4" />
      </button>

      {/* Scrollable Area */}
      <div
        ref={containerRef}
        className={`flex h-full ${
          shouldDrag
            ? "overflow-x-hidden cursor-grab"
            : "overflow-x-hidden cursor-default"
        } ${!isDesktop && "overflow-x-scroll hide-scrollbar"}`}
      >
        <motion.div
          ref={contentRef}
          style={isDesktop ? { x } : {}}
          drag={shouldDrag ? "x" : false}
          dragConstraints={shouldDrag ? { left: maxScroll, right: 0 } : false}
          dragElastic={0}
          className="flex flex-nowrap h-full items-center"
        >
          {/* Project Info (Desktop - Sidebar) */}
          <div className="hidden xl:flex w-[240px] flex-col ml-12 pr-3 text-right items-end flex-shrink-0">
            <div className="flex flex-col gap-1 text-xs sm:text-sm">
              <div className="text-[#6D6D6D] font-medium uppercase">
                {project?.category || "RESIDENTIAL"}
              </div>
              <h1 className="text-[#373737] font-sora font-semibold text-xl m-0">
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
            <div className="mt-[15px] flex flex-col gap-4 text-[#474545] text-[10px] uppercase">
              <div>
                <div className="text-[#5D5D5D] mb-1">CLIENT</div>
                <div>{project?.client || "Client Name"}</div>
              </div>
              <div>
                <div className="text-[#5D5D5D] mb-1">PROJECT TEAM</div>
                <div>
                  {project?.projectLeaders +
                    (project?.projectLeaders?.length > 0 ? " | " : "")}
                  {project?.project_team || project?.projectTeam || "Team Name"}
                </div>
              </div>
              <div>
                <div className="text-[#5D5D5D] mb-1">COLLABORATORS</div>
                <div>{project?.collaborators || "Collaborator Name"}</div>
              </div>
              <div>
                <div className="text-[#5D5D5D] mb-1">STATUS</div>
                <div>{project?.status || "Status"}</div>
              </div>
              <div>
                <div className="text-[#5D5D5D] mb-1">SIZE (M²/FT²)</div>
                <div>{project?.sizeM2FT2 || "Size"}</div>
              </div>
            </div>
          </div>

          {/* Project Sections */}
          <div className="flex-grow flex-shrink-0 flex items-center gap-6 md:gap-8 w-auto h-full">
            <ProjectSectionDisplay sections={project?.sections} />
          </div>

          {/* Mobile/Tablet Info Panel (Scrollable Panel) */}
          {!isDesktop && (
            <div className="flex w-[240px] flex-col pr-3 items-center leading-[1.4em] flex-shrink-0 text-[10px]">
              <div className=" flex flex-col gap-3 text-[#474545] text-[10px] uppercase">
                <div>
                  <div className="text-[#5D5D5D] mb-1">CLIENT</div>
                  <div>{project?.client || "Client Name"}</div>
                </div>
                <div>
                  <div className="text-[#5D5D5D] mb-1">PROJECT TEAM</div>
                  <div>
                    {project?.projectLeaders +
                      (project?.projectLeaders?.length > 0 ? " | " : "")}
                    {project?.project_team ||
                      project?.projectTeam ||
                      "Team Name"}
                  </div>
                </div>
                <div>
                  <div className="text-[#5D5D5D] mb-1">COLLABORATORS</div>
                  <div>{project?.collaborators || "Collaborator Name"}</div>
                </div>
              </div>
            </div>
          )}
          {/* End Mobile/Tablet Info Panel */}

          {/* ✅ Modular Map Component */}
          <ProjectMap
            project={project}
            onMouseEnter={() => setIsMapHovered(true)}
            onMouseLeave={() => setIsMapHovered(false)}
            className="mr-12"
          />
        </motion.div>
      </div>

      {/* Mobile / Tablet Info (Fixed Footer Summary) */}
      <div className="grid grid-cols-2 py-3 leading-[1.4] xl:hidden">
        <div className="px-2 mb-3 col-span-1">
          <div className="text-[#6D6D6D] font-medium text-xs uppercase">
            {project?.category || "RESIDENTIAL"}
          </div>
          <h1 className="text-[#373737] font-sora font-semibold text-xl m-0">
            {project?.title || project?.name || "Project Name"}
          </h1>
        </div>
        <div className="flex flex-col items-end gap-1 text-[#474545] text-xs text-right px-2 col-span-1">
          <p className="flex items-center justify-end gap-1">
            <FiMapPin />
            <span>{project?.location || "Location"}</span>
          </p>
          <p>{project?.year || "Year"}</p>
        </div>
        <div className="col-span-2">
          <SectionDivider />
        </div>

        {/* 1. STATUS Block (Left Column) */}
        <div className="status text-[#474545] text-[10px] uppercase leading-normal mt-2 px-2 col-span-1">
          <div className="text-[#5D5D5D]">STATUS</div>
          <div>{project?.status || "Status"}</div>
        </div>

        {/* 2. SIZE Block (Right Column) */}
        <div className="size text-[#474545] text-[10px] uppercase leading-normal mt-2 px-2 text-right col-span-1">
          <div className="text-[#5D5D5D]">SIZE (M²/FT²)</div>
          <div>{project?.sizeM2FT2 || "Size"}</div>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default HorizontalScrollComponent;
