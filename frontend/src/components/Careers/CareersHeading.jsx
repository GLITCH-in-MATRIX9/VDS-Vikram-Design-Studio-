import React from "react";

const Heading = () => {
  return (
    <section className="bg-[#f2efee] px-4 md:px-8 xl:px-20 py-8 md:py-12 xl:py-20">
      <div className="mx-auto">
        {/* MAIN TITLE */}
        <h1
          className="font-sora font-semibold text-[40px] md:text-[56px] xl:text-[72px]
          leading-[48px] md:leading-[64px] xl:leading-[80px]
          tracking-[-0.01em] text-[#3E3C3C] mb-6 xl:mb-12 uppercase"
        >
          CAREERS
        </h1>

        <p className="font-inter text-[#474545] leading-[1.4em] text-xs md:text-sm xl:text-base max-w-3xl">
          We’re always looking for curious, committed people to grow with us.
          <br />
          Our studio thrives on teamwork, open exchange of ideas, and a shared responsibility toward design and
          delivery. We believe strong spaces are built by strong teams — and we’re excited to work with those
          who enjoy learning, contributing, and shaping things together.
        </p>
      </div>
    </section>
  );
};

export default Heading;
