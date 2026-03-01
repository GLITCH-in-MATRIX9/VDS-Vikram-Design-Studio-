import { Request, Response } from "express";
import JobApplication from "../models/JobApplication.model";
import { Parser } from "json2csv";
import archiver from "archiver";
import axios from "axios";
import Role from "../models/Role";

/* =========================
   HELPER — BUILD FILTER
========================= */
const buildFilter = (req: Request) => {
  const { role, city } = req.query as {
    role?: string;
    city?: string;
  };

  const filter: any = {};

  // Role filter
  if (role && role !== "All Roles") {
    filter.roleSlug = role.toLowerCase().replace(/\s+/g, "-");
  }

  // City filter (optional)
  if (city) {
    filter.city = city;
  }

  return filter;
};

/* =========================
   CSV EXPORT
========================= */
export const exportApplicationsCSV = async (req: Request, res: Response) => {
  try {
    const { role, city } = req.query as {
      role?: string;
      city?: string;
    };

    const filter: any = {};

    if (role && role !== "All Roles") {
      filter.roleSlug = role.toLowerCase().replace(/\s+/g, "-");
    }

    if (city) {
      filter.city = city;
    }

    const applications = await JobApplication.find(filter).lean();
    const roles = await Role.find().lean();

    /* ---------------------------------
      MAP ROLE SLUG → ROLE OBJECT
    --------------------------------- */
    const roleMap: any = {};
    roles.forEach((r: any) => {
      roleMap[r.slug] = r;
    });

    /* ---------------------------------
      GET ALL UNIQUE ANSWER KEYS
    --------------------------------- */
    const allAnswerKeys = Array.from(
      new Set(
        applications.flatMap((app: any) => Object.keys(app.answers || {})),
      ),
    );

    /* ---------------------------------
      BUILD FULL EXPORT ROWS
    --------------------------------- */
    const formatted = applications.map((app: any) => {
      const roleData = roleMap[app.roleSlug];

      const row: any = {
        ApplicantName: app.applicant?.name || "",
        ApplicantEmail: app.applicant?.email || "",
        RoleSlug: app.roleSlug || "",
        RoleName: roleData?.roleName || "",
        Department: roleData?.department || "",
        City: app.city || "",
        Status: app.status || "",
        Notes: app.notes || "",
        SubmittedDate: app.createdAt,
        UpdatedDate: app.updatedAt,
        JobDescription: roleData?.jobDescription || "",
        Responsibilities: roleData?.responsibilities?.join(" | ") || "",
        Requirements: roleData?.requirements?.join(" | ") || "",
      };

      /* ---- Add all dynamic answers ---- */
      allAnswerKeys.forEach((key) => {
        const value = app.answers?.[key];
        row[key] = Array.isArray(value) ? value.join(" | ") : (value ?? "");
      });

      return row;
    });

    const parser = new Parser();
    const csv = parser.parse(formatted);

    res.header("Content-Type", "text/csv");
    res.attachment(
      role && role !== "All Roles"
        ? `${(role as string).replaceAll(" ", "_")}_applications.csv`
        : "applications_full_export.csv"
    );
    res.send(csv);
  } catch (error) {
    console.error("CSV Export error:", error);
    res.status(500).json({ message: "Export failed" });
  }
};

/* =========================
   ZIP EXPORT (CSV + PDFs FROM CLOUDINARY) - FIXED!
========================= */
export const exportApplicationsZIP = async (req: Request, res: Response) => {
  try {
    const { role, city } = req.query as {
      role?: string;
      city?: string;
    };

    const filter: any = {};

    if (role && role !== "All Roles") {
      filter.roleSlug = role.toLowerCase().replace(/\s+/g, "-");
    }

    if (city) {
      filter.city = city;
    }

    const applications = await JobApplication.find(filter).lean();
    const roles = await Role.find().lean();

    console.log(`📊 Found ${applications.length} applications for ZIP export`);

    /* ---------------------------------
      MAP ROLE SLUG → ROLE OBJECT
    --------------------------------- */
    const roleMap: any = {};
    roles.forEach((r: any) => {
      roleMap[r.slug] = r;
    });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=applications_export.zip",
    );

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    /* ---------------------------------
      BUILD FULL CSV DATA
    --------------------------------- */
    const allAnswerKeys = Array.from(
      new Set(
        applications.flatMap((app: any) => Object.keys(app.answers || {})),
      ),
    );

    const csvData = applications.map((app: any) => {
      const roleData = roleMap[app.roleSlug];

      const row: any = {
        ApplicantName: app.applicant?.name || "",
        ApplicantEmail: app.applicant?.email || "",
        RoleSlug: app.roleSlug || "",
        RoleName: roleData?.roleName || "",
        Department: roleData?.department || "",
        City: app.city || "",
        Status: app.status || "",
        Notes: app.notes || "",
        SubmittedDate: app.createdAt,
        UpdatedDate: app.updatedAt,
        JobDescription: roleData?.jobDescription || "",
        Responsibilities: roleData?.responsibilities?.join(" | ") || "",
        Requirements: roleData?.requirements?.join(" | ") || "",
      };

      allAnswerKeys.forEach((key) => {
        const value = app.answers?.[key];
        row[key] = Array.isArray(value) ? value.join(" | ") : (value ?? "");
      });

      return row;
    });

    const parser = new Parser();
    archive.append(parser.parse(csvData), {
      name: "applications_full_export.csv",
    });

    /* ---------------------------------
      ADD PDFs FROM CLOUDINARY (NOW FIXED!)
    --------------------------------- */
    let pdfCount = 0;
    for (const app of applications) {
      const fileUrl = app.answers?.cvFile; // Your Cloudinary URL

      if (!fileUrl) {
        console.log(`⏭️ Skipping ${app.applicant?.name || app._id} - no CV URL`);
        continue;
      }

      try {
        console.log(`📥 Fetching CV from Cloudinary: ${fileUrl}`);

        // ✅ FIXED: Use arraybuffer instead of stream
        const response = await axios({
          method: "GET",
          url: fileUrl,
          responseType: "arraybuffer",  // CRITICAL FIX #1
          timeout: 30000,
        });

        // Clean filename
        const safeName = (app.applicant?.name || `applicant_${app._id}`)
          .replace(/[^a-zA-Z0-9]/g, "_")
          .toUpperCase();

        const filename = `${safeName}_CV.pdf`;

        // ✅ FIXED: Use Buffer.from() for arraybuffer data
        archive.append(Buffer.from(response.data as ArrayBuffer), {  // CRITICAL FIX #2
          name: `PDFs/${filename}`,
        });

        pdfCount++;
        console.log(`✅ Added to ZIP: PDFs/${filename}`);
      } catch (err: any) {
        console.error(`❌ Failed CV for ${app.applicant?.name || app._id}:`, err.message);
      }
    }

    console.log(`📦 ZIP finalized: ${pdfCount} PDFs + 1 CSV`);

    await archive.finalize();
  } catch (error) {
    console.error("ZIP Export error:", error);
    res.status(500).json({ message: "ZIP export failed" });
  }
};
