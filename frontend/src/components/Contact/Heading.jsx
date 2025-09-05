import React from 'react';

const Heading = () => {
  return (
    <section className="px-6 py-12 md:px-12 lg:px-24 bg-white">
      {/* Main Heading */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-10">
        GET IN TOUCH
      </h1>

      {/* Info Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Address</h3>
          <p className="text-md font-bold text-gray-900">Assam</p>
          <p className="text-sm text-gray-600 mt-1">
            Egestas elit dui scelerisque ut eu purus aliquam vitae habitasse.
          </p>
        </div>

        {/* Card 2 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Address</h3>
          <p className="text-md font-bold text-gray-900">Place 2</p>
          <p className="text-sm text-gray-600 mt-1">
            Egestas elit dui scelerisque ut eu purus aliquam vitae habitasse.
          </p>
        </div>

        {/* Card 3 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Social</h3>
          <p className="text-md font-bold text-gray-900">Title</p>
          <p className="text-sm text-gray-600 mt-1">
            Egestas elit dui scelerisque ut eu purus aliquam vitae habitasse.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Heading;
