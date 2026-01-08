import React, { useEffect, useState } from "react";
import Card from "./Card";
import { motion } from "framer-motion";
import contactLocationApi from "../../services/contactLocationApi";

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
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await contactLocationApi.getContactContent();
        // API returns { contacts: [...] }
        if (mounted) setLocations(res.contacts || []);
      } catch (err) {
        console.error("Failed to load contact locations", err);
        if (mounted) setError("Failed to load contacts");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    // render 3 skeleton cards while the real data (and maps) load
    return (
      <div className="px-4 md:px-8 xl:px-20 space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="max-w-[1920px] flex justify-between flex-col md:flex-row gap-4 md:gap-8 px-3 md:px-6 xl:px-12 py-4 md:py-8 xl:py-12 border-[0.5px] border-[#BEBBBC] text-[#3E3C3C] md:border-1 rounded-lg md:rounded-2xl animate-pulse"
          >
            <div className="flex-1 space-y-4">
              <div className="h-6 bg-gray-300 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="h-[162px] md:h-[250px] xl:h-[304px] w-full md:w-[345px] xl:w-[420px] bg-gray-300 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="px-4 md:px-8 xl:px-20 text-red-500">{error}</div>;
  }

  if (!locations.length) {
    return (
      <div className="px-4 md:px-8 xl:px-20">
        No contact locations available.
      </div>
    );
  }

  return (
    <motion.section
      className="flex flex-col gap-4 md:gap-8 xl:gap-12 px-4 md:px-8 xl:px-20"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {locations.map((location) => (
        <Card key={location.id || location.city} data={location} />
      ))}
    </motion.section>
  );
};

export default Cards;
