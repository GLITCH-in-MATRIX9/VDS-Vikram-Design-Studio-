import { RoleData } from "../models/Role";

export const SeniorArchitectRole: RoleData = {
  roleName: "Senior Architect",
  slug: "senior-architect",

  /* =========================
     JOB METADATA (READ ONLY)
  ========================== */

  jobDescription:
    "We are looking for a Senior Architect with a strong design voice and practical finesse to lead multidisciplinary projects that range from thoughtfully detailed homes to engaging commercial environments and culturally rooted spaces. You will contribute to design thinking while ensuring projects evolve seamlessly from concept through execution. The ideal candidate is someone who combines creative clarity with technical confidence and enjoys working with diverse teams across architecture, interiors, and landscape design.",

  responsibilities: [
    "Lead design development across architectural and interior projects.",
    "Prepare and review drawings, presentations, and technical documentation.",
    "Coordinate with consultants and internal teams for integrated design.",
    "Guide junior team members and ensure quality in project output.",
    "Participate in client interactions and design discussions.",
    "Support site teams with design and technical clarifications."
  ],

  requirements: [
    "Degree in Architecture.",
    "5–8 years of professional experience.",
    "Strong design, detailing, and coordination skills.",
    "Proficiency in AutoCAD, SketchUp/Rhino, Revit (preferred).",
    "Good understanding of construction and materials.",
    "Clear communication and collaborative mindset."
  ],

  /* =========================
     APPLICATION FORM FIELDS
  ========================== */

  fields: [
    /* 1. Personal Details */
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      required: true,
      section: "Personal Details"
    },
    {
      name: "dateOfBirth",
      label: "Date of Birth",
      type: "date",
      required: true,
      section: "Personal Details"
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
      section: "Personal Details"
    },
    {
      name: "mobileNumber",
      label: "Mobile Number",
      type: "text",
      required: true,
      section: "Personal Details"
    },
    {
      name: "country",
      label: "Country",
      type: "select",
      required: true,
      section: "Personal Details"
    },
    {
      name: "state",
      label: "State",
      type: "select",
      required: true,
      section: "Personal Details"
    },
    {
      name: "city",
      label: "City",
      type: "select",
      required: true,
      section: "Personal Details"
    },
    {
      name: "linkedin",
      label: "LinkedIn Profile",
      type: "text",
      required: false,
      section: "Personal Details"
    },

    /* 2. Education & Credentials */
    {
      name: "highestQualification",
      label: "Highest Qualification",
      type: "select",
      required: true,
      options: [
        "Bachelor’s Degree",
        "Master’s Degree",
        "PhD",
        "Diploma",
        "Professional Certification",
        "Other"
      ],
      section: "Education & Credentials"
    },
    {
      name: "institution",
      label: "Institution",
      type: "text",
      required: true,
      section: "Education & Credentials"
    },
    {
      name: "graduationYear",
      label: "Graduation Year",
      type: "number",
      required: true,
      section: "Education & Credentials"
    },
    {
      name: "professionalCertification",
      label: "Professional Certification (if any)",
      type: "text",
      required: false,
      section: "Education & Credentials"
    },

    /* 3. Professional Profile */
    {
      name: "totalExperience",
      label: "Total Years of Experience",
      type: "number",
      required: true,
      section: "Professional Profile"
    },
    {
      name: "relevantSeniorExperience",
      label: "Relevant Experience as Senior Architect (years)",
      type: "number",
      required: true,
      section: "Professional Profile"
    },
    {
      name: "currentOrganization",
      label: "Current Organization",
      type: "text",
      required: true,
      section: "Professional Profile"
    },
    {
      name: "currentDesignation",
      label: "Current Designation",
      type: "text",
      required: true,
      section: "Professional Profile"
    },

    /* 4. Project Experience */
    {
      name: "projectTypes",
      label: "Primary Project Types Worked On",
      type: "checkbox",
      required: true,
      options: [
        "Residential",
        "Commercial",
        "Institutional",
        "Hospitality",
        "Mixed-use",
        "Urban / Master Planning"
      ],
      section: "Project Experience"
    },
    {
      name: "largestProject",
      label: "Largest Project Handled (area or value)",
      type: "text",
      required: true,
      section: "Project Experience"
    },
    {
      name: "projectRole",
      label: "Your Role in That Project",
      type: "textarea",
      required: true,
      section: "Project Experience"
    },

    /* 5. Skills & Tools */
    {
      name: "autocad",
      label: "AutoCAD Proficiency",
      type: "radio",
      required: true,
      options: ["Advanced", "Intermediate", "Beginner", "No Experience"],
      section: "Skills & Tools"
    },
    {
      name: "sketchup",
      label: "SketchUp Proficiency",
      type: "radio",
      required: true,
      options: ["Advanced", "Intermediate", "Beginner", "No Experience"],
      section: "Skills & Tools"
    },
    {
      name: "revit",
      label: "Revit Proficiency",
      type: "radio",
      required: true,
      options: ["Advanced", "Intermediate", "Beginner", "No Experience"],
      section: "Skills & Tools"
    },
    {
      name: "photoshop",
      label: "Adobe Photoshop Proficiency",
      type: "radio",
      required: true,
      options: ["Advanced", "Intermediate", "Beginner", "No Experience"],
      section: "Skills & Tools"
    },
    {
      name: "illustrator",
      label: "Adobe Illustrator Proficiency",
      type: "radio",
      required: true,
      options: ["Advanced", "Intermediate", "Beginner", "No Experience"],
      section: "Skills & Tools"
    },
    {
      name: "rhinoGrasshopper",
      label: "Rhino / Grasshopper Proficiency",
      type: "radio",
      required: true,
      options: ["Advanced", "Intermediate", "Beginner", "No Experience"],
      section: "Skills & Tools"
    },
    {
      name: "otherSoftware",
      label: "Other Software & Proficiency",
      type: "text",
      required: true,
      section: "Skills & Tools"
    },
    {
      name: "areaOfStrength",
      label: "Area of Strength",
      type: "checkbox",
      required: true,
      options: [
        "Concept Design",
        "Design Development",
        "Working Drawings",
        "Site Coordination",
        "Client Handling",
        "Team Leadership"
      ],
      section: "Skills & Tools"
    },

    /* 6. Attachments */
    {
      name: "cv",
      label: "CV (PDF only)",
      type: "text",
      required: true,
      section: "Attachments"
    },
    {
      name: "portfolio",
      label: "Portfolio (PDF only)",
      type: "text",
      required: true,
      section: "Attachments"
    },
    {
      name: "portfolioURL",
      label: "Portfolio URL",
      type: "text",
      required: false,
      section: "Attachments"
    },

    /* 7. Additional Information */
    {
      name: "noticePeriod",
      label: "Notice Period",
      type: "text",
      required: true,
      section: "Additional Information"
    },
    {
      name: "joiningDate",
      label: "Earliest Possible Joining Date",
      type: "date",
      required: true,
      section: "Additional Information"
    },
    {
      name: "desiredCompensation",
      label: "Desired Compensation (Annual CTC in INR)",
      type: "number",
      required: true,
      section: "Additional Information"
    },
    {
      name: "whyUs",
      label: "Why would you like to work with us?",
      type: "textarea",
      required: true,
      section: "Additional Information"
    },

    /* 8. Declaration & Consent */
    {
      name: "declaration",
      label: "Declaration of Information Accuracy",
      type: "checkbox",
      required: true,
      options: ["I agree"],
      section: "Declaration & Consent"
    },
    {
      name: "dataConsent",
      label: "Consent to Data Processing",
      type: "checkbox",
      required: true,
      options: ["I agree"],
      section: "Declaration & Consent"
    },
    {
      name: "assessmentConsent",
      label: "Consent for Design & Technical Assessment",
      type: "checkbox",
      required: true,
      options: ["I agree"],
      section: "Declaration & Consent"
    }
  ]
};
