import React, { useEffect, useRef, useState } from 'react';
// Import your images from assets
import BuildingImg from "../../assets/Icons/Buildings.png";
import ClipboardImg from "../../assets/Icons/Blueprint.png";
import CertificateImg from "../../assets/Icons/Certificate.png";
import TrophyImg from "../../assets/Icons/Trophy.png";

// CountUp component with formatter
const CountUp = ({ end, duration = 2000, format = false }) => {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const started = useRef(false);

  // format large numbers into k / M style
  const formatNumber = (num) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
    return num;
  };

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

  return <span ref={ref}>{format ? formatNumber(count) : count}+</span>;
};

const AboutMetrics = () => {
  return (
    <section className="bg-[#f3efee] px-6 lg:px-20 py-16">
      <div className="max-w-screen-xl mx-auto flex flex-wrap gap-2.5 justify-center">

        {/* Projects Completed */}
        <div className="w-[411px] h-[205px] bg-white rounded-md shadow-[0_2px_10px_rgba(0,0,0,0.05)] py-12 px-6 flex items-center justify-between opacity-100">
          <div className="flex items-center gap-4">
            <img src={BuildingImg} alt="Projects" className="h-16 w-16 object-contain" />
            <div>
              <h3 className="font-sora font-semibold text-[40px] leading-[48px] tracking-[-0.01em] text-[#474545]">
                <CountUp end={200} /> 
              </h3>
              <p className="font-inter font-medium text-[12px] leading-[100%] tracking-[0] uppercase text-[#7E797A]">
                Number of Projects Completed
              </p>
            </div>
          </div>
        </div>

        {/* Total Square Footage */}
        <div className="w-[411px] h-[205px] bg-white rounded-md shadow-[0_2px_10px_rgba(0,0,0,0.05)] py-12 px-6 flex items-center justify-between opacity-100">
          <div className="flex items-center gap-4">
            <img src={ClipboardImg} alt="Square Footage" className="h-16 w-16 object-contain" />
            <div>
              <h3 className="font-sora font-semibold text-[40px] leading-[48px] tracking-[-0.01em] text-[#474545]">
                <CountUp end={20000} format /> <span className="text-lg font-semibold">sq.ft.</span>
              </h3>
              <p className="font-inter font-medium text-[12px] leading-[100%] tracking-[0] uppercase text-[#7E797A]">
                Total Square Foot Area Designed Till Date
              </p>
            </div>
          </div>
        </div>

        {/* Years in Industry */}
        <div className="w-[411px] h-[205px] bg-white rounded-md shadow-[0_2px_10px_rgba(0,0,0,0.05)] py-12 px-6 flex items-center justify-between opacity-100">
          <div className="flex items-center gap-4">
            <img src={CertificateImg} alt="Experience" className="h-16 w-16 object-contain" />
            <div>
              <h3 className="font-sora font-semibold text-[40px] leading-[48px] tracking-[-0.01em] text-[#474545]">
                <CountUp end={25} />
              </h3>
              <p className="font-inter font-medium text-[12px] leading-[100%] tracking-[0] uppercase text-[#7E797A]">
                Years in the Industry
              </p>
            </div>
          </div>
          <img src={TrophyImg} alt="Trophy" className="h-8 w-8 object-contain opacity-70" />
        </div>

      </div>
    </section>
  );
};

export default AboutMetrics;
