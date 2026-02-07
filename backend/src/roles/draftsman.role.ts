import { RoleData } from "../models/Role";

export const DraftsmanRole: RoleData = {
  roleName: "Draftsman",
  slug: "draftsman",

  /* =========================
     JOB METADATA (READ ONLY)
  ========================== */

  jobDescription:
    "We are looking for a Draftsman with strong technical drafting skills to support architectural and interior projects across varied scales and typologies. The role involves preparing accurate drawings, assisting in documentation, and supporting the design and execution teams through clear and coordinated drawing sets. The ideal candidate is detail-oriented, disciplined, and comfortable working within a collaborative studio environment.",

  responsibilities: [
    "Prepare architectural and interior drawings as per design intent.",
    "Develop working drawings, details, and as-built drawings.",
    "Coordinate drawings with architects, designers, and consultants.",
    "Ensure accuracy, clarity, and consistency across drawing sets.",
    "Support site teams with updated drawings and revisions.",
    "Maintain drawing standards and documentation protocols."
  ],

  requirements: [
    "Diploma/Degree in Drafting, Architecture, or related field.",
    "2–6 years of relevant professional experience.",
    "Proficiency in AutoCAD (Revit knowledge is a plus).",
    "Good understanding of building drawings and construction methods.",
    "High attention to detail and drawing discipline.",
    "Ability to work efficiently within team workflows."
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
      name: "relevantDraftsmanExperience",
      label: "Relevant Experience as Draftsman (years)",
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

    /* 4. Project Experience (OPTIONAL) */
    {
      name: "projectTypes",
      label: "Primary Project Types Worked On",
      type: "checkbox",
      required: false,
      options: [
        "Residential",
        "Commercial",
        "Institutional",
        "Hospitality",
        "Mixed-use"
      ],
      section: "Project Experience"
    },
    {
      name: "largestProject",
      label: "Largest Project Handled (area or value)",
      type: "text",
      required: false,
      section: "Project Experience"
    },
    {
      name: "projectRole",
      label: "Your Role in That Project",
      type: "textarea",
      required: false,
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
      name: "revit",
      label: "Revit Proficiency",
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
        "Architecture Drawings",
        "Interior Drawings",
        "Civil Drawings",
        "MEP Drawings"
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
