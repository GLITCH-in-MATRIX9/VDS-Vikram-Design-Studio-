import React from "react";

const jobData = [
  {
    title: "PROJECT MANAGER",
    department: "ARCHITECTURE",
    location: "GUWAHATI",
    vacancy: 2,
    status: "open",
  },
  {
    title: "SR. ARCHITECT",
    department: "ARCHITECTURE",
    location: "GUWAHATI",
    vacancy: 1,
    status: "closed",
  },
  {
    title: "PROJECT MANAGER",
    department: "ARCHITECTURE",
    location: "GUWAHATI",
    vacancy: 2,
    status: "open",
  },
  {
    title: "PROJECT MANAGER",
    department: "ARCHITECTURE",
    location: "GUWAHATI",
    vacancy: 2,
    status: "open",
  },
  {
    title: "PROJECT MANAGER",
    department: "ARCHITECTURE",
    location: "GUWAHATI",
    vacancy: 2,
    status: "open",
  },
  {
    title: "PROJECT MANAGER",
    department: "ARCHITECTURE",
    location: "GUWAHATI",
    vacancy: 2,
    status: "open",
  },
  {
    title: "PROJECT MANAGER",
    department: "ARCHITECTURE",
    location: "GUWAHATI",
    vacancy: 2,
    status: "open",
  },
  {
    title: "SR. ARCHITECT",
    department: "ARCHITECTURE",
    location: "GUWAHATI",
    vacancy: 1,
    status: "closed",
  },
  {
    title: "SR. ARCHITECT",
    department: "ARCHITECTURE",
    location: "GUWAHATI",
    vacancy: 1,
    status: "closed",
  },
  {
    title: "PROJECT MANAGER",
    department: "ARCHITECTURE",
    location: "GUWAHATI",
    vacancy: 2,
    status: "open",
  },
  {
    title: "PROJECT MANAGER",
    department: "ARCHITECTURE",
    location: "GUWAHATI",
    vacancy: 2,
    status: "open",
  },
];

const OpenJobs = () => {
  return (
    <section className="px-6 md:px-12 xl:px-24 py-12 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">OPEN JOBS</h2>
      <p className="text-gray-600 mb-8 max-w-4xl">
        Lorem ipsum dolor sit amet consectetur adipiscing elit dolor mattis sit
        phasellus mollis sit aliquam sit nullam neque...
      </p>

      <div className="overflow-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Position Title</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Vacancy</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {jobData.map((job, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium">{job.title}</td>
                <td className="px-4 py-3">{job.department}</td>
                <td className="px-4 py-3">
                  <span className="text-blue-700 font-semibold">
                    {job.location}
                  </span>
                </td>
                <td className="px-4 py-3">{job.vacancy}</td>
                <td className="px-4 py-3">
                  {job.status === "open" ? (
                    <button className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs font-medium">
                      APPLY NOW &gt;&gt;
                    </button>
                  ) : (
                    <span className="text-gray-500 font-medium text-xs">
                      CLOSED
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default OpenJobs;
