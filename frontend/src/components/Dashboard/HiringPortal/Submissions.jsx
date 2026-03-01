import { useEffect, useMemo, useState } from "react";
import jobApi from "../../../services/jobApi";
import authApi from "../../../services/authApi";
import { Info, FileText } from "lucide-react";

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
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [originalPdfUrl, setOriginalPdfUrl] = useState("");
  const [applicantName, setApplicantName] = useState("");

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

  const filteredData = useMemo(() => {
    if (selectedRole === "All Roles") return applications;
    return applications.filter(
      (app) => humanizeSlug(app.roleSlug) === selectedRole
    );
  }, [applications, selectedRole]);

  const previewPDF = (cvFileUrl, applicantName) => {
    setOriginalPdfUrl(cvFileUrl);
    setApplicantName(applicantName || "candidate");
    const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(cvFileUrl)}&embedded=true`;
    setPdfUrl(googleViewerUrl);
    setShowPdfModal(true);
  };

  // ✅ PERFECT PDF DOWNLOAD - Forces .pdf extension
  const downloadPDF = async () => {
    try {
      const response = await fetch(originalPdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `${applicantName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_cv.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback to direct download
      const link = document.createElement("a");
      link.href = originalPdfUrl;
      link.download = `${applicantName.replace(/[^a-zA-Z0-9]/g, '_')}_cv.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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

  const downloadServerCSV = async (role) => {
    try {
      const blob = await authApi.exportApplicationsCSV(role);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        role && role !== "All Roles"
          ? `${role.replaceAll(" ", "_")}_applications.csv`
          : "applications_full_export.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("CSV download failed", err);
    }
  };

  const downloadZIP = async () => {
    try {
      const blob = await authApi.exportApplicationsZIP(selectedRole);
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

  if (loading) {
    return (
      <div className="text-sm text-gray-500 py-10">
        Loading submissions…
      </div>
    );
  }

  return (
    <>
      {/* ✅ PERFECT MODAL WITH BLOB DOWNLOAD */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-[95vw] max-h-[95vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                CV Preview - {applicantName}
              </h3>
              <div className="flex items-center gap-3">
                {/* ✅ 100% WORKING PDF DOWNLOAD */}
                <button
                  onClick={downloadPDF}
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-all shadow-sm"
                >
                  📥 Download PDF
                </button>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title="CV Preview"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}

      <div className="w-full bg-white rounded-xl p-6 border border-[#E5E5E5] mt-8">
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

            {selectedRole !== "Site Supervisor" && (
              <button
                onClick={() => downloadServerCSV(selectedRole)}
                className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-[#F6F2EF]"
              >
                Download CSV
              </button>
            )}

            {selectedRole === "Site Supervisor" && (
              <button
                onClick={downloadZIP}
                className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-black hover:text-white transition"
              >
                Download ZIP
              </button>
            )}

            <div className="relative group">
              <Info className="w-4 h-4 text-gray-500 cursor-pointer" />
              <div className="absolute right-0 mt-2 w-64 text-xs bg-black text-white p-3 rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                <p className="mb-2">
                  <strong>Preview CV:</strong> Click blue button to view PDF.
                </p>
                <p>Download ZIP includes all PDFs + CSV.</p>
              </div>
            </div>
          </div>
        </div>

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
                    <td className="text-right py-3">
                      {app.answers?.cvFile && (
                        <button
                          onClick={() => previewPDF(app.answers.cvFile, app.answers.fullName || app.applicant?.name || "candidate")}
                          title="Preview CV"
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 mr-2 transition-all"
                        >
                          <FileText className="w-3 h-3" />
                          Preview CV
                        </button>
                      )}
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
    </>
  );
}
