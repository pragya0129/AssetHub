import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.use(
    cors({
        origin: "http://localhost:5173",
    }),
);

app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "AssetFlow API is running",
    });
});

app.get("/api/test-db", async (_req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT DATABASE() AS databaseName, NOW() AS currentTime",
        );

        res.status(200).json({
            success: true,
            message: "MySQL database connected successfully",
            data: rows,
        });
    } catch (error) {
        console.error("Database connection failed:", error);

        res.status(500).json({
            success: false,
            message: "Could not connect to the MySQL database",
        });
    }
});

app.listen(PORT, () => {
    console.log(`AssetFlow server running on port ${PORT}`);
});