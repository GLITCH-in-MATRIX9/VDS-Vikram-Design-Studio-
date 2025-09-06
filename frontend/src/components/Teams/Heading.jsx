import React from 'react';

const Heading = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 px-8 md:px-12 lg:px-20 py-16 bg-[#f8f6f5] text-[#333333]">
      
      {/* Left Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Heading */}
        <h1 className="font-sora font-semibold text-[72px] leading-[80px] tracking-[-0.01em]">
          TEAM
        </h1>

        {/* Paragraphs */}
        <p className="font-inter font-normal text-[16px] leading-[140%] tracking-[0]">
          Vikram Design Studio is led by a multidisciplinary team of architects, designers, visualizers, and technical
          experts working across diverse project scales. With our roots in Chennai and a growing studio in Kolkata, we
          function as a collaborative, meritocratic grounded in shared values and a design-first approach.
        </p>
        <p className="font-inter font-normal text-[16px] leading-[140%] tracking-[0]">
          While Guwahati remains our operational core, major design decisions are currently driven from our Kolkata
          studio, which will expand into a larger space next year. This dual presence helps us stay regionally rooted while
          scaling outwardly.
        </p>
        <p className="font-inter font-normal text-[16px] leading-[140%] tracking-[0]">
          Our studio values clarity, collaboration, and curiosity. We believe good design emerges from open dialogue,
          contextual awareness, and care for detail. Every member of our team contributes to a collective pursuit of
          quality—across architecture, interiors, landscape, and beyond.
        </p>
      </div>

      {/* Right Content */}
      <div className="flex items-end justify-end text-right">
        <p className="font-sora font-semibold text-[20px] leading-[28px] tracking-[0] text-[#7E797A]">
          As we grow across geographies, we remain committed to designing with humility, precision, and purpose.
        </p>
      </div>
      
    </div>
  );
};

export default Heading;
