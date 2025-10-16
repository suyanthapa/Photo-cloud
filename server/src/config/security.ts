import helmet from "helmet";
import cors from "cors";
import { Express } from "express";

export const setupSecurity = (server: Express) => {
  // Helmet for security headers
  server.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
          styleSrc: ["'self'", "'unsafe-inline'", "https:"],
          imgSrc: ["'self'", "data:", "https:", "blob:"],
          connectSrc: ["'self'", "https:"],
        },
      },
    })
  );

  // CORS configuration
  const allowedOrigins = [
    "http://localhost:5173",
    "https://photo-cloud-delta.vercel.app",
  ];

  server.use(
    cors({
      origin: allowedOrigins, // Remove the callback for stricter validation
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      maxAge: 86400, // Cache preflight for 24 hours
    })
  );
};
