import React from "react";

const teamData = [
  { name: "Vikramm B Shroff", designation: "Co-founder" },
  { name: "Pooza Agarwal", designation: "Co-founder" },
  { name: "Namman Shroff", designation: "Partner & Design Lead" },
  { name: "Ajit Deka", designation: "Office Assistant" },
  { name: "Ayush Biswakarma", designation: "Data Operator" },
  { name: "Biplob Rabha", designation: "Jr. Architect" },
  { name: "Devid Barman", designation: "Admin Assistant" },
  { name: "Indrajit Choudhary", designation: "Accountant" },
  { name: "Kriti Ghiya", designation: "Jr. Interior Designer" },
  { name: "Luku Biswakarma", designation: "Site Supervisor" },
  { name: "Suprit Das", designation: "Jr. Architect" },
  { name: "Paran Basumatary", designation: "Quantity Surveyor" },
  { name: "Prasanta Kalita", designation: "Senior Architect" },
  { name: "Rajnish Rabha", designation: "Visualiser" },
  { name: "Sandip Agarwal", designation: "Interior Designer" },
  { name: "Saurav Sharma", designation: "Jr. Site Supervisor" },
  { name: "Shibhu Biswakarma", designation: "Site Supervisor" },
  { name: "Sunil Sharma", designation: "Civil Engineer" },
  { name: "Tanisha Sengupta", designation: "Architect" },
  { name: "Vibek Poddar", designation: "Interior Designer" },
  { name: "Vishal Bhattacharjee", designation: "Jr. Architect" },
];

const TeamMembers = () => {
  return (
    <div className="bg-[#f5f4f3] min-h-screen px-6 md:px-12 lg:px-20 py-12">
      <h1 className="font-sora font-semibold text-[56px] leading-[64px] tracking-[-0.01em] text-[#3E3C3C] mb-32">
        TEAM MEMBERS
      </h1>

      <table className="w-full border-collapse font-sora text-[#3E3C3C]">
        <thead>
          <tr className="border-b border-[#d6d6d6] font-semibold text-[14px] text-left">
            <th className="pb-4 w-[45%]">TEAM MEMBER</th>
            <th className="pb-4 w-[55%]">DESIGNATION</th>
          </tr>
        </thead>
        <tbody>
          {teamData.map(({ name, designation }, index) => (
            <tr key={index} >
              <td className="py-2 text-[14px]">{name}</td>
              <td className="py-2 text-[14px]">{designation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamMembers;
