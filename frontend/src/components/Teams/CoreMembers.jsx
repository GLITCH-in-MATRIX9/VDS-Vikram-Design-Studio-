import React from 'react';
import { motion } from 'framer-motion';
import vikrammImg from '../../assets/Team/vikramm.jpeg';
import poojaImg from '../../assets/Team/pooja.jpeg';
import nammanImg from '../../assets/Team/namman.png';

const members = [
  {
    id: 1,
    name: 'Vikramm B Shroff ',
    role: 'Founder & Principal Architect',
    description: `Vikramm B Shroff brings over two decades of experience in interior design, construction 
management, and turnkey execution. Before founding Vikram Design Studio in 2006, he 
worked with one of Guwahati’s leading architectural firms, where he developed a strong 
grounding in site coordination, technical detailing, and client relations. Vikramm leads 
the studio’s execution arm and oversees its institutional and government projects, 
bringing pragmatism, precision, and problem-solving to every scale of work. His ability to 
translate complex design ambitions into buildable realities has made him a trusted name 
among collaborators and clients across Assam and the northeast. With a keen sense of 
responsibility and humility, he continues to shape VDS’s growth from the ground up.`,
    image: vikrammImg,
  },
  {
    id: 2,
    name: 'Pooza Agarwal ',
    role: 'Co-Founder ',
    description: `Pooza Agarwal co-founded Vikram Design Studio with a vision to create spaces that are 
not just functional, but emotionally resonant. Trained in interior design and deeply 
intuitive in her approach, she brings a refined design sensibility to every project—be it 
residential, hospitality, or institutional. Pooza’s strength lies in her understanding of 
spatial flow, material balance, and understated elegance. Over the years, she has played a 
pivotal role in shaping VDS’s design identity—grounded, context-aware, and people-
centric. Her attention to detail and commitment to quality have made her a go-to for 
clients seeking warmth, clarity, and timeless design. She continues to mentor the studio’s 
younger designers while quietly driving its creative ethos forward. `,
    image: poojaImg,
  },
  {
    id: 3,
    name: 'Namman Shroff',
    role: 'Partner & Design Lead ',
    description: `Namman Shroff is an architect, lighting designer, and visual artist, currently serving as the 
Partner and Design Lead at Vikram Design Studio. With a background in architecture and 
a specialization in lighting design, he brings a unique blend of spatial precision and 
sensorial storytelling to the studio’s evolving portfolio. 
Associated with VDS since 2019 and formally taking on the leadership mantle in 2023, 
Namman has played a pivotal role in repositioning the firm—from a regionally respected 
practice to a design studio with national and global aspirations. His approach is rooted in 
clarity, restraint, and atmosphere—where light becomes a primary material and every 
space is crafted for both function and feeling. 
His portfolio spans public institutions, government campuses, hospitality spaces, and 
high-end residences—each defined by its balance of boldness and sensitivity. As Design 
Lead, Namman continues to guide VDS into a new chapter: one that is quietly ambitious, 
design-driven, and uncompromising in vision. `,
    image: nammanImg,
  },
];

// Define variants for the parent container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Delay between each child animation
    },
  },
};

// Define variants for each individual card
const cardVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

const CoreMembers = () => {
  return (
    <div className="bg-[#f7f6f4] py-12 px-6 md:px-12 lg:px-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">CORE MEMBERS</h2>
      <motion.div
        className="flex flex-wrap justify-center gap-6 max-w-[1200px] mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible" // Triggers the animation when the container is in view
        viewport={{ once: true }} // Ensures the animation runs only once
      >
        {members.map(({ id, name, role, description, image }) => (
          <motion.div
            key={id}
            className="relative w-[369px] h-[372px] rounded-[16px] overflow-hidden shadow-lg cursor-pointer group transform transition-transform duration-300 hover:scale-105"
            variants={cardVariants} // Applies the card animation variants
            whileHover={{ scale: 1.05 }}
          >
            {/* Image with dim effect */}
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition duration-500 group-hover:brightness-60"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent opacity-50 group-hover:opacity-90 transition-opacity duration-500 z-10"></div>

            {/* Text content */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 flex flex-col justify-end z-20">
              <h3 className="font-semibold text-lg text-white">{name}</h3>
              <p className="text-sm text-gray-200">{role}</p>

              {/* Hidden description revealed on hover */}
              <p className="text-xs mt-2 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-80 transition-all duration-500 ease-in-out text-gray-300 overflow-hidden">
                {description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CoreMembers;