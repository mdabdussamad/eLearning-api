// import dotenv from 'dotenv';
// dotenv.config();
// import express, { NextFunction, Request, Response } from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import { ErrorMiddleware } from "./middleware/error";
// import userRouter from "./routes/user.route";
// import courseRouter from "./routes/course.route";
// import orderRouter from "./routes/order.route";
// import notificationRouter from "./routes/notification.route";
// import analyticsRouter from "./routes/analytics.route";
// import layoutRouter from "./routes/layout.route";
// import { rateLimit } from "express-rate-limit";

// export const app = express();

// // Body parser
// app.use(express.json({ limit: "50mb" }));

// // Cookie parser
// app.use(cookieParser());

// // Cors => cross origin resource sharing
// // app.use(cors({
// //     origin: 
// //       process.env.ORIGIN,
// //       methods: ["GET", "POST", "PUT", "DELETE"],
// //       credentials: true,
// //   })
// // );

// // Parse allowed origins and setup CORS
// const allowedOrigins = process.env.ORIGIN?.split(",") || [];
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow requests with no origin, e.g., mobile apps or Postman
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         return callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// // api requests limit
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   limit: 100,
//   standardHeaders: "draft-7",
//   legacyHeaders: false,
// });

// // Routes
// app.use(
//   "/api/v1",
//   userRouter,
//   orderRouter,
//   courseRouter,
//   notificationRouter,
//   analyticsRouter,
//   layoutRouter
// );

// // Testing API
// app.get("/test", (req: Request, res: Response, next: NextFunction) => {
//   res.status(200).json({
//     success: true,
//     message: "API is working",
//   });
// });

// // Unknown route
// app.all("*", (req: Request, res: Response, next: NextFunction) => {
//   const err = new Error(`Route ${req.originalUrl} not found`) as any;
//   err.statusCode = 404;
//   next(err);
// }); 
 
// // Middleware calls
// app.use(limiter);
// app.use(ErrorMiddleware);

import dotenv from 'dotenv';
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import { rateLimit } from "express-rate-limit";

export const app = express();

// Body parser
app.use(express.json({ limit: "50mb" }));

// Cookie parser
app.use(cookieParser());

// ──────────────────────────────────────────────────────────────
// SAFE CORS SETUP – This works on Render + Local + Vercel
// ──────────────────────────────────────────────────────────────
const rawOrigins = process.env.ORIGIN || "http://localhost:3000"; // fallback for local dev
const allowedOrigins = rawOrigins
  .split(",")
  .map(origin => origin.trim())
  .filter(origin => origin.length > 0);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, mobile apps, curl (no origin)
      if (!origin) return callback(null, true);

      // Check if the request origin is in our allowed list
      const isAllowed = allowedOrigins.some(allowed =>
        origin === allowed || origin.includes(allowed)
      );

      if (isAllowed) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Important for cookies/auth
  })
);

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use(limiter);

// ──────────────────────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────────────────────
app.use(
  "/api/v1",
  userRouter,
  orderRouter,
  courseRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter
);

// Test route
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is working perfectly!",
  });
});

// Unknown routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Error middleware (must be last)
app.use(ErrorMiddleware);