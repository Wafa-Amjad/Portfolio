import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import { securityHeaders, apiLimiter } from './middleware/security.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security HTTP Headers
app.use(securityHeaders);

// Open CORS Policy for Portfolio API
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parsing with payload size limit
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: true, limit: '500kb' }));

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Global API rate limiter
app.use('/api', apiLimiter);

// Mount API routes
app.use('/api', apiRouter);

// Basic health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Backend service is online',
        mode: process.env.NODE_ENV || 'development'
    });
});

// Production: Serve React Frontend static files if hosted monolithically
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

// Catch-all route to serve Index for Single Page Application
app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }

    res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
        if (err) {
            res.status(200).send(`
        <div style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h2>Wafa Amjad - Portfolio API</h2>
          <p>The backend server is running successfully on port ${PORT}.</p>
        </div>
      `);
        }
    });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error('[Unhandled Error]', err.message);
    if (res.headersSent) {
        return next(err);
    }
    const statusCode = err.status || 500;
    const message = process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'Internal Server Error'
        : err.message || 'Something went wrong on the server';

    res.status(statusCode).json({ error: message });
});

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
