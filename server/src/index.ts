import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import assetRoutes from "./routes/assetRoutes.js";
import allocationRoutes from "./routes/allocationRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";

dotenv.config();

const app = express();

const PORT =
    Number(process.env.PORT) || 5000;

app.use(
    cors({
        origin: "http://localhost:5173",

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],
    }),
);

app.use(express.json());

app.use(
    "/api/auth",
    authRoutes,
);

app.use(
    "/api/assets",
    assetRoutes,
);

app.use(
    "/api/allocations",
    allocationRoutes,
);

app.use(
    "/api/maintenance",
    maintenanceRoutes,
);

app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,

        message:
            "AssetFlow API is running",
    });
});

app.get(
    "/api/test-db",

    async (_req, res) => {
        try {
            const [rows] =
                await db.query(
                    `
            SELECT
              DATABASE() AS databaseName,
              NOW() AS currentTime
          `,
                );

            res.status(200).json({
                success: true,

                message:
                    "MySQL connected successfully",

                data: rows,
            });
        } catch (error) {
            console.error(
                "Database error:",
                error,
            );

            res.status(500).json({
                success: false,

                message:
                    "MySQL connection failed",
            });
        }
    },
);


app.use(
    (_req, res) => {
        res.status(404).json({
            success: false,

            message:
                "API endpoint not found",
        });
    },
);

app.listen(
    PORT,

    () => {
        console.log(
            `AssetFlow API running at http://localhost:${PORT}`,
        );
    },
);