//server/index.ts
import express from 'express';
import { createServer } from 'http';
import cors from 'cors'; // ✅ Import CORS
import { setupVite, serveStatic, log } from './vite';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
// Import route modules
import { dbProductsRouter } from './routes/products';
import { dbCategoriesRouter } from './routes/categories';
import ordersRouter from './routes/orders';
import cartRouter from './routes/cart';
import adminOrdersRouter from './routes/adminOrders';
import orderRoutes from './routes/orderRoutes';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const allowedOrigin = process.env.FRONTEND_URL;
// ✅ Enable CORS
app.use(cors({
    origin: allowedOrigin,
    credentials: true, // Needed for cookies or Authorization headers
}));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Request logger
app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse;
    const originalJson = res.json.bind(res);
    res.json = function (body) {
        capturedJsonResponse = body;
        return originalJson(body);
    };
    res.on('finish', () => {
        const duration = Date.now() - start;
        if (path.startsWith('/api')) {
            let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
            if (capturedJsonResponse) {
                logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
            }
            logLine = logLine.length > 80 ? logLine.slice(0, 77) + '…' : logLine;
            log(logLine);
        }
    });
    next();
});
// Health check
app.get('/', (_req, res) => {
    res.send('API is running!');
});
// Static files
app.use(express.static(path.join(__dirname, 'public')));
// Routes
app.use('/api/products', dbProductsRouter);
app.use('/api/categories', dbCategoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/cart', cartRouter);
app.use('/api/admin/orders', adminOrdersRouter);
app.use("/api/orders", orderRoutes);
// Error handler
app.use((err, _req, res, _next) => {
    const error = err;
    const status = error.status || error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    res.status(status).json({ message });
});
// Server
const server = createServer(app);
(async () => {
    if (app.get('env') === 'development') {
        await setupVite(app, server);
    }
    else {
        serveStatic(app);
    }
    const port = 5000;
    server.listen(port, '0.0.0.0', () => {
        log(`serving on port ${port}`);
    });
})();
