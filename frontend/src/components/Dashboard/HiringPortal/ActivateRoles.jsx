import { useEffect, useState } from "react";
import jobApi from "../../../services/jobApi";

export default function ActivateRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH ROLES FROM BACKEND
  ========================== */
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await jobApi.getRoles();
        setRoles(data);
      } catch (err) {
        console.error("Failed to fetch roles", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  /* =========================
     TOGGLE ROLE ACTIVE STATE
  ========================== */
  const toggleRole = async (roleId, state) => {
    try {
      await jobApi.toggleRoleStatus(roleId, state);

      // optimistic UI update
      setRoles((prev) =>
        prev.map((role) =>
          role._id === roleId
            ? { ...role, isActive: state }
            : role
        )
      );
    } catch (err) {
      console.error("Failed to update role status", err);
    }
  };

  if (loading) {
    return (
      <div className="text-sm text-gray-500">
        Loading roles…
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl p-6 border border-[#E5E5E5]">
      <h2 className="text-base font-medium text-gray-700 mb-4 tracking-wide">
        ROLE AVAILABILITY
      </h2>

      <div className="space-y-4">
        {roles.map((role) => (
          <div
            key={role._id}
            className="flex items-center justify-between pb-3 border-b last:border-b-0 border-[#E5E5E5]"
          >
            <span className="text-sm text-gray-700">
              {role.roleName}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => toggleRole(role._id, true)}
                disabled={role.isActive}
                className={`px-3 py-1 text-xs tracking-wide rounded-md border
                  ${
                    role.isActive
                      ? "bg-[#EAE7E4] text-gray-500 cursor-not-allowed"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-[#F6F2EF]"
                  }`}
              >
                ACTIVATE
              </button>

              <button
                onClick={() => toggleRole(role._id, false)}
                disabled={!role.isActive}
                className={`px-3 py-1 text-xs tracking-wide rounded-md border
                  ${
                    !role.isActive
                      ? "bg-[#EAE7E4] text-gray-500 cursor-not-allowed"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-[#F6F2EF]"
                  }`}
              >
                DEACTIVATE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
