//server/index.ts
import express, { type Request, type Response, type NextFunction, type Application } from 'express';
import { createServer } from 'http';
import cors from 'cors'; // ✅ Import CORS
import { setupVite, serveStatic, log } from './vite';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// Import route modules
import  {dbProductsRouter}  from './routes/products';
import { dbCategoriesRouter } from './routes/categories';
import  ordersRouter  from './routes/orders';
import cartRouter from './routes/cart';

const app: Application = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Enable CORS
app.use(cors({
  origin:  process.env.FRONTEND_URL, // or use process.env.FRONTEND_URL if stored in .env
  credentials: true,
}));

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

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
  throw err;
});

// Server
const server = createServer(app);

(async () => {
  if (app.get('env') === 'development') {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = 5000;
  server.listen(port, '0.0.0.0', () => {
    log(`serving on port ${port}`);
  });
})();
