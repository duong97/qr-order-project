import express from "express";
import router from './routes';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from '@/core/middleware/errorHandler';

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Got it!");
});

app.get("/version", (req, res) => {
    res.send("1.0");
});

app.get("/test-connection", (req, res) => {
    const prisma = new PrismaClient();
    try {
        prisma.$connect().then(() => {
            res.send("✅ Success");
        })
    } catch (error) {
        res.send("❌Failed: " + error);
    } finally {
        prisma.$disconnect()
    }
});

app.use('/api', router);

// *** Error handler middleware nằm cuối cùng
app.use(errorHandler);

export default app;
