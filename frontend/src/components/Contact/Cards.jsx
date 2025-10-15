import Card from "./Card";
import studioLocations from "../../Data/studioLocations.json";
import { motion } from "framer-motion";

// Animation settings for the whole list of cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Each card pops in one after another for a friendly effect
    },
  },
};

const Cards = () => {
  return (
    <motion.section
      className="flex flex-col gap-4 md:gap-8 lg:gap-12 px-4 md:px-8 lg:px-20"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Each Card below shows a studio location with all the details you need! */}
      {studioLocations.map((location) => (
        <Card key={location.id} data={location} />
      ))}
    </motion.section>
  );
};

export default Cards;
