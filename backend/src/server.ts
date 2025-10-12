import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import connectDB from './config/db';
import { config } from './config/env';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import contactRoutes from './routes/contact.routes';
import { errorHandler } from './middlewares/error.middleware';
import { generalRateLimit } from './middlewares/rateLimit.middleware';
import tagRoutes from "./routes/tag.routes";

// Connect to MongoDB
connectDB(config.mongoUri);

const app: Express = express();
const PORT = config.port;

// ✅ CORS setup (supports multiple origins)
const allowedOrigins = [
  'https://vikramdesignstudio.com',  // production domain
  'http://localhost:5173',           // local dev frontend
  process.env.CLIENT_ORIGIN || ''    // optional env override
].filter(Boolean); // remove empty strings

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Parse JSON & URL-encoded payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(generalRateLimit);

// Upload directory
const uploadRoot = process.env.UPLOAD_DIR || 'uploads';
const uploadsPath = path.join(process.cwd(), uploadRoot);
fs.mkdirSync(uploadsPath, { recursive: true });
app.use('/uploads', express.static(uploadsPath));

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'VDS Backend API is running...',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use("/api/tags", tagRoutes);

// Error & 404 handlers
app.use(errorHandler);
app.use('*', (req: Request, res: Response) =>
  res.status(404).json({ message: 'Route not found' })
);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsPath}`);
  console.log(`🌐 Allowed CORS origins:`, allowedOrigins);
});
