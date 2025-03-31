import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import companyRoutes from './routes/companyRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.CLIENT_URL 
        : true, // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
 
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/companies', companyRoutes);
app.use('/api/tasks', taskRoutes);

// Add error handler after all routes
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
}); 