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
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
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
      origin: (origin, callback) => {
        // Allow requests with no origin like mobile apps or Postman
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );
};
