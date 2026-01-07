import React, { useEffect, useRef, useState } from "react";
import aboutApi from "../../services/aboutapi";

// Icons mapped by index (or you can later move this to backend)
import BuildingImg from "../../assets/Icons/Buildings.png";
import ClipboardImg from "../../assets/Icons/Blueprint.png";
import CertificateImg from "../../assets/Icons/Certificate.png";

const ICONS = [BuildingImg, ClipboardImg, CertificateImg];

/* ---------------- COUNT UP ---------------- */

const CountUp = ({ end, duration = 2000, format = false }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  const formatNumber = (num) => {
    if (num >= 1_000_000)
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1_000)
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
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

  return <span ref={ref}>{format ? formatNumber(count) : count}</span>;
};

/* ---------------- ABOUT METRICS ---------------- */

const AboutMetrics = () => {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await aboutApi.getAboutPage();
        setMetrics(Array.isArray(data?.metrics) ? data.metrics : []);
      } catch (err) {
        console.error("Failed to load metrics:", err);
      }
    };

    fetchMetrics();
  }, []);

  if (!metrics.length) return null;

  return (
    <section className="bg-[#f2efee] px-4 md:px-8 xl:px-20 py-12 md:py-16">
      <div className="mx-auto flex flex-wrap gap-4 md:gap-5 xl:gap-6 justify-center">
        {metrics.slice(0, 3).map((metric, index) => (
          <div
            key={metric.id}
            className="shadow-[0_16px_32px_#3E3C3C1A] flex-1 basis-full md:basis-0"
          >
            <div className="h-[160px] md:h-[256px] xl:h-[205px]
              bg-[#F9F8F7] rounded-md shadow-[0_4px_2px_#3e3c3c0a]
              py-5 px-6 md:py-16 md:px-8 flex items-center"
            >
              <div className="flex flex-col xl:flex-row xl:items-center items-start gap-6 md:gap-8">
                <img
                  src={ICONS[index]}
                  alt={metric.label}
                  className="h-12 w-12 xl:h-16 xl:w-16 object-contain"
                />

                <div>
                  <h3 className="font-sora font-semibold
                    text-xl md:text-[28px] xl:text-[40px]
                    leading-[1.1em] tracking-[-0.01em] text-[#474545]"
                  >
                    <CountUp
                      end={metric.value}
                      format={metric.value >= 1000}
                    />

                    <span className="ml-1 text-[9px] md:text-xs xl:text-lg font-semibold">
                      {metric.suffix || "+"}
                    </span>

                  </h3>

                  <p className="font-inter font-medium
                    text-[8px] xl:text-[12px]
                    uppercase text-[#6D6D6D]"
                  >
                    {metric.label}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutMetrics;
