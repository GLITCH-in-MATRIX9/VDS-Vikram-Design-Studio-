import React, { useRef } from 'react';

const Interior = () => {
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
        {/* Section heading: introduces the Interior part of our work. */}
        <h1 className="font-sora text-5xl lg:text-6xl font-bold mb-8">INTERIOR</h1>

        {/* Brief description of our approach to interior design and what sets it apart. */}
        <div className="text-[#3E3C3C] max-w-5xl text-base lg:text-lg leading-relaxed space-y-6 mb-16">
          <p>
            Interior design at VDS is guided by precision, emotion, and experience. From refined villas and boutique hotels to institutional interiors, we approach every project with a deep understanding of how space feels from within. Our interiors are both functional and poetic—where circulation flows naturally, materiality is expressive, and lighting is treated as atmosphere, not afterthought.          </p>
          <p>
            We work with carefully chosen palettes and long-lasting finishes, equally attentive to high-end detailing and practical durability. Whether we’re designing a compact government office or a luxury guest suite, we believe the inside of a space should reveal its essence. Every line, surface, and shadow contribute to a coherent, human-centric environment that’s built to be used, remembered, and returned to.          </p>

        </div>

        {/* Horizontally scrollable cards highlight selected interior projects or themes. */}
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

          {/* Container for the interior project cards. Each card features an image, category, title, and description. */}
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
                  src={`https://picsum.photos/seed/${item}/448/240`}
                  alt="Interior"
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

export default Interior;
