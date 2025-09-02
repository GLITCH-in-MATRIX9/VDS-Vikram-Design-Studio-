import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import connectDB from './config/db';
import projectRoutes from './routes/project.routes';
import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

connectDB();

const app: Express = express();
const PORT = process.env.PORT || 5002;

const clientOrigin = process.env.CLIENT_ORIGIN || '*';
app.use(cors({ origin: clientOrigin }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure upload directory exists
const uploadRoot = process.env.UPLOAD_DIR || 'uploads';
const uploadsPath = path.join(process.cwd(), uploadRoot);
fs.mkdirSync(uploadsPath, { recursive: true });

// Static serving of uploads
app.use('/uploads', express.static(uploadsPath));

app.get('/', (req: Request, res: Response) => {
  res.send('Backend API is running...');
});

app.use('/api/projects', projectRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});


