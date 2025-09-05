import React from 'react';

const AboutHeading = () => {
  return (
    <section className="bg-[#f3efee] px-4 sm:px-6 lg:px-20 py-10 sm:py-16">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="font-sora text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-[#3E3C3C] mb-8 sm:mb-16 text-left">ABOUT</h1>
      </div>

      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">


        {/* This is the main left section: it holds the big heading and the two-column story about VDS. */}
        <div className="lg:col-span-2">


          <h2 className="font-sora text-base sm:text-lg font-semibold text-[#7E797A] mb-4 sm:mb-8">
            Vikram Design Studio (VDS) didn’t start with blueprints –<br />
            it began with trust.
          </h2>

          {/* Here comes the heart of the About page: two columns, each telling a different part of the VDS journey. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-[#474545] leading-relaxed text-sm sm:text-base">
            <div className="font-inter space-y-3 sm:space-y-4 text-sm font-normal">
              <p>
                In 2009, after years of working with one of Guwahati’s leading architectural firms,
                Vikram B Sihrof and Pooza Agarwal – both qualified interior designers – founded VDS
                as a turnkey design practice. With a deep understanding of space, materials, and
                execution, they shaped a firm that prioritized design integrity and client relationships.
              </p>
              <p>
                The early years were grounded in interiors. But as the work grew, so did the vision.
                VDS began to take on private architectural and landscape commissions – quietly expanding
                its scope in its town. With the support of trusted collaborators, architects, and consultants,
                the studio evolved into a full-spectrum design practice.
              </p>
              <p>
                Between 2019–2020, the studio stepped into uncharted territory with its first government project –
                the Batadrava Than Redevelopment in Nagaon, Assam. A culturally significant site and a project
                of substantial scale, it became a turning point. What followed was a momentum shift: a series
                of public commissions, larger institutional projects, and deeper collaborations across the northeast.
              </p>
            </div>

            <div className="font-inter space-y-3 sm:space-y-4 text-sm font-normal">
              <p>
                Amid this growth, a new energy entered the picture. Namman Sihrof, an architect and trained lighting
                designer, had long been connected to the studio through his father, Vikraman. In 2023, he officially
                stepped into leadership – bringing with him a sharper eye, a stronger design voice, and a background
                in visual arts. Namman’s decision to invest in VDS over a more conventional path marked the beginning
                of a new chapter: bold, forward-thinking, and unapologetically ambitious.
              </p>
              <p>
                We’ll be honest – we’ve never won awards. For a long time, VDS worked like any typical mid-sized firm:
                consistent, dependable, and under the radar. But we’re no longer content with staying there.
              </p>
              <p>
                Today, we’re building a studio that reflects where we come from – but isn’t limited by it. One that
                believes good design isn’t just about beauty – it’s about responsibility, context, and possibility.
                The journey started quietly. But where we’re going is anything but.
              </p>
            </div>
          </div>
        </div>

        {/* On the right, we could show a team photo, a project image, or just a placeholder for now. */}
        {/* Image placeholder: visible only on large screens (desktop) */}
        <div className="hidden lg:flex w-full h-full justify-center items-start mt-6 lg:mt-0">
          <div className="w-full h-full bg-gray-300 rounded-md" />
        </div>

      </div>
    </section>
  );
};

export default AboutHeading;
