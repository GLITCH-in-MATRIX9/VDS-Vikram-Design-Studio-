import React from 'react';

const members = [
  {
    id: 1,
    name: 'Vikramm B Shroff',
    role: 'Co-Founder',
    image: 'https://picsum.photos/id/1011/369/372',
  },
  {
    id: 2,
    name: 'Vikramm B Shroff',
    role: 'Co-Founder',
    image: 'https://picsum.photos/id/1012/369/372',
  },
  {
    id: 3,
    name: 'Vikramm B Shroff',
    role: 'Co-Founder',
    image: 'https://picsum.photos/id/1013/369/372',
  },
];

const CoreMembers = () => {
  return (
    <div className="bg-[#f7f6f4] py-12 px-6 md:px-12 lg:px-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">CORE MEMBERS</h2>
      <div className="flex justify-between gap-6 max-w-[1200px] mx-auto">
        {members.map(({ id, name, role, image }) => (
          <div
            key={id}
            className="relative w-[369px] h-[372px] rounded-[16px] overflow-hidden shadow-lg cursor-pointer group opacity-100"
          >
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
            {/* Improved Gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-[130px] bg-gradient-to-t from-black/90 via-black/70 to-transparent z-10"></div>

            {/* Text content container */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pt-[233px] pb-8 flex flex-col justify-between text-white z-20">
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm">{role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoreMembers;
