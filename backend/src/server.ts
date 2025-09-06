import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
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

dotenv.config();

connectDB();

const app: Express = express();
const PORT = config.port;

const clientOrigin = process.env.CLIENT_ORIGIN || '*';
app.use(cors({ origin: clientOrigin }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Apply general rate limiting to all routes
app.use(generalRateLimit);

// Ensure upload directory exists
const uploadRoot = process.env.UPLOAD_DIR || 'uploads';
const uploadsPath = path.join(process.cwd(), uploadRoot);
fs.mkdirSync(uploadsPath, { recursive: true });

// Static serving of uploads
app.use('/uploads', express.static(uploadsPath));

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'VDS Backend API is running...',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsPath}`);
  console.log(`🌐 CORS origin: ${clientOrigin}`);
});


