import React, { useRef } from 'react';

const Architecture = () => {
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
        {/* Big heading for the Architecture section – sets the tone for the page. */}
        <h1 className="font-sora text-5xl lg:text-6xl font-bold mb-8">ARCHITECTURE</h1>

        {/* Introductory paragraphs: these explain VDS's approach to architecture in a personal, story-driven way. */}
        <div className="text-[#3E3C3C] max-w-5xl text-base lg:text-lg leading-relaxed space-y-6 mb-16">
          <p>
            At VDS, architecture is an evolving dialogue—between people and place, ideas and constraints, light and material. Our work spans public institutions, cultural spaces, hospitality, and private residences—each shaped with a sensitivity to context and a commitment to design that endures.
          </p>
          <p>
            Working in the diverse and often complex ecosystem of the northeast, we engage with everything from high-end villas to government projects. Some require navigating bureaucracy, cost-conscious detailing, or low-maintenance material strategies. Others demand immersive environments, refined finishes, and bespoke spatial experiences. What binds them all is our belief in clarity over complexity, expression without excess, and a design language that is bold, sensitive, and lighting-centric.
          </p>
          <p>
            Over time, we’ve earned the trust of stakeholders and clients—not through spectacle, but through thoughtfulness. Whether it’s a cultural corridor or a compact office, we design spaces that perform with purpose and feel quietly powerful.
          </p>
        </div>

        {/* This is the fun part: a horizontally scrollable set of project cards, with left/right buttons for easy navigation. */}
        <div className="relative">
          {/* These buttons let users scroll through the cards – like flipping through a portfolio. */}
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

          {/* The actual row of cards. Each card is a project preview with an image, category, title, and a short description. */}
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
                  alt="Architecture"
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

export default Architecture;
