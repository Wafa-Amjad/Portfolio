import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*', // For development flexibility
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Mount API routes
app.use('/api', apiRouter);

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend service is online' });
});

// Production: Serve React Frontend static files
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

// Catch-all route to serve Index for Single Page Application
app.get('*', (req, res) => {
    // If request is made to API that didn't match, return 404
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }

    // Serve the frontend build
    res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
        if (err) {
            // If index.html is missing (e.g. during development), send a friendly message
            res.status(200).send(`
        <div style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h2>Wafa Amjad - Portfolio API</h2>
          <p>The backend server is running successfully on port ${PORT}.</p>
          <p>Please launch the React frontend by running <code>npm run dev</code> inside the <code>frontend</code> folder.</p>
        </div>
      `);
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
