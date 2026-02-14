import { Request, Response } from "express";
import JobApplication from "../models/JobApplication.model";
import { Parser } from "json2csv";
import archiver from "archiver";
import axios from "axios";
import Role from "../models/Role";

/* =========================
   CSV EXPORT
========================= */

export const exportApplicationsCSV = async (req: Request, res: Response) => {
  try {

    const applications = await JobApplication.find().lean();
    const roles = await Role.find().lean();

    /* =========================
       BUILD FIELD LABEL MAP
    ========================= */

    const fieldLabelMap:any = {};

    roles.forEach((role:any) => {

      role.fields?.forEach((field:any) => {
        fieldLabelMap[field.name] = field.label;
      });

    });

    /* =========================
       GET ALL UNIQUE ANSWER KEYS
    ========================= */

    const allAnswerKeys = Array.from(
      new Set(
        applications.flatMap((app:any) =>
          Object.keys(app.answers || {})
        )
      )
    );

    /* =========================
       BUILD CSV ROWS
    ========================= */

    const formatted = applications.map((app:any) => {

      const row:any = {

        Name: app.applicant?.name,
        Email: app.applicant?.email,
        Role: app.roleSlug,
        City: app.city,
        Status: app.status,
        SubmittedDate: app.createdAt,

      };

      allAnswerKeys.forEach((key) => {

        const label = fieldLabelMap[key] || key;

        if (key === "cvFile") {

          row[label] = app.answers?.cvFile
            ? `=HYPERLINK("${app.answers.cvFile}","Download CV")`
            : "";

        } else {

          const value = app.answers?.[key];

          row[label] = Array.isArray(value)
            ? value.join(" | ")
            : value ?? "";
        }

      });

      return row;

    });

    const parser = new Parser();
    const csv = parser.parse(formatted);

    res.header("Content-Type", "text/csv");
    res.attachment("applications.csv");

    res.send(csv);

  } catch (error) {
    console.error("CSV Export error:", error);
    res.status(500).json({ message: "Export failed" });
  }
};


/* =========================
   ZIP EXPORT (CSV + PDFs)
========================= */

export const exportApplicationsZIP = async (req: Request, res: Response) => {

  try {

    const applications = await JobApplication.find().lean();

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=applications_export.zip"
    );

    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(res);

    /* ---------- CSV ---------- */

    const csvData = applications.map((app: any) => ({
      Name: app.applicant.name,
      Email: app.applicant.email,
      Role: app.roleSlug,
      City: app.city,
      Status: app.status,
      CV: app.answers?.cvFile || "",
    }));

    const parser = new Parser();
    archive.append(parser.parse(csvData), {
      name: "applications.csv",
    });

    /* ---------- PDFs ---------- */

    for (const app of applications) {

      if (!app.answers?.cvFile) continue;

      const response = await axios({
        method: "GET",
        url: app.answers.cvFile,
        responseType: "stream",
      });

      const safeName = app.applicant.name
        .replace(/[^a-zA-Z0-9]/g, "_")
        .toUpperCase();

      const filename = `${app._id}_${safeName}.pdf`;

      archive.append(response.data, {
        name: `PDFS/${filename}`,
      });
    }

    await archive.finalize();

  } catch (error) {
    console.error("ZIP Export error:", error);
    res.status(500).json({ message: "ZIP export failed" });
  }
};
