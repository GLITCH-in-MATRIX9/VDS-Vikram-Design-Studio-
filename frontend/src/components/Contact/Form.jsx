import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuSend } from "react-icons/lu";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Form = () => {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    company: "",
    mobileNumber: "",
    emailAddress: "",
    message: "",
  });

  const [isFilled, setIsFilled] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Enable submit only when required fields are filled
  React.useEffect(() => {
    setIsFilled(
      formData.firstName &&
      formData.mobileNumber &&
      formData.emailAddress &&
      formData.message
    );
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFilled || loading) return;

    const API_ENDPOINT = `${import.meta.env.VITE_API_URL}/api/contact`;

    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Safe JSON parse
      let result = {};
      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (response.ok) {
        setShowSuccess(true);

        setFormData({
          firstName: "",
          lastName: "",
          company: "",
          mobileNumber: "",
          emailAddress: "",
          message: "",
        });

        setTimeout(() => setShowSuccess(false), 4000);
      } else {
        alert(result.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* SUCCESS POPUP */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-0 left-0 w-full z-50 bg-green-600 text-white text-center py-3 text-sm md:text-base font-medium shadow-lg"
          >
            Message sent successfully! We’ll get back to you soon.
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section
        className="my-3 md:my-6 xl:my-12 flex flex-col justify-center align-middle gap-6 md:gap-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          className="font-sora font-semibold uppercase text-center text-base md:text-[28px] xl:text-[40px] text-[#343A3F]"
          variants={itemVariants}
        >
          Your next project starts here
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 xl:gap-6 space-y-6 w-[90%] md:w-[542px] xl:w-[616px] mx-auto text-xs md:text-sm xl:text-base font-inter text-[#474545]"
          variants={containerVariants}
        >
          {/* First + Last Name */}
          <div className="grid grid-cols-2 gap-x-3 md:gap-x-4">
            <motion.div variants={itemVariants}>
              <input
                type="text"
                name="firstName"
                onChange={handleChange}
                value={formData.firstName}
                placeholder="First Name *"
                required
                className="block w-full px-4 py-3 bg-[#F9F8F7] rounded-2xl outline-[#7E797A] focus:outline-[#474545]"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <input
                type="text"
                name="lastName"
                onChange={handleChange}
                value={formData.lastName}
                placeholder="Last Name"
                className="block w-full px-4 py-3 bg-[#F9F8F7] rounded-2xl outline-[#7E797A] focus:outline-[#474545]"
              />
            </motion.div>
          </div>

          {/* Company */}
          <motion.div variants={itemVariants}>
            <input
              type="text"
              name="company"
              onChange={handleChange}
              value={formData.company}
              placeholder="Company"
              className="w-full px-4 py-3 bg-[#F9F8F7] rounded-2xl outline-[#7E797A] focus:outline-[#474545]"
            />
          </motion.div>

          {/* Mobile */}
          <motion.div variants={itemVariants}>
            <input
              type="tel"
              name="mobileNumber"
              onChange={handleChange}
              value={formData.mobileNumber}
              placeholder="Mobile Number *"
              required
              className="w-full px-4 py-3 bg-[#F9F8F7] rounded-2xl outline-[#7E797A] focus:outline-[#474545]"
            />
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants}>
            <input
              type="email"
              name="emailAddress"
              onChange={handleChange}
              value={formData.emailAddress}
              placeholder="Email Address *"
              required
              className="w-full px-4 py-3 bg-[#F9F8F7] rounded-2xl outline-[#7E797A] focus:outline-[#474545]"
            />
          </motion.div>

          {/* Message */}
          <motion.div variants={itemVariants}>
            <textarea
              name="message"
              onChange={handleChange}
              value={formData.message}
              placeholder="Message *"
              rows="6"
              required
              className="w-full px-4 py-3 bg-[#F9F8F7] rounded-2xl outline-[#7E797A] focus:outline-[#474545]"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div className="flex justify-center" variants={itemVariants}>
            <button
              type="submit"
              disabled={!isFilled || loading}
              className={`flex items-center gap-1 justify-center ${
                isFilled && !loading
                  ? "bg-[#474545]"
                  : "bg-[#7E797A] cursor-not-allowed"
              } font-medium rounded-lg px-4 py-2 uppercase text-white text-xs md:text-sm xl:text-base`}
            >
              {loading ? "Sending..." : "Send Message"}
              <LuSend />
            </button>
          </motion.div>
        </motion.form>
      </motion.section>
    </>
  );
};

export default Form;
