import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import aboutApi from "../../services/aboutapi";
import leftArrowImg from "../../assets/Icons/ArrowLeft.png";
import rightArrowImg from "../../assets/Icons/ArrowRight.png";

/* ---------------- ANIMATION VARIANTS ---------------- */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/* ---------------- COMPONENT ---------------- */

const AboutSection = () => {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const scrollRefs = useRef({});

  /* ---------- FETCH FROM BACKEND ---------- */

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const data = await aboutApi.getAboutPage();
        setSections(data?.sections || {});
      } catch (err) {
        console.error("Failed to load About sections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  if (loading) return null;

  const entries = Object.entries(sections);
  if (!entries.length) return null;

  /* ---------------- UI ---------------- */

  return (
    <>
      {entries.map(([key, section]) => {
        if (!section?.heading) return null;

        const scrollAmount = 416;

        const scroll = (direction) => {
          const ref = scrollRefs.current[key];
          if (!ref) return;

          ref.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
          });
        };

        return (
          <section
            key={key}
            className="px-4 md:px-8 xl:px-20 py-12 md:py-20 bg-[#F2EFEE]"
          >
            <div className="flex flex-col gap-12 max-w-screen-xl mx-auto">
              {/* ---------- HEADING (UNCHANGED) ---------- */}
              <motion.h1
                className="font-sora font-semibold text-[#3E3C3C]
                  text-[28px] md:text-[40px]
                  leading-tight tracking-[-0.01em] uppercase"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
              >
                {section.heading}
              </motion.h1>

              {/* ---------- PARAGRAPHS (UNCHANGED) ---------- */}
              {Array.isArray(section.paragraphs) &&
                section.paragraphs.length > 0 && (
                  <motion.div
                    className="font-inter leading-[1.4em] max-w-4xl
                      space-y-4 sm:space-y-6
                      text-xs md:text-sm xl:text-base text-[#474545]"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                  >
                    {section.paragraphs.map((p) => (
                      <motion.p key={p.id} variants={itemVariants}>
                        {p.text}
                      </motion.p>
                    ))}
                  </motion.div>
                )}

              {/* ---------- CAROUSEL ---------- */}
              {Array.isArray(section.carousel_cards) &&
                section.carousel_cards.length > 0 && (
                  <motion.div
                    className="relative"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                  >
                    {/* Arrows */}
                    <button
                      onClick={() => scroll("left")}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2"
                    >
                      <img src={leftArrowImg} alt="" />
                    </button>

                    <button
                      onClick={() => scroll("right")}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2"
                    >
                      <img src={rightArrowImg} alt="" />
                    </button>

                    {/* Scroll container */}
                    <div
                      ref={(el) => (scrollRefs.current[key] = el)}
                      className="flex overflow-x-auto gap-4 sm:gap-6 py-4
                        scroll-smooth no-scrollbar items-center"
                    >
                      {section.carousel_cards.map((card) => (
                        <motion.div
                          key={card.id}
                          className="flex flex-col gap-4 flex-shrink-0"
                          variants={itemVariants}
                        >
                          {card.img_src ? (
                            <>
                              {/* IMAGE CARD (UNCHANGED SIZES) */}
                              <img
                                src={card.img_src}
                                alt={card.project_name || ""}
                                className="w-[250px] xl:w-[400px]
                                  h-[140px] xl:h-[225px]
                                  rounded-2xl object-cover object-center
                                  bg-[#D1D1D1]"
                                loading="lazy"
                              />

                              {(card.project_name ||
                                card.project_location) && (
                                <p className="text-[6px] md:text-[8px]
                                  leading-[1em] uppercase text-[#6D6D6D]">
                                  {card.project_name}
                                  {card.project_location &&
                                    ` – ${card.project_location}`}
                                </p>
                              )}
                            </>
                          ) : (
                            /* TEXT CARD (UNCHANGED) */
                            <p
                              className="text-[#6D6D6D]
                                leading-[140%]
                                w-2xs md:w-[400px]
                                whitespace-pre-wrap
                                text-xs md:text-sm xl:text-base"
                            >
                              {card.text}
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
            </div>
          </section>
        );
      })}
    </>
  );
};

export default AboutSection;
