import React from 'react';
import { motion } from 'framer-motion';
import { LuSend } from "react-icons/lu";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const Form = () => {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    company: '',
    mobileNumber: '',
    emailAddress: '',
    message: '',
    captcha: false,
  });
  
  const [isFilled, setIsFilled] = React.useState(false);

  React.useEffect(() => {
    setIsFilled(
      formData.firstName !== '' &&
      formData.mobileNumber !== '' &&
      formData.emailAddress !== '' &&
      formData.message !== '' &&
      formData.captcha
    );
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const API_ENDPOINT = 'endpoint goes here';

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Form submitted successfully!');
        alert('Thank you for your message!');
        setFormData({
          firstName: '', lastName: '', company: '', mobileNumber: '',
          emailAddress: '', message: '', captcha: false,
        });
      } else {
        console.error('Form submission failed!');
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred. Please check your connection.');
    }
  };

  return (
    <motion.section
      className='my-3 md:my-6 lg:my-12 flex flex-col justify-center align-middle gap-6 md:gap-12'
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.h2
        className='font-sora font-semibold uppercase text-center text-base md:text-[28px] lg:text-[40px] text-[#343A3F]'
        variants={itemVariants}
      >
        Your next project starts here
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 lg:gap-6 space-y-6 w-[90%] md:w-[542px] lg:w-[616px] mx-auto text-xs md:text-sm lg:text-base font-inter text-[#474545]"
        variants={containerVariants}
      >
        <div className="my-0 grid grid-cols-2 gap-x-3 md:gap-x-4">
          <motion.div variants={itemVariants}>
            <input
              type="text"
              name="firstName"
              onChange={handleChange}
              value={formData.firstName}
              placeholder="First Name *"
              required
              className="block w-full px-4 py-3 bg-[#F9F8F7] outline-[0.5px] rounded-2xl focus:outline-1 outline-[#7E797A] focus:outline-[#474545]"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <input
              type="text"
              name="lastName"
              onChange={handleChange}
              value={formData.lastName}
              placeholder="Last Name"
              className="block w-full px-4 py-3 bg-[#F9F8F7] outline-[0.5px] rounded-2xl focus:outline-1 outline-[#7E797A] focus:outline-[#474545]"
            />
          </motion.div>
        </div>

        <motion.div className='my-0' variants={itemVariants}>
          <input
            type="text"
            name="company"
            onChange={handleChange}
            value={formData.company}
            placeholder="Company"
            className="w-full px-4 py-3 bg-[#F9F8F7] outline-[0.5px] rounded-2xl focus:outline-1 outline-[#7E797A] focus:outline-[#474545]"
          />
        </motion.div>

        <motion.div className='my-0' variants={itemVariants}>
          <input
            type="tel"
            name="mobileNumber"
            onChange={handleChange}
            value={formData.mobileNumber}
            placeholder="Mobile Number *"
            required
            className="w-full px-4 py-3 bg-[#F9F8F7] outline-[0.5px] rounded-2xl focus:outline-1 outline-[#7E797A] focus:outline-[#474545]"
          />
        </motion.div>

        <motion.div className='my-0' variants={itemVariants}>
          <input
            type="email"
            name="emailAddress"
            onChange={handleChange}
            value={formData.emailAddress}
            placeholder="Email Address *"
            required
            className="w-full px-4 py-3 bg-[#F9F8F7] outline-[0.5px] rounded-2xl focus:outline-1 outline-[#7E797A] focus:outline-[#474545]"
          />
        </motion.div>

        <motion.div className='my-0' variants={itemVariants}>
          <textarea
            name="message"
            onChange={handleChange}
            value={formData.message}
            placeholder="Message *"
            rows="6"
            required
            className="w-full px-4 py-3 bg-[#F9F8F7] outline-[0.5px] rounded-2xl focus:outline-1 outline-[#7E797A] focus:outline-[#474545]"
          ></textarea>
        </motion.div>

        <motion.div className="flex flex-row items-start justify-between gap-4 my-0" variants={itemVariants}>
          <div className="flex items-center my-0">
            <input
              id="captcha"
              type="checkbox"
              onChange={handleChange}
              name="captcha"
              checked={formData.captcha}
              className="w-4 h-4 bg-[#474545] text-[#474545] rounded-0"
            />
            <label htmlFor="captcha" className="ml-2 text-sm text-gray-600">
              Captcha
            </label>
          </div>
          <button
            type="submit"
            className={`flex items-center gap-1 ${isFilled ? "bg-[#474545]" : "bg-[#7E797A] cursor-not-allowed"} font-medium rounded-lg px-4 py-2 uppercase text-white text-xs md:text-sm lg:text-base`}>
            Send Message
            <LuSend />
          </button>
        </motion.div>
      </motion.form>
    </motion.section>
  );
};

export default Form;