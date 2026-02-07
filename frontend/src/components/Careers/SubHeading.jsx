import React from "react";

const SubHeadings = () => {
  return (
    <section className="bg-[#f2efee] px-4 md:px-8 xl:px-20 py-8 md:py-12 xl:py-20">
      <p className="font-inter text-[#474545] leading-[1.4em] text-xs md:text-sm xl:text-base max-w-3xl">
        <span className="font-medium text-[#3E3C3C]">
          Don’t see a role that fits you right now?
        </span>{" "}
        If you’d still like to collaborate or explore working with us, feel free
        to write to us at{" "}
        <a
          href="mailto:career@vikramdesignstudio.com"
          className="underline hover:text-black"
        >
          career@vikramdesignstudio.com
        </a>{" "}
        with your profile and portfolio.
      </p>
    </section>
  );
};

export default SubHeadings;
