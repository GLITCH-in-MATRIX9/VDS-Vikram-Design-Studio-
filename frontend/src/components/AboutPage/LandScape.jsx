import React, { useRef } from 'react';

const LandScape = () => {
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
        {/* Section heading: introduces the Landscape part of our design practice. */}
        <h1 className="font-sora text-5xl lg:text-6xl font-bold mb-8">LANDSCAPE</h1>

        {/* Brief description of our landscape philosophy and integrated approach. */}
        <div className="text-[#3E3C3C] max-w-5xl text-base lg:text-lg leading-relaxed space-y-6 mb-16">
          <p>
            Our landscape design practice is rooted in context and collaboration. Whether it's a spiritual campus or a private retreat, we work with land, light, and life to shape spaces that feel grounded and alive. We believe landscape is not an afterthought, but an architectural element—framing movement, anchoring built form, and adding rhythm to daily experience.
          </p>
          <p>
            From circulation and contouring to planting palettes and water systems, we pay close attention to how the outdoors perform—ecologically, culturally, and aesthetically. Often working in tandem with our architectural and interior teams, our landscape solutions are integrated, sustainable, and quietly immersive. The goal is not to decorate, but to connect—to soil, to season, to spirit.
          </p>
        </div>

        {/* Horizontally scrollable cards highlight selected landscape projects or themes. */}
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

          {/* Container for the landscape project cards. Each card features an image, category, title, and description. */}
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
                  src={`https://picsum.photos/seed/landscape${item}/448/240`}
                  alt="Landscape"
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

export default LandScape;
