require("dotenv").config();
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

export const app = express();

// Body parser
app.use(express.json({ limit: "50mb" }));

// Cookie parser
app.use(cookieParser());

// CORS => Cross-Origin Resource Sharing
app.use(
  cors({
<<<<<<< HEAD
    // origin: process.env.ORIGIN,      
    // origin: "https://e-learning-client-chi.vercel.app", 
    origin: process.env.ORIGIN || "https://e-learning-client-chi.vercel.app",     
=======
    origin: ['https://e-learning-client-chi.vercel.app'],   
>>>>>>> 5ff76f75eafd8e90514edc000528a49ada59b0b7
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials:true,
  })
);

// Routes
app.use("/api/v1", userRouter, courseRouter, orderRouter, notificationRouter, analyticsRouter,layoutRouter);

// Testing API
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// Unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Error Middleware
app.use(ErrorMiddleware);
