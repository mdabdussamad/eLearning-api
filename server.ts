// import {app} from "./app"; 
// import {v2 as cloudinary} from "cloudinary";
// import connectDB from "./utils/db";
// require("dotenv").config();

// // Cloudinary config
// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_API_KEY,
//     api_secret: process.env.CLOUD_SECRET_KEY,
// })

// // Create our server
// app.listen(process.env.PORT, () => {
//     console.log(`Server is connected with port ${process.env.PORT}`);
//     connectDB();
// });

import { app } from './app';
import { v2 as cloudinary } from 'cloudinary';
import http from "http";
import connectDB from './utils/db';
import cors from 'cors';
import { initSocketServer } from './socketServer';
require('dotenv').config();

const server = http.createServer(app);

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});

initSocketServer(server);

// FIXED — This will work on Render (PORT=10000) AND locally (8000)
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
