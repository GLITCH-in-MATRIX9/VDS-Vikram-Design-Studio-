import React from 'react';
import { LuSend } from "react-icons/lu";

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
          'Content-Type': 'application/json',
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
    <section className='my-3 md:my-6 lg:my-12 flex flex-col justify-center align-middle gap-6 md:gap-12 '>
      <h2 className='font-sora font-semibold uppercase text-center text-base md:text-[28px] lg:text-[40px] text-[#343A3F]'>
        Your next project starts here
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-[90%] md:w-[542px] lg:w-[616px] mx-auto text-xs md:text-sm lg:text-base"
      >
        <div className="grid grid-cols-2 gap-y-4 lg:gap-y-8 gap-x-3 md:gap-x-4">
          <div>
          <input
            type="text"
            name="firstName"
            onChange={handleChange}
            value={formData.firstName}
            placeholder="First Name*"
            required
            className="block w-full px-4 py-3 bg-white outline-[0.5px] rounded-2xl focus:outline-1 outline-[#7E797A] focus:outline-[#474545]"
          />

        </div>
        <div >
          <input
            type="text"
            name="lastName"
            onChange={handleChange}
            value={formData.lastName}
            placeholder="Last Name"
            className="block w-full px-4 py-3 bg-white  outline-[0.5px] rounded-2xl focus:outline-1 outline-[#7E797A] focus:outline-[#474545]"
          />
            </div>
          </div>
          
          <div>
            <input
              type="text"
              name="company"
              onChange={handleChange}
              value={formData.company}
              placeholder="Company"
              className="w-full px-4 py-3  outline-[0.5px] rounded-2xl focus:outline-1 outline-[#7E797A] focus:outline-[#474545]"
            />
          </div>
          <div>
            <input
              type="tel"
              name="mobileNumber"
              onChange={handleChange}
              value={formData.mobileNumber}
              placeholder="Mobile Number *"
              required
              className="w-full px-4 py-3  outline-[0.5px] rounded-2xl focus:outline-1 outline-[#7E797A] focus:outline-[#474545]"
            />
          </div>
          <div>
            <input
              type="email"
              name="emailAddress"
              onChange={handleChange}
              value={formData.emailAddress}
              placeholder="Email Address *"
              required
              className="w-full px-4 py-3 outline-[0.5px] rounded-2xl focus:outline-1 outline-[#7E797A] focus:outline-[#474545]"
            />
          </div>
          <div>
            <textarea
              name="message"
              onChange={handleChange}
              value={formData.message}
              placeholder="Message *"
              rows="6"
              requiredb
              className="w-full px-4 py-3 o outline-[0.5px] rounded-2xl focus:outline-1 outline-[#7E797A] focus:outline-[#474545] "
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <input
                id="captcha"
                type="checkbox"
                onChange={handleChange}
                name="captcha"
                checked={formData.captcha}
                className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500"
              />
              <label htmlFor="captcha" className="ml-2 text-sm text-gray-600">
                Captcha
              </label>
            </div>
            <button 
              type="submit"
              className='flex items-center gap-1 bg-[#7E797A] font-medium rounded-lg px-4 py-2 uppercase text-white text-xs md:text-sm lg:text-base'>
                Send Message 
                {<LuSend />}
            </button>
          </div>
        </form>
    </section>
  );
};

export default Form;

