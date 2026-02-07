import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import jobApi from "../../services/jobApi";
import JobOverview from "./JobOverview";
import JobApplication from "./JobApplication";
import Footer from "../Footer";

const JobDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  /* =========================
     SCROLL TO TOP ON PAGE LOAD
  ========================== */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  /* =========================
     FETCH ROLE (GUARDED)
  ========================== */
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const data = await jobApi.getRoleBySlug(slug);
        setRole(data);
      } catch (err) {
        navigate("/careers", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [slug, navigate]);

  /* =========================
     SCROLL TO TOP ON TAB CHANGE
  ========================== */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Loading position…
      </div>
    );
  }

  if (!role) return null;

  return (
    <div className="bg-[#f2efee] min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-16">

        <Link to="/careers" className="text-sm text-gray-500">
          ← Back to Careers
        </Link>

        <h1 className="text-4xl font-semibold mt-6 mb-10">
          {role.roleName}
        </h1>

        {/* Tabs */}
        <div className="flex gap-10 border-b border-[#D6D3D1] mb-12 text-sm">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 ${
              activeTab === "overview"
                ? "border-b-2 border-black"
                : "text-gray-500"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab("application")}
            className={`pb-3 ${
              activeTab === "application"
                ? "border-b-2 border-black"
                : "text-gray-500"
            }`}
          >
            Application
          </button>
        </div>

        {/* Content */}
        {activeTab === "overview" && <JobOverview role={role} />}
        {activeTab === "application" && <JobApplication role={role} />}

      </div>
      <Footer/>
    </div>
  );
};

export default JobDetails;
