import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const teamData = [
  {
    name: "Vikramm B Shroff",
    designation: "Co-founder",
    img: "/vikramm.jpeg",
    description:
      "Vikramm B Shroff brings over two decades of experience in interior design, construction management, and turnkey execution. Before founding Vikram Design Studio in 2006, he worked with one of Guwahati's leading architectural firms, where he developed a strong grounding in site coordination, technical detailing, and client relations. Vikramm leads the studio's execution arm and oversees its institutional and government projects, bringing pragmatism, precision, and problem-solving to every scale of work. His ability to translate complex design ambitions into buildable realities has made him a trusted name among collaborators and clients across Assam and the northeast. With a keen sense of responsibility and humility, he continues to shape VDS's growth from the ground up."
  },
  {
    name: "Pooza Agarwal",
    designation: "Co-founder",
    img: "/pooja.jpeg",
    description:
      "Pooza Agarwal co-founded Vikram Design Studio with a vision to create spaces that are not just functional, but emotionally resonant. Trained in interior design and deeply intuitive in her approach, she brings a refined design sensibility to every project—be it residential, hospitality, or institutional. Pooza's strength lies in her understanding of spatial flow, material balance, and understated elegance. Over the years, she has played a pivotal role in shaping VDS's design identity—grounded, context-aware, and people-centric. Her attention to detail and commitment to quality have made her a go-to for clients seeking warmth, clarity, and timeless design. She continues to mentor the studio's younger designers while quietly driving its creative ethos forward."
  },
  {
    name: "Namman Shroff",
    designation: "Partner & Design Lead",
    img: "/namman.png",
    description: (
      <>
        Namman Shroff is an architect, lighting designer, and visual artist, currently serving as the Partner and Design Lead at Vikram Design Studio. With a background in architecture and a specialization in lighting design, he brings a unique blend of spatial precision and sensorial storytelling to the studio’s evolving portfolio.<br /><br />
        Associated with VDS since 2019 and formally taking on the leadership mantle in 2023, Namman has played a pivotal role in repositioning the firm—from a regionally respected practice to a design studio with national and global aspirations. His approach is rooted in clarity, restraint, and atmosphere—where light becomes a primary material and every space is crafted for both function and position.
        His portfolio spans public institutions, government campuses, hospitality spaces, and high-end residences—each defined by its balance of boldness and feeling.<br /><br />
        As Design Lead, Namman continues to guide VDS into a new chapter: one that is quietly ambitious, design-driven, and uncompromising in vision.
      </>
    )
  },
  { name: "Ajit Deka", designation: "Office Assistant" },
  { name: "Ayush Biswakarma", designation: "Data Operator" },
  { name: "Biplob Rabha", designation: "Jr. Architect" },
  { name: "Debashruti Giri", designation: "Architect" },
  { name: "Devid Barman", designation: "Admin Assistant" },
  { name: "Indrajit Choudhary", designation: "Accountant" },
  { name: "Kriti Ghiya", designation: "Jr. Interior Designer" },
  { name: "Luku Biswakarma", designation: "Site Supervisor" },
  { name: "Paran Basumatary", designation: "Quantity Surveyor" },
  { name: "Prasanta Kalita", designation: "Senior Architect" },
  { name: "Rajnish Rabha", designation: "Visualiser" },
  { name: "Sandip Agarwal", designation: "Interior Designer" },
  { name: "Saurav Sharma", designation: "Jr. Site Supervisor" },
  { name: "Shibhu Biswakarma", designation: "Site Supervisor" },
  { name: "Shubham Singh", designation: "Civil Engineer" },
  { name: "Suprit Das", designation: "Jr. Architect" },
  { name: "Tanushree Bandyopadhyay", designation: "Jr. Architect" },
  { name: "Vibek Poddar", designation: "Interior Designer" },
];

const TeamMembers = () => {
  const [openIndices, setOpenIndices] = useState(new Set());

  const toggleIndex = (index) => {
    const newSet = new Set(openIndices);
    if (newSet.has(index)) newSet.delete(index);
    else newSet.add(index);
    setOpenIndices(newSet);
  };

  return (
    <div className="bg-[#f2efee] min-h-screen px-4 md:px-8 xl:px-20 py-12 md:py-20">
      <motion.h1
        className="font-sora font-semibold text-[28px] md:text-[40px] xl:text-[56px] leading-[36px] md:leading-[48px] xl:leading-[64px] tracking-[-0.01em] text-[#3E3C3C] mb-12 xl:mb-20 text-left"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        TEAM MEMBERS
      </motion.h1>

      {/* Header Row */}
      <div className="grid grid-cols-2 md:grid-cols-[0.7fr_1fr_0.7fr] gap-6 font-sora font-medium text-sm text-[#474545] py-3 border-b border-[#C1C7CD] uppercase">
        <span>Team Member</span>
        <span>Role</span>
      </div>

      <div className="w-full font-sora text-[#3E3C3C]">
        {teamData.map(({ name, designation, img, description }, index) => (
          <React.Fragment key={index}>
            {/* Row with name and role */}
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-[0.7fr_1fr_0.7fr] gap-6 text-sm py-4 items-start"
            >
              <span>{name}</span>
              {index < 3 ? (
                <div className="flex items-center gap-2">
                  <span>{designation}</span>
                  <button
                    onClick={() => toggleIndex(index)}
                    className="focus:outline-none"
                  >
                    {openIndices.has(index) ? (
                      <Minus size={14} strokeWidth={1.5} />
                    ) : (
                      <Plus size={14} strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              ) : (
                <span>{designation}</span>
              )}

              {openIndices.has(index) && index < 3 && (
                <div className="col-span-full border-b border-gray-600 "></div>
              )}
            </motion.div>

            {/* Accordion for first 3 members */}
            <AnimatePresence>
              {openIndices.has(index) && index < 3 && (
                <motion.div
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 35 }}
                  className="overflow-hidden col-span-full grid grid-cols-2 md:grid-cols-[0.7fr_1fr_0.7fr] gap-4 text-sm text-[#5a5a5a] pl-0 pr-0 pb-12 pt-12"
                >
                  {/* Left column: Image */}
                  <div className="flex justify-center md:justify-start">
                    <img
                      src={img}
                      alt={name}
                      className="w-[200px] h-[250px] object-cover rounded-sm opacity-100"
                    />
                  </div>

                  {/* Right column: Role + Paragraph */}
                  <div className="flex flex-col justify-start gap-2">
                    <p>{description}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider after first 3 */}
            {index === 2 && (
              <div className="section-divider w-full my-2 col-span-2">
                <hr className="w-full border-[1px] border-[#EAE2DC]" />
                <hr className="w-full border-[1px] border-[#f8f7f8]" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TeamMembers;
