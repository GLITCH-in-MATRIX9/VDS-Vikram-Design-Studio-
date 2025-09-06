import React from 'react';

const images = [
  'https://picsum.photos/id/1015/340/280',
  'https://picsum.photos/id/1016/340/280',
  'https://picsum.photos/id/1018/340/280',
];

const MarqueeImages = () => {
  return (
    <div className="flex flex-col gap-8 overflow-hidden bg-[#f7f6f4]">
      {/* Row 1 */}
      <div className="relative overflow-hidden whitespace-nowrap">
        <div className="inline-flex animate-marquee">
          {[...images, ...images].map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Marquee Image ${idx + 1}`}
              className="w-[340px] h-[280px] object-cover rounded-md mr-6 flex-shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Row 2 */}
      <div className="relative overflow-hidden whitespace-nowrap">
        <div className="inline-flex animate-marquee-reverse">
          {[...images, ...images].map((src, idx) => (
            <img
              key={idx + 100}
              src={src}
              alt={`Marquee Image ${idx + 4}`}
              className="w-[340px] h-[280px] object-cover rounded-md mr-6 flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarqueeImages;
