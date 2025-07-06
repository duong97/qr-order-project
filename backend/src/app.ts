import express from "express";
import categoryRoutes from "./routes/category.route";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Got it!");
});

app.get("/version", (req, res) => {
    res.send("1.0");
});

app.use("/api/categories", categoryRoutes);

export default app;
