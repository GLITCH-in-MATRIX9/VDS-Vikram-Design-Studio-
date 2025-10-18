import React, { useEffect, useRef, useState } from "react";
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
    if (num >= 1_000_000)
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
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
    <section className="bg-[#f2efee] px-4 md:px-8 xl:px-20 py-12 md:py-16">
      <div className="  mx-auto flex flex-wrap gap-4 md:gap-5 xl:gap-6 justify-center">
        {/* Projects Completed */}
        <div className="shadow-[0_16px_32px_#3E3C3C1A] flex-1 basis-full md:basis-0">
          <div className="h-[160px] md:h-[256px] xl:h-[205px] bg-[#F9F8F7] rounded-md shadow-[0_4px_2px_#3e3c3c0a] py-5 px-6 md:py-16 md:px-8 flex items-center justify-between">
            <div className="flex flex-col xl:flex-row xl:items-center items-start gap-6 md:gap-8">
              <img
                src={BuildingImg}
                alt="Projects"
                className="h-12 w-12 xl:h-16 xl:w-16 object-contain"
              />
              <div>
                <h3 className="font-sora font-semibold text-xl md:text-[28px] xl:text-[40px] leading-[1.1em] md:leading-[36px] xl:leading-[48px] tracking-[-0.01em] text-[#474545]">
                  <CountUp end={60} />
                </h3>
                <p className="font-inter font-medium text-[8px] xl:text-[12px] leading-[100%] tracking-[0] uppercase text-[#6D6D6D]">
                  Number of Projects Completed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Square Footage */}
        <div className="shadow-[0_16px_32px_#3E3C3C1A] flex-1">
          <div className="h-[160px] md:h-[256px] xl:h-[205px] bg-[#F9F8F7] rounded-md shadow-[0_4px_2px_#3e3c3c0a] py-5 px-6 md:py-16 md:px-8 flex items-center justify-between">
            <div className="flex flex-col xl:flex-row xl:items-center items-start gap-6 md:gap-8">
              <img
                src={ClipboardImg}
                alt="Square Footage"
                className="h-12 w-12 xl:h-16 xl:w-16 object-contain"
              />
              <div>
                <h3 className="font-sora font-semibold text-xl md:text-[28px] xl:text-[40px] leading-[1.1em] md:leading-[36px] xl:leading-[48px] tracking-[-0.01em] text-[#474545]">
                  <CountUp end={100000} format />{" "}
                  <span className="text-[9px] md:text-xs xl:text-lg font-semibold">
                    sq.ft.
                  </span>
                </h3>
                <p className="font-inter font-medium text-[8px] xl:text-[12px] leading-[100%] tracking-[0] uppercase text-[#6D6D6D]">
                  Total Square Foot Area Designed Till Date
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Years in Industry */}
        <div className="shadow-[0_16px_32px_#3E3C3C1A] flex-1">
          <div className="h-[160px] md:h-[256px] xl:h-[205px] bg-[#F9F8F7] rounded-md shadow-[0_4px_2px_#3e3c3c0a] py-5 px-6 md:py-16 md:px-8 flex items-center justify-between">
            <div className="flex flex-col xl:flex-row xl:items-center items-start gap-6 md:gap-8">
              <img
                src={CertificateImg}
                alt="Experience"
                className="h-12 w-12 xl:h-16 xl:w-16 object-contain"
              />
              <div>
                <h3 className="font-sora font-semibold text-xl md:text-[28px] xl:text-[40px] leading-[1.1em] md:leading-[36px] xl:leading-[48px] tracking-[-0.01em] text-[#474545]">
                  <CountUp end={25} />
                </h3>
                <p className="font-inter font-medium text-[8px] xl:text-[12px] leading-[100%] tracking-[0] uppercase text-[#6D6D6D]">
                  Years in the Industry
                </p>
              </div>
            </div>
            {/* <img src={TrophyImg} alt="Trophy" className="h-8 w-8 object-contain opacity-70" /> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMetrics;
