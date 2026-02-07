import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jobApi from "../../services/jobApi";

const OpenJobs = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await jobApi.getRoles();
        setRoles(data);
      } catch (err) {
        console.error("Failed to load roles", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  if (loading) {
    return (
      <section className="px-4 md:px-8 xl:px-20 py-12 text-sm text-gray-500">
        Loading open positions…
      </section>
    );
  }

  // Filter to show only ACTIVE jobs
  const activeRoles = roles.filter(role => role.isActive);

  return (
    <section className="bg-[#f2efee] px-4 md:px-8 xl:px-20 pb-12">
      {/* =======================
          DESKTOP TABLE
      ======================= */}
      <div className="hidden md:block mx-auto overflow-auto rounded-md border border-[#E3E1DF] bg-[#f3efee]">
        <table className="min-w-full text-sm text-left">
          <thead className="text-[#6D6D6D] uppercase text-[11px]">
            <tr>
              <th className="px-4 py-4">Position Title</th>
              <th className="px-4 py-4">Department</th>
              <th className="px-4 py-4">Location</th>
              <th className="px-4 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {activeRoles.map((role) => (
              <tr
                key={role._id}
                className="border-t border-[#E3E1DF] hover:bg-[#FAF9F8]"
              >
                <td className="px-4 py-4 font-medium text-[#3E3C3C]">
                  {role.roleName}
                </td>
                <td className="px-4 py-4 text-[#474545]">
                  ARCHITECTURE
                </td>
                <td className="px-4 py-4 font-semibold text-[#3E3C3C]">
                  GUWAHATI
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => navigate(`/careers/${role.slug}`)}
                    className="text-green-700 bg-green-100 px-3 py-1 rounded-full text-[11px] font-semibold"
                  >
                    APPLY NOW →
                  </button>
                </td>
              </tr>
            ))}

            {activeRoles.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  No positions available at the moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =======================
          MOBILE ACCORDION
      ======================= */}
      <div className="md:hidden space-y-3">
        {activeRoles.map((role, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={role._id}
              className="border border-[#E3E1DF] rounded-md bg-[#f3efee]"
            >
              {/* Header */}
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex justify-between items-center px-4 py-4 text-left"
              >
                <span className="font-medium text-[#3E3C3C]">
                  {role.roleName}
                </span>
                <span className="text-sm text-[#6D6D6D]">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {/* Content */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-3 text-sm text-[#474545]">
                  <div>
                    <span className="text-[#6D6D6D]">Department:</span>{" "}
                    ARCHITECTURE
                  </div>
                  <div>
                    <span className="text-[#6D6D6D]">Location:</span>{" "}
                    GUWAHATI
                  </div>
                  <button
                    onClick={() => navigate(`/careers/${role.slug}`)}
                    className="mt-2 inline-block text-green-700 bg-green-100 px-3 py-1 rounded-full text-[11px] font-semibold"
                  >
                    APPLY NOW →
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {activeRoles.length === 0 && (
          <div className="py-8 text-center text-sm text-gray-500">
            No positions available at the moment.
          </div>
        )}
      </div>
    </section>
  );
};

export default OpenJobs;
