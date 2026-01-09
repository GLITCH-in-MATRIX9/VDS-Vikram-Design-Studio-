import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import teamApi from "../../services/teamapi";

const TeamMembers = () => {
  const [teamData, setTeamData] = useState([]);
  const [openIndices, setOpenIndices] = useState(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        const data = await teamApi.getTeamPage();
        // data shape: { heading: {...}, members: [...] }
        setTeamData(data.members || []);
      } catch (err) {
        console.error("Failed to load team page:", err);
      }
    };

    load();
  }, []);

  const toggleIndex = (index) => {
    const newSet = new Set(openIndices);
    if (newSet.has(index)) newSet.delete(index);
    else newSet.add(index);
    setOpenIndices(newSet);
  };

  return (
    <div className="bg-[#f2efee] min-h-screen px-4 md:px-8 xl:px-20 py-12 md:py-20">
      <motion.h1
        className="font-sora font-semibold text-[28px] md:text-[40px] xl:text-[56px] leading-[36px] md:leading-[48px] xl:leading-[64px] tracking-[-0.01em] text-[#3E3C3C] mb-6 xl:mb-8 text-left"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        TEAM MEMBERS
      </motion.h1>

      {/* TeamMembers only renders member list; Heading and Marquee are separate components */}

      {/* Header Row */}
      <div className="grid grid-cols-2 md:grid-cols-[0.7fr_1fr_0.7fr] gap-6 font-sora font-medium text-[8px] md:text-sm text-[#474545] py-3 border-b border-[#C1C7CD] uppercase">
        <span>Team Member</span>
        <span>Role</span>
      </div>

      <div className="w-full font-sora text-[#3E3C3C]">
        {/* Render featured members first */}
        {teamData
          .filter((m) => !!m.featured)
          .map((member, idx) => {
            const name = member.name || "";
            const position = member.position || member.designation || "";
            const img = member.photo || member.img || "";
            const description = member.description || member.bio || "";
            const key =
              member.id !== undefined ? `id_${member.id}` : `fidx_${idx}`;

            return (
              <React.Fragment key={key}>
                <motion.div
                  layout
                  className="grid grid-cols-2 md:grid-cols-[0.7fr_1fr_0.7fr] gap-6 text-[10px] md:text-sm py-4 items-start"
                >
                  <span>{name}</span>
                  <div className="flex justify-between items-center w-[140px] md:w-[266px]">
                    <span>{position}</span>
                    <button
                      onClick={() => toggleIndex(key)}
                      className="focus:outline-none cursor-pointer"
                    >
                      {openIndices.has(key) ? (
                        <Minus size={14} strokeWidth={1.5} className="" />
                      ) : (
                        <Plus
                          size={14}
                          strokeWidth={1.5}
                          className="cursor-pointer"
                        />
                      )}
                    </button>
                  </div>

                  {openIndices.has(key) && (
                    <div className="col-span-full border-b border-[#B0B0B0] "></div>
                  )}
                </motion.div>

                <AnimatePresence>
                  {openIndices.has(key) && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 35,
                      }}
                      className="overflow-hidden col-span-full grid grid-cols-[max-content_1fr] md:grid-cols-[0.7fr_1fr_0.7fr] gap-8 text-sm text-[#5a5a5a] px-0 py-8"
                    >
                      <div className="flex justify-center md:justify-start">
                        {img ? (
                          <img
                            src={img}
                            alt={name}
                            className="w-[80px] h-[107px] md:w-[200px] md:h-[250px] object-cover rounded-sm opacity-100"
                          />
                        ) : (
                          <div className="w-[80px] h-[107px] md:w-[200px] md:h-[250px] bg-gray-100" />
                        )}
                      </div>

                      <div className="flex flex-col max-w-[200px] md:max-w-xl justify-start gap-2 text-[8px] md:text-xs xl:text-sm">
                        <p>{description}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </React.Fragment>
            );
          })}

        {/* Divider between featured and other members */}
        {teamData.some((m) => !!m.featured) &&
          teamData.some((m) => !m.featured) && (
            <div className="section-divider w-full my-2 col-span-2">
              <hr className="w-full border-[1px] border-[#EAE2DC]" />
              <hr className="w-full border-[1px] border-[#f8f7f8]" />
            </div>
          )}

        {/* Render non-featured members */}
        {teamData
          .filter((m) => !m.featured)
          .map((member, idx) => {
            const name = member.name || "";
            const position = member.position || member.designation || "";
            const key =
              member.id !== undefined ? `id_${member.id}` : `nidx_${idx}`;

            return (
              <React.Fragment key={key}>
                <motion.div
                  layout
                  className="grid grid-cols-2 md:grid-cols-[0.7fr_1fr_0.7fr] gap-6 text-[10px] md:text-sm py-4 items-start"
                >
                  <span>{name}</span>
                  <span>{position}</span>
                </motion.div>
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
};

export default TeamMembers;
