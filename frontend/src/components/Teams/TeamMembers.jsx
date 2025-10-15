import React from "react";
import { motion } from "framer-motion";

const teamData = [
  { name: "Vikramm B Shroff", designation: "Co-founder" },
  { name: "Pooza Agarwal", designation: "Co-founder" },
  { name: "Namman Shroff", designation: "Partner & Design Lead" },
  { name: "Ajit Deka", designation: "Office Assistant" },
  { name: "Ayush Biswakarma", designation: "Data Operator" },
  { name: "Biplob Rabha", designation: "Jr. Architect" },
  { name: "Devid Barman", designation: "Admin Assistant" },
  { name: "Indrajit Choudhary", designation: "Accountant" },
  { name: "Kriti Ghiya", designation: "Jr. Interior Designer" },
  { name: "Luku Biswakarma", designation: "Site Supervisor" },
  { name: "Suprit Das", designation: "Jr. Architect" },
  { name: "Paran Basumatary", designation: "Quantity Surveyor" },
  { name: "Prasanta Kalita", designation: "Senior Architect" },
  { name: "Rajnish Rabha", designation: "Visualiser" },
  { name: "Sandip Agarwal", designation: "Interior Designer" },
  { name: "Saurav Sharma", designation: "Jr. Site Supervisor" },
  { name: "Shibhu Biswakarma", designation: "Site Supervisor" },
  { name: "Sunil Sharma", designation: "Civil Engineer" },
  { name: "Tanisha Sengupta", designation: "Architect" },
  { name: "Vibek Poddar", designation: "Interior Designer" },
  { name: "Vishal Bhattacharjee", designation: "Jr. Architect" },
];

// Animation variants for staggered effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Staggers the animation for each row
    },
  },
};

// Animation variants for each item
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const TeamMembers = () => {
  return (
    <div className="bg-[#f2efee] min-h-screen px-4 md:px-8 lg:px-20 z py-12 md:py-20">
      <motion.h1
        className="font-sora font-semibold text-[28px] md:text-[40px] lg:text-[56px] leading-[36px] md:leading-[48px] lg:leading-[64px] tracking-[-0.01em] text-[#3E3C3C] mb-12 lg:mb-20"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        TEAM MEMBERS
      </motion.h1>

      <table className="w-full border-collapse font-sora text-[#3E3C3C]">
        <thead>
          <motion.tr
            className="border-b border-[#C1C7CD] font-medium text-xs text-[#474545] text-left uppercase"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <th className="w-[45%] py-4 pl-3 ">Team Member</th>
            <th className="w-[55%] py-4 pl-3">Designation</th>
          </motion.tr>
        </thead>
        <motion.tbody
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {teamData.map(({ name, designation }, index) => (
            <motion.tr
              key={index}
              variants={itemVariants} // Applies item animation to each row
            >
              <td className="p-3 text-sm align-top">{name}</td>
              <td className="p-3 text-sm align-top">{designation}</td>
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
};

export default TeamMembers;
