import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

import db from "../config/db.js";

interface AssetRow extends RowDataPacket {
    id: number;
    asset_tag: string;
    name: string;
    category_id: number;
    category_name: string;
    serial_number: string | null;
    acquisition_date: string | null;
    acquisition_cost: number | null;
    asset_condition: string;
    status: string;
    location: string | null;
    is_bookable: boolean;
    created_at: string;
    updated_at: string;
}

const validConditions = [
    "EXCELLENT",
    "GOOD",
    "FAIR",
    "DAMAGED",
];

const validStatuses = [
    "AVAILABLE",
    "ALLOCATED",
    "RESERVED",
    "UNDER_MAINTENANCE",
    "LOST",
    "RETIRED",
    "DISPOSED",
];

export const createAsset = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const {
            name,
            categoryId,
            serialNumber,
            acquisitionDate,
            acquisitionCost,
            condition,
            location,
            isBookable,
        } = req.body;

        if (!name || !categoryId) {
            res.status(400).json({
                success: false,
                message: "Asset name and category are required",
            });

            return;
        }

        const normalizedCondition =
            condition?.toUpperCase() || "GOOD";

        if (
            !validConditions.includes(
                normalizedCondition,
            )
        ) {
            res.status(400).json({
                success: false,
                message:
                    "Condition must be EXCELLENT, GOOD, FAIR or DAMAGED",
            });

            return;
        }

        const [categoryRows] =
            await db.query<RowDataPacket[]>(
                `
          SELECT id
          FROM asset_categories
          WHERE id = ?
          AND status = 'ACTIVE'
        `,
                [categoryId],
            );

        if (categoryRows.length === 0) {
            res.status(404).json({
                success: false,
                message:
                    "Active asset category not found",
            });

            return;
        }

        if (serialNumber) {
            const [serialRows] =
                await db.query<RowDataPacket[]>(
                    `
            SELECT id
            FROM assets
            WHERE serial_number = ?
          `,
                    [serialNumber.trim()],
                );

            if (serialRows.length > 0) {
                res.status(409).json({
                    success: false,
                    message:
                        "An asset with this serial number already exists",
                });

                return;
            }
        }

        const temporaryAssetTag =
            `TEMP-${Date.now()}`;

        const [result] =
            await db.execute<ResultSetHeader>(
                `
          INSERT INTO assets
          (
            asset_tag,
            name,
            category_id,
            serial_number,
            acquisition_date,
            acquisition_cost,
            asset_condition,
            status,
            location,
            is_bookable
          )
          VALUES
          (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            'AVAILABLE',
            ?,
            ?
          )
        `,
                [
                    temporaryAssetTag,
                    name.trim(),
                    categoryId,
                    serialNumber?.trim() || null,
                    acquisitionDate || null,
                    acquisitionCost ?? null,
                    normalizedCondition,
                    location?.trim() || null,
                    Boolean(isBookable),
                ],
            );

        const assetId = result.insertId;

        const assetTag =
            `AF-${String(assetId).padStart(4, "0")}`;

        await db.execute(
            `
        UPDATE assets
        SET asset_tag = ?
        WHERE id = ?
      `,
            [
                assetTag,
                assetId,
            ],
        );

        res.status(201).json({
            success: true,

            message:
                "Asset registered successfully",

            data: {
                id: assetId,
                assetTag,
                name: name.trim(),
                status: "AVAILABLE",
            },
        });
    } catch (error) {
        console.error(
            "Create asset error:",
            error,
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to register asset",
        });
    }
};

export const getAssets = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const {
            search,
            category,
            status,
            location,
        } = req.query;

        let query = `
      SELECT
        a.id,
        a.asset_tag,
        a.name,

        a.category_id,

        c.name
          AS category_name,

        a.serial_number,

        a.acquisition_date,

        a.acquisition_cost,

        a.asset_condition,

        a.status,

        a.location,

        a.is_bookable,

        a.created_at,

        a.updated_at

      FROM assets a

      INNER JOIN asset_categories c
        ON a.category_id = c.id

      WHERE 1 = 1
    `;

        const values: unknown[] = [];

        if (search) {
            query += `
        AND
        (
          a.name LIKE ?

          OR a.asset_tag LIKE ?

          OR a.serial_number LIKE ?
        )
      `;

            const searchValue =
                `%${String(search)}%`;

            values.push(
                searchValue,
                searchValue,
                searchValue,
            );
        }

        if (category) {
            query += `
        AND a.category_id = ?
      `;

            values.push(
                Number(category),
            );
        }

        if (status) {
            query += `
        AND a.status = ?
      `;

            values.push(
                String(status).toUpperCase(),
            );
        }

        if (location) {
            query += `
        AND a.location LIKE ?
      `;

            values.push(
                `%${String(location)}%`,
            );
        }

        query += `
      ORDER BY
        a.created_at DESC
    `;

        const [assets] =
            await db.query<AssetRow[]>(
                query,
                values,
            );

        res.status(200).json({
            success: true,

            count:
                assets.length,

            data:
                assets,
        });
    } catch (error) {
        console.error(
            "Get assets error:",
            error,
        );

        res.status(500).json({
            success: false,

            message:
                "Unable to retrieve assets",
        });
    }
};

export const getAssetById = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const assetId =
            Number(req.params.id);

        if (
            !Number.isInteger(assetId)
        ) {
            res.status(400).json({
                success: false,
                message:
                    "Invalid asset ID",
            });

            return;
        }

        const [assets] =
            await db.query<AssetRow[]>(
                `
          SELECT
            a.*,

            c.name
              AS category_name

          FROM assets a

          INNER JOIN asset_categories c
            ON a.category_id = c.id

          WHERE a.id = ?
        `,
                [assetId],
            );

        if (
            assets.length === 0
        ) {
            res.status(404).json({
                success: false,
                message:
                    "Asset not found",
            });

            return;
        }

        res.status(200).json({
            success: true,

            data:
                assets[0],
        });
    } catch (error) {
        console.error(
            "Get asset error:",
            error,
        );

        res.status(500).json({
            success: false,

            message:
                "Unable to retrieve asset",
        });
    }
};

export const updateAssetStatus = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const assetId =
            Number(req.params.id);

        const {
            status,
        } = req.body;

        const normalizedStatus =
            status?.toUpperCase();

        if (
            !validStatuses.includes(
                normalizedStatus,
            )
        ) {
            res.status(400).json({
                success: false,

                message:
                    "Invalid asset lifecycle status",
            });

            return;
        }

        const [result] =
            await db.execute<ResultSetHeader>(
                `
          UPDATE assets

          SET status = ?

          WHERE id = ?
        `,
                [
                    normalizedStatus,
                    assetId,
                ],
            );

        if (
            result.affectedRows === 0
        ) {
            res.status(404).json({
                success: false,
                message:
                    "Asset not found",
            });

            return;
        }

        res.status(200).json({
            success: true,

            message:
                "Asset status updated successfully",

            data: {
                id:
                    assetId,

                status:
                    normalizedStatus,
            },
        });
    } catch (error) {
        console.error(
            "Update status error:",
            error,
        );

        res.status(500).json({
            success: false,

            message:
                "Unable to update asset status",
        });
    }
};