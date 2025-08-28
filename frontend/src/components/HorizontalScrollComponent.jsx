import React, { useRef, useState } from "react";
import { FiArrowRight, FiArrowLeft, FiX, FiMapPin } from "react-icons/fi";

const HorizontalScrollComponent = ({ onClose }) => {
  const scrollContainerRef = useRef(null);
  const scrollByAmount = 600;

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  const onDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.pageX || e.touches[0].pageX);
    setScrollLeftStart(scrollContainerRef.current.scrollLeft);
  };

  const onDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX || e.touches[0].pageX;
    const walk = startX - x;
    scrollContainerRef.current.scrollLeft = scrollLeftStart + walk;
  };

  const onDragEnd = () => {
    setIsDragging(false);
  };

  const handleNavigateToProjects = () => {
    window.location.href = "/projects";
  };

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({
      left: -scrollByAmount,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({
      left: scrollByAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full font-inter min-h-[520px] overflow-hidden">

      <div className="absolute top-5 left-5 flex items-center gap-3 z-20">
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-full border border-gray-400 w-10 h-10 bg-white cursor-pointer text-gray-500 flex items-center justify-center"
        >
          <FiX size={20} />
        </button>

        <button
          onClick={handleNavigateToProjects}
          className="group relative flex items-center justify-start rounded-full border border-gray-400 bg-white hover:bg-[#2B2624B2] hover:text-[#faf6f3] text-gray-400 w-10 hover:w-44 h-10 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute left-0 top-0 w-10 h-10 flex items-center justify-center">
            <FiArrowRight
              size={20}
              className="transition-all duration-100 group-hover:mr-2"
            />
          </div>
          <span className="opacity-0 group-hover:opacity-100 text-xs font-semibold duration-300 whitespace-nowrap group-hover:text-[#faf6f3] pl-10 pr-4">
            VIEW ENTIRE PROJECT
          </span>
        </button>
      </div>


      <button
        onClick={scrollLeft}
        className="absolute z-10 left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-500 p-2 rounded-full shadow-md transition hidden md:flex"
      >
        <FiArrowLeft size={20} />
      </button>


      <button
        onClick={scrollRight}
        className="absolute z-10 right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-500 p-2 rounded-full shadow-md transition hidden md:flex"
      >
        <FiArrowRight size={20} />
      </button>


      <div
        ref={scrollContainerRef}
        className={`flex overflow-x-auto h-full px-4 md:px-[60px] py-[30px] box-border scroll-smooth hide-scrollbar ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={onDragStart}
        onTouchMove={onDragMove}
        onTouchEnd={onDragEnd}
        onTouchCancel={onDragEnd}
      >

        <div className="min-w-[200px] pl-5 flex flex-col justify-center font-medium text-right items-end">
          <div className="flex flex-col gap-2">
            <div className="text-sm text-gray-500 font-semibold">RESIDENTIAL</div>
            <h1 className="font-bold text-2xl m-0">Shanti Villa</h1>
            <div className="text-sm text-gray-500 flex flex-col gap-1">
              <p className="flex items-center justify-end gap-1">
                <FiMapPin />
                <span>Dimapur, Nagaland</span>
              </p>
              <p>2015</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 text-xs text-gray-700">
            <div>
              <div className="text-gray-500 font-semibold">CLIENT</div>
              <div>CLIENT NAME, CLIENT NAME</div>
            </div>
            <div>
              <div className="text-gray-500 font-semibold mt-3">PROJECT TEAM</div>
              <div>MANAGER, ARCHITECT, TEAM</div>
            </div>
            <div>
              <div className="text-gray-500 font-semibold mt-3">COLLABORATORS</div>
              <div>COLLABORATOR NAME</div>
            </div>
            <div>
              <div className="text-gray-500 font-semibold mt-3">STATUS</div>
              <div>COMPLETED</div>
            </div>
          </div>
        </div>


        <div className="w-[800px] h-[450px] ml-8 rounded-[20px] overflow-hidden flex-shrink-0 flex justify-center items-center">
          <img
            src="https://picsum.dev/800/450"
            alt="Shanti Villa"
            className="h-full w-auto object-cover rounded-[20px]"
          />
        </div>


        <div className="min-w-[300px] max-w-[450px] pl-[20px] text-sm text-gray-700 leading-relaxed overflow-y-auto max-h-[450px] mt-7 font-normal">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris suscipit ac amet vel sapien...
          </p>
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
