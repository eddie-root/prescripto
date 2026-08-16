import cookieParser from "cookie-parser";
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client'; // Importar PrismaClient
import adminRouter from './routers/adminRouter.js';
import doctorRouter from './routers/doctorRoute.js';
import userRouter from './routers/userRoutes.js';

// app config
const app = express();
const port = process.env.PORT || 3000;

// Initialize Prisma Client
const prisma = new PrismaClient();

// Allow multiple origins
const allowedOrigins = ['http://localhost:5173']

// Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

// Make prisma client available to all routes (optional, but convenient)
app.use((req, res, next) => {
    req.prisma = prisma;
    next();
});

app.get('/', (req, res)=> res.send('API is Working'));

app.listen(port, ()=> {
    console.log(`Server is running on http://localhost:${port}`)
})
