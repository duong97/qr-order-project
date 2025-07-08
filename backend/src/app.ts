import express from "express";
import categoryRoutes from "./routes/category.route";
import productRoutes from './routes/product.route';
import { PrismaClient } from '@prisma/client';

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
        prisma.$connect().then((a) => {
            res.send("✅ Success");
        })
    } catch (error) {
        res.send("❌Failed: " + error);
    } finally {
        prisma.$disconnect()
    }
});

app.use("/api/categories", categoryRoutes);
app.use('/api/products', productRoutes);

export default app;
