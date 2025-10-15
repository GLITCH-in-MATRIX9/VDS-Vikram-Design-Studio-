import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // This controls the delay between each child animation
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const AboutHeading = () => {
  return (
    <section className="bg-[#f2efee] px-4 md:px-8 lg:px-20 py-8 md:py-12 lg:py-20">
      <div className="  mx-auto">
        <motion.h1
          className="font-sora font-semibold text-[40px] md:text-[56px] lg:text-[72px] leading-[48px] md:leading-[64px] lg:leading-[80px] tracking-[-0.01em] text-[#3E3C3C] 
            mb-6 lg:mb-16 uppercase"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          ABOUT
        </motion.h1>
      </div>

      <motion.div
        className="  mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Main left section: big heading and two-column story */}
        <motion.div className="lg:col-span-2">
          <motion.h2
            className="font-sora hidden lg:block text-xl font-semibold text-[#6D6D6D] mb-8"
            variants={itemVariants}
          >
            Vikram Design Studio (VDS) didn’t start with blueprints –<br />
            it began with trust.
          </motion.h2>

          {/* Two columns for the story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 font-inter text-[#474545] leading-[1.4em] text-xs md:text-sm lg:text-base">
            <motion.div
              className="space-y-3 sm:space-y-4"
              variants={containerVariants}
            >
              <motion.p variants={itemVariants}>
                In 2009, after years of working with one of Guwahati’s leading
                architectural firms, Vikramm B Shroff and Pooza Agarwal - both
                qualified interior designers - founded VDS as a turnkey design
                practice. With a deep understanding of space, materials, and
                execution, they shaped a firm that prioritized design integrity
                and client relationships.
              </motion.p>
              <motion.p variants={itemVariants}>
                The early years were grounded in interiors. But as the work
                grew, so did the vision. VDS began to take on private
                architectural and landscape commissions - quietly expanding its
                scope and its team. With the support of trusted collaborators,
                architects, and consultants, the studio evolved into a
                full-spectrum design practice.
              </motion.p>
              <motion.p variants={itemVariants}>
                Between 2019–2020, the studio stepped into uncharted territory
                with its first government project - the Batadrava Than
                Redevelopment in Nagaon, Assam. A culturally significant site
                and a project of substantial scale, it became a turning point.
                What followed was a momentum shift: a series of public
                commissions, larger institutional projects, and deeper
                collaborations across the northeast.
              </motion.p>
            </motion.div>

            <motion.div
              className="space-y-3 sm:space-y-4"
              variants={containerVariants}
            >
              <motion.p variants={itemVariants}>
                Amid this growth, a new energy entered the picture. Namman
                Shroff, an architect and trained lighting designer, had long
                been connected to the studio through his father, Vikramm. In
                2023, he officially stepped into leadership - bringing with him
                a sharper eye, a stronger design voice, and a background in
                visual arts. Namman’s decision to invest in VDS over a more
                conventional path marked the beginning of a new chapter: bold,
                forward-thinking, and unapologetically ambitious.
              </motion.p>
              <motion.p variants={itemVariants}>
                We’ll be honest - we’ve never won awards. For a long time, VDS
                worked like any typical mid-sized firm: consistent, dependable,
                and under the radar. But we’re no longer content with staying
                there.
              </motion.p>
              <motion.p variants={itemVariants}>
                Today, we’re building a studio that reflects where we come from
                - but isn’t limited by it. One that believes good design isn’t
                just about beauty - it’s about responsibility, context, and
                possibility. The journey started quietly. But where we’re going
                is anything but.
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

        {/* Image placeholder: visible only on large screens (desktop) */}
        <motion.div
          className="hidden lg:block w-full h-full lg:ml-2"
          variants={itemVariants}
        >
          <div className="w-full h-full object-cover rounded-xl">
            <img
              src="https://res.cloudinary.com/ddrsuvea0/image/upload/v1758057665/yqbxzbkijtuvtde5nilu.jpg"
              alt="Description of the image"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutHeading;
