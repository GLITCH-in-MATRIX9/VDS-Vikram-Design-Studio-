import React, { useRef } from 'react';

const Collaborators = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-20 py-10 sm:py-16 bg-[#f3efee] text-[#3E3C3C]">
      <div className="max-w-screen-xl mx-auto">
        {/* Section heading */}
        <h1
          className="font-sora font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-[40px] leading-tight tracking-[-0.01em] mb-6 sm:mb-8 text-left"
          style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600 }}
        >
          OUR COLLABORATORS
        </h1>

        {/* Introductory paragraph */}
        <div
          className="max-w-4xl space-y-4 sm:space-y-6 mb-10 sm:mb-16 text-sm sm:text-base"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            lineHeight: '140%',
            letterSpacing: '0',
          }}
        >
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elidolor mattis sit phasellus mollis
            sit aliquam sit nullam neques. Lorem ipsum dolor sit amet consectetur adipiscing
            elidolor mattis sit phasellus mollis sit aliquam sit nullam neques. Lorem ipsum dolor sit
            amet consectetur adipiscing elidolor mattis sit phasellus mollis sit aliquam sit nullam
            neques. Lorem ipsum dolor sit amet consectetur adipiscing elidolor mattis sit phasellus
            mollis sit aliquam sit nullam neques. Lorem ipsum dolor sit amet.
          </p>
        </div>

        {/* Scrollable cards */}
        <div className="relative">
          {/* Navigation buttons */}
          <button
            onClick={() => scroll('left')}
            className="hidden sm:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#f3efee] shadow-md rounded-full p-2"
          >
            ←
          </button>
          <button
            onClick={() => scroll('right')}
            className="hidden sm:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#f3efee] shadow-md rounded-full p-2"
          >
            →
          </button>

          {/* Cards */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 sm:gap-6 py-4 scroll-smooth no-scrollbar"
          >
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="w-[260px] sm:w-[340px] md:w-[400px] lg:w-[448px] h-[320px] sm:h-[370px] md:h-[400px] lg:h-[425px] bg-[#f3efee] border rounded-[16px] p-4 sm:p-8 flex-shrink-0 shadow-sm"
              >
                <img
                  src={`https://picsum.photos/seed/${item}/448/240`}
                  alt="Collaborator"
                  className="w-full h-[140px] sm:h-[180px] md:h-[210px] lg:h-[240px] object-cover rounded-lg mb-4"
                />
                <div className="text-xs text-gray-400 uppercase mb-1">Category</div>
                <h3 className="font-sora font-bold text-base sm:text-lg mb-2">Title</h3>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    lineHeight: '140%',
                    letterSpacing: '0',
                  }}
                  className="text-xs sm:text-sm text-gray-500"
                >
                  Egestas elit dui scelerisque ut eu purus aliquam vitae habitasse.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collaborators;
