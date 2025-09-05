import React, { useEffect, useRef, useState } from 'react';
import { FaBuilding, FaRegClipboard, FaCertificate, FaTrophy } from 'react-icons/fa';

// This CountUp component animates numbers as they come into view, making the stats feel more dynamic and alive.
const CountUp = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;

          let start = 0;
          const increment = end / (duration / 16);

          const counter = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(counter);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}+</span>;
};

const AboutMetrics = () => {
  return (
    <section className="bg-[#f3efee] px-6 lg:px-20 py-16">
      <div className="max-w-screen-xl mx-auto flex flex-wrap gap-2.5 justify-center">

        {/* How many projects have we completed? Here's the first stat card. */}
        <div className="w-[411px] h-[205px] bg-white rounded-md shadow-sm py-12 px-6 flex items-center justify-between opacity-100">
          <div className="flex items-center gap-4">
            <FaBuilding className="h-10 w-10 text-gray-500" />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                <CountUp end={200} />
              </h3>
              <p className="text-xs tracking-wide text-gray-600 uppercase">Number of Projects Completed</p>
            </div>
          </div>
        </div>

        {/* This one shows the total square footage we've designed so far. */}
        <div className="w-[411px] h-[205px] bg-white rounded-md shadow-sm py-12 px-6 flex items-center justify-between opacity-100">
          <div className="flex items-center gap-4">
            <FaRegClipboard className="h-10 w-10 text-gray-500" />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                <CountUp end={20000} /> <span className="text-lg font-semibold">sq.ft.</span>
              </h3>
              <p className="text-xs tracking-wide text-gray-600 uppercase">Total Square Foot Area Designed Till Date</p>
            </div>
          </div>
        </div>

        {/* And finally, a card for our years of experience in the industry. */}
        <div className="w-[411px] h-[205px] bg-white rounded-md shadow-sm py-12 px-6 flex items-center justify-between opacity-100">
          <div className="flex items-center gap-4">
            <FaCertificate className="h-10 w-10 text-gray-500" />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                <CountUp end={25} />
              </h3>
              <p className="text-xs tracking-wide text-gray-600 uppercase">Years in the Industry</p>
            </div>
          </div>
          <FaTrophy className="h-6 w-6 text-gray-400" />
        </div>

      </div>
    </section>
  );
};

export default AboutMetrics;
