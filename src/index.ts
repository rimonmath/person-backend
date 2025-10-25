import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import './db/mongoose.js';

import homeRoutes from './routes/home.js';
// import publicApis from './src/routers/public-api.js';
import adminRoutes from './routes/api/admin/index.js';
import authRoutes from './routes/api/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally exit the process
  // process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  // Optionally exit the process
  // process.exit(1);
});

const app = express();

// Middleware setup

var allowedOrigins = [
  'http://localhost:4173',
  'http://localhost:5173',
  'https://person-monorepo-frontend.vercel.app',
  'https://person-frontend.vercel.app'
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('tiny')); // Logs requests (for development)

app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static('uploads')
);

// Routes
app.use('/', homeRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/auth', authRoutes);

// 404 handler (Express 5 compatible)
app.use((req, res) => {
  res.status(404).send({ message: '404' });
});

// Route related Error handler
app.use(errorHandler);

// Server start
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
