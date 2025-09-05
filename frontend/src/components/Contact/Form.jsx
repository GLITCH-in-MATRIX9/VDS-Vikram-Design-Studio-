import React from 'react';

const Form = () => {
  return (
    <section className="px-6 py-12 md:px-12 lg:px-24 bg-white">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        ENQUIRY FORM
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form Section */}
        <form className="space-y-6">
          {/* First and Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="Placeholder"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Placeholder"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Repeating Label Fields */}
          {[1, 2, 3].map((_, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label Name
              </label>
              <input
                type="text"
                placeholder="Placeholder"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          {/* Checkbox */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="agree"
              className="mt-1 mr-2 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="agree" className="text-sm text-gray-700">
              Vestibulum faucibus odio vitae arcu auctor lectus.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            BUTTON TEXT
          </button>
        </form>

        {/* Image / Placeholder */}
        <div className="hidden lg:flex items-center justify-center bg-gray-200 rounded-md h-full min-h-[300px]">
          <div className="w-40 h-40 border-2 border-gray-400 border-dashed flex items-center justify-center">
            <span className="text-gray-500">Image</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Form;
