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
    <section className="px-6 lg:px-20 py-16 bg-[#f3efee] text-[#3E3C3C]">
      <div className="max-w-screen-xl mx-auto">
        {/* Big heading for the Collaborators section – introduces the people and teams we work with. */}
        <h1 className="font-sora text-5xl lg:text-6xl font-bold mb-8">OUR COLLABORATORS</h1>

        {/* A short intro paragraph about our collaborators and what makes these partnerships special. */}
        <div className="text-[#3E3C3C] max-w-5xl text-base lg:text-lg leading-relaxed space-y-6 mb-16">
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elidolor mattis sit phasellus mollis sit aliquam sit nullam neques. Lorem ipsum dolor sit amet consectetur adipiscing elidolor mattis sit phasellus mollis sit aliquam sit nullam neques. Lorem ipsum dolor sit amet consectetur adipiscing elidolor mattis sit phasellus mollis sit aliquam sit nullam neques. Lorem ipsum dolor sit amet consectetur adipiscing elidolor mattis sit phasellus mollis sit aliquam sit nullam neques. Lorem ipsum dolor sit amet
          </p>

        </div>

        {/* Here comes a horizontally scrollable set of collaborator cards, with left/right buttons for easy browsing. */}
        <div className="relative">
          {/* These buttons let users scroll through the collaborator cards – like flipping through a team album. */}
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

          {/* The actual row of collaborator cards. Each card is a preview with an image, category, title, and a short description. */}
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

export default Collaborators;
