//server/src/index.ts
import express, { type Request, type Response, type NextFunction, type Application } from 'express';
import { createServer } from 'http';
import cors from 'cors'; // ✅ Import CORS
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { setupVite, log } from './vite.js';

// Import route modules
import  {dbProductsRouter}  from './routes/products.js';
import { dbCategoriesRouter } from './routes/categories.js';
import  ordersRouter  from './routes/orders.js';
import cartRouter from './routes/cart.js';
import adminOrdersRouter from './routes/adminOrders.js';
import orderRoutes from './routes/orderRoutes.js';

const app: Application = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const allowedOrigin = process.env.FRONTEND_URL ?? 'https://discountmart.onrender.com';

// ✅ Enable CORS

app.use(cors({
  origin: allowedOrigin,
  credentials: true, // Needed for cookies or Authorization headers
}));
console.log('✅ CORS enabled for:', allowedOrigin);


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: unknown;

  const originalJson = res.json.bind(res);
  res.json = function (body: unknown) {
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
app.get('/', (_req: Request, res: Response) => {
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

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const error = err as { status?: number; statusCode?: number; message?: string };
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

  const port = process.env.PORT || 5000;
  server.listen(Number(port), '0.0.0.0', () => {
    log(`🚀 Server is running on port ${port}`);
  });
})();

