import express, { Express, Request, Response } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import connectDB from "./config/db";
import { config } from "./config/env";

import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import contactRoutes from "./routes/contact.routes";
import adminRoutes from "./routes/admin.routes";
import hiringRoutes from "./routes/hiring.routes";
import aboutRoutes from "./routes/about.routes";
import contactContentRoutes from "./routes/contactContent.routes";

import { errorHandler } from "./middlewares/error.middleware";
import { generalRateLimit } from "./middlewares/rateLimit.middleware";
import tagRoutes from "./routes/tag.routes";

// Connect to MongoDB
connectDB(config.mongoUri);

const app: Express = express();
const PORT = config.port;

const allowedOrigins = [
  "https://vikramdesignstudio.com",
  "http://localhost:5173",
  process.env.CLIENT_ORIGIN || "",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS blocked for origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Parse JSON & URL-encoded payloads with memory optimization
app.use(
  express.json({
    limit: "30mb",
    verify: (req, res, buf) => {
      // Add memory monitoring
      if (buf.length > 15 * 1024 * 1024) {
        // 15MB warning
        console.warn("Large request detected:", buf.length, "bytes");
      }
    },
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "30mb",
  })
);

app.use(generalRateLimit);

// Upload directory
const uploadRoot = process.env.UPLOAD_DIR || "uploads";
const uploadsPath = path.join(process.cwd(), uploadRoot);
fs.mkdirSync(uploadsPath, { recursive: true });
app.use("/uploads", express.static(uploadsPath));

// Health check
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "VDS Backend API is running...",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/hiring", hiringRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/content", contactContentRoutes);

// Error & 404 handlers
app.use(errorHandler);
app.use("*", (req: Request, res: Response) =>
  res.status(404).json({ message: "Route not found" })
);

// Memory monitoring
const logMemoryUsage = () => {
  const used = process.memoryUsage();
  console.log("Memory Usage:", {
    rss: `${Math.round(used.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(used.external / 1024 / 1024)} MB`,
  });
};

// Log memory usage every 5 minutes
setInterval(logMemoryUsage, 5 * 60 * 1000);

// Force garbage collection if available
if (global.gc) {
  setInterval(() => {
    global.gc!();
    console.log("Garbage collection triggered");
  }, 10 * 60 * 1000); // Every 10 minutes
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsPath}`);
  console.log(`🌐 Allowed CORS origins:`, allowedOrigins);
  logMemoryUsage();
});
