import { useEffect, useMemo, useState } from "react";
import jobApi from "../../../services/jobApi";
import authApi from "../../../services/authApi";
import { Info } from "lucide-react";

/* =========================
   HELPERS
========================= */

const humanizeSlug = (slug) =>
  slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

export default function Submissions() {

  const [applications, setApplications] = useState([]);
  const [roles, setRoles] = useState(["All Roles"]);
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH APPLICATIONS
  ========================= */

  useEffect(() => {

    const fetchData = async () => {

      try {

        const apps = await jobApi.getApplications();

        setApplications(apps);

        const uniqueRoles = Array.from(
          new Set(apps.map((a) => humanizeSlug(a.roleSlug)))
        );

        setRoles(["All Roles", ...uniqueRoles]);

      } catch (err) {
        console.error("Failed to load submissions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, []);

  /* =========================
     FILTERED DATA
  ========================= */

  const filteredData = useMemo(() => {

    if (selectedRole === "All Roles") return applications;

    return applications.filter(
      (app) => humanizeSlug(app.roleSlug) === selectedRole
    );

  }, [applications, selectedRole]);

  /* =========================
     DELETE SUBMISSION
  ========================= */

  const deleteSubmission = async (id) => {

    if (!confirm("Delete this application?")) return;

    try {

      await jobApi.deleteApplication(id);

      setApplications((prev) =>
        prev.filter((app) => app._id !== id)
      );

    } catch (err) {
      console.error("Failed to delete submission", err);
    }
  };

  /* =========================
     FULL CSV DOWNLOAD
  ========================= */

  const downloadServerCSV = async () => {

    try {

      const blob = await authApi.exportApplicationsCSV();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "applications_full_export.csv";

      document.body.appendChild(link);
      link.click();

      link.remove();

    } catch (err) {
      console.error("CSV download failed", err);
    }
  };

  /* =========================
     ZIP EXPORT
  ========================= */

  const downloadZIP = async () => {

    try {

      const blob = await authApi.exportApplicationsZIP();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "applications_export.zip";

      document.body.appendChild(link);
      link.click();

      link.remove();

    } catch (err) {
      console.error("ZIP download failed", err);
    }
  };

  /* =========================
     UI
  ========================= */

  if (loading) {
    return (
      <div className="text-sm text-gray-500 py-10">
        Loading submissions…
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl p-6 border border-[#E5E5E5] mt-8">

      {/* Header */}

      <div className="flex items-center justify-between mb-4">

        <h2 className="text-base font-medium text-gray-700 tracking-wide">
          SUBMISSIONS
        </h2>

        <div className="flex items-center gap-3">

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border border-gray-300 text-sm px-3 py-1.5 rounded-md bg-white"
          >
            {roles.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>

          {/* CSV */}
          <button
            onClick={downloadServerCSV}
            className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-[#F6F2EF]"
          >
            Download CSV
          </button>

          {/* ZIP */}
          <button
            onClick={downloadZIP}
            className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-black hover:text-white transition"
          >
            Download ZIP
          </button>

          {/* INFO ICON + TOOLTIP */}

          <div className="relative group">

            <Info className="w-4 h-4 text-gray-500 cursor-pointer" />

            <div className="absolute right-0 mt-2 w-64 text-xs bg-black text-white p-3 rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">

              <p className="mb-2">
                <strong>Download CSV:</strong> Exports all applications with complete data and clickable CV download links.
              </p>

              <p>
                <strong>Download ZIP:</strong> Downloads a ZIP file containing the CSV and all applicant PDF files together.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="w-full text-sm border-collapse">

          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>City Applied For</th>
              <th>Experience (yrs)</th>
              <th>Date Submitted</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-400">
                  No submissions found
                </td>
              </tr>
            ) : (
              filteredData.map((app) => (

                <tr key={app._id} className="border-b last:border-b-0">

                  <td className="py-3">{app.answers?.fullName || "—"}</td>
                  <td>{app.answers?.email || "—"}</td>
                  <td>{humanizeSlug(app.roleSlug)}</td>
                  <td className="font-medium text-[#3E3C3C]">
                    {app.city || "—"}
                  </td>
                  <td>{app.answers?.totalExperience ?? "—"}</td>

                  <td>
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="text-right">
                    <button
                      onClick={() => deleteSubmission(app._id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>

                </tr>

              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}
