import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './config/database.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from backend directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import authRoutes from './routes/auth.js';
import engineerRoutes from './routes/engineers.js';
import jobRoutes from './routes/jobs.js';
import gigRoutes from './routes/gigs.js';
import messageRoutes from './routes/messages.js';
import clientRoutes from './routes/clients.js';
import orderRoutes from './routes/orders.js';

app.use('/api/auth', authRoutes);
app.use('/api/engineers', engineerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EngineersHub API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await disconnectDB();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;

// Start server only after DB connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`EngineersHub Backend running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();