import React, { useRef } from 'react';

const Planning = () => {
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
    <section className="px-6 lg:px-20 py-16 bg-[#f3efee] text-[#3E3C3C]">
      <div className="max-w-screen-xl mx-auto">
        {/* Section heading: introduces the Planning aspect of our work. */}
        <h1 className="font-sora text-5xl lg:text-6xl font-bold mb-8">PLANNING</h1>

        {/* Brief description of our planning philosophy and approach. */}
        <div className="text-[#3E3C3C] max-w-5xl text-base lg:text-lg leading-relaxed space-y-6 mb-16">
          <p>
            Planning is where vision meets structure. At VDS, we approach planning as a framework for experience—one that considers culture, ecology, infrastructure, and people. Lighting, often overlooked at this scale, becomes a subtle tool for shaping how spaces are used at different times of day.
          </p>
          <p>
            Be it a campus, cultural precinct, or district plan, we design places that evolve over time—physically and atmospherically—while staying rooted in intent. Planning is not just about what goes where, but how people feel as they move through it.
          </p>
        </div>

        {/* Horizontally scrollable cards highlight selected planning projects or themes. */}
        <div className="relative">
          {/* Navigation buttons for scrolling through the project cards. */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#f3efee] shadow-md rounded-full p-2"
          >
            ←
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#f3efee] shadow-md rounded-full p-2"
          >
            →
          </button>

          {/* Container for the planning project cards. Each card features an image, category, title, and description. */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 py-4 scroll-smooth no-scrollbar"
          >
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="w-[448px] h-[425px] bg-[#f3efee] border rounded-[16px] p-8 flex-shrink-0 shadow-sm"
              >
                <img
                  src={`https://picsum.photos/seed/planning${item}/448/240`}
                  alt="Planning"
                  className="w-full h-[240px] object-cover rounded-lg mb-4"
                />
                <div className="text-xs text-gray-400 uppercase mb-1">Category</div>
                <h3 className="font-bold text-lg mb-2">Title</h3>
                <p className="text-sm text-gray-500">
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

export default Planning;
