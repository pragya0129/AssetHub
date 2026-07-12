import type { Response } from "express";

import type {
    ResultSetHeader,
    RowDataPacket,
} from "mysql2";

import db from "../config/db.js";

import type {
    AuthRequest,
} from "../middleware/authMiddleware.js";

export const allocateAsset = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    const connection =
        await db.getConnection();

    try {
        const {
            assetId,
            employeeId,
            expectedReturnDate,
            notes,
        } = req.body;

        if (
            !assetId ||
            !employeeId
        ) {
            res.status(400).json({
                success: false,

                message:
                    "Asset and employee are required",
            });

            return;
        }

        await connection.beginTransaction();

        const [assetRows] =
            await connection.query<RowDataPacket[]>(
                `
          SELECT
            id,
            asset_tag,
            name,
            status

          FROM assets

          WHERE id = ?

          FOR UPDATE
        `,
                [assetId],
            );


        if (
            assetRows.length === 0
        ) {
            await connection.rollback();

            res.status(404).json({
                success: false,

                message:
                    "Asset not found",
            });

            return;
        }


        const asset =
            assetRows[0];

        if (
            asset.status !==
            "AVAILABLE"
        ) {
            await connection.rollback();

            const [holderRows] =
                await connection.query<
                    RowDataPacket[]
                >(
                    `
            SELECT
              u.name
                AS employee_name

            FROM asset_allocations aa

            INNER JOIN users u
              ON aa.employee_id = u.id

            WHERE
              aa.asset_id = ?

              AND aa.status = 'ACTIVE'

            LIMIT 1
          `,
                    [assetId],
                );


            const currentHolder =
                holderRows.length > 0

                    ? holderRows[0]
                        .employee_name

                    : null;


            res.status(409).json({
                success: false,

                message:
                    currentHolder

                        ? `Asset is currently allocated to ${currentHolder}`

                        : `Asset is currently ${asset.status
                            .toLowerCase()
                            .replaceAll("_", " ")}`,
            });

            return;
        }

        const [employeeRows] =
            await connection.query<
                RowDataPacket[]
            >(
                `
          SELECT
            id,
            name,
            status

          FROM users

          WHERE id = ?
        `,
                [employeeId],
            );


        if (
            employeeRows.length === 0
        ) {
            await connection.rollback();

            res.status(404).json({
                success: false,

                message:
                    "Employee not found",
            });

            return;
        }


        const employee =
            employeeRows[0];


        if (
            employee.status !== "ACTIVE"
        ) {
            await connection.rollback();

            res.status(400).json({
                success: false,

                message:
                    "Cannot allocate an asset to an inactive employee",
            });

            return;
        }


        const [allocationResult] =
            await connection.execute<
                ResultSetHeader
            >(
                `
          INSERT INTO asset_allocations
          (
            asset_id,
            employee_id,
            allocated_by,
            expected_return_date,
            allocation_notes
          )

          VALUES
          (
            ?,
            ?,
            ?,
            ?,
            ?
          )
        `,
                [
                    assetId,

                    employeeId,

                    req.user!.id,

                    expectedReturnDate || null,

                    notes?.trim() || null,
                ],
            );

        await connection.execute(
            `
        UPDATE assets

        SET status =
          'ALLOCATED'

        WHERE id = ?
      `,
            [assetId],
        );


        await connection.commit();


        res.status(201).json({
            success: true,

            message:
                `Asset allocated to ${employee.name} successfully`,

            data: {
                allocationId:
                    allocationResult.insertId,

                assetId,

                assetTag:
                    asset.asset_tag,

                employeeId,

                employeeName:
                    employee.name,

                expectedReturnDate:
                    expectedReturnDate || null,

                status:
                    "ACTIVE",
            },
        });
    } catch (error) {
        await connection.rollback();

        console.error(
            "Allocate asset error:",
            error,
        );

        res.status(500).json({
            success: false,

            message:
                "Unable to allocate asset",
        });
    } finally {
        connection.release();
    }
};

export const getAllocations = async (
    _req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const [allocations] =
            await db.query<RowDataPacket[]>(
                `
          SELECT
            aa.id,

            aa.asset_id,

            a.asset_tag,

            a.name
              AS asset_name,

            aa.employee_id,

            u.name
              AS employee_name,

            u.email
              AS employee_email,

            d.name
              AS department_name,

            manager.name
              AS allocated_by_name,

            aa.allocation_date,

            aa.expected_return_date,

            aa.actual_return_date,

            aa.status,

            aa.allocation_notes,

            aa.return_condition_notes,

            CASE

              WHEN
                aa.status = 'ACTIVE'

                AND
                aa.expected_return_date
                  IS NOT NULL

                AND
                aa.expected_return_date
                  < CURDATE()

              THEN TRUE

              ELSE FALSE

            END
              AS is_overdue

          FROM asset_allocations aa

          INNER JOIN assets a

            ON
              aa.asset_id =
              a.id

          INNER JOIN users u

            ON
              aa.employee_id =
              u.id

          INNER JOIN users manager

            ON
              aa.allocated_by =
              manager.id

          LEFT JOIN departments d

            ON
              u.department_id =
              d.id

          ORDER BY

            aa.allocation_date
              DESC
        `,
            );

        res.status(200).json({
            success: true,

            count:
                allocations.length,

            data:
                allocations,
        });
    } catch (error) {
        console.error(
            "Get allocations error:",
            error,
        );

        res.status(500).json({
            success: false,

            message:
                "Unable to retrieve allocations",
        });
    }
};

export const getMyAssets = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const [assets] =
            await db.query<RowDataPacket[]>(
                `
          SELECT
            aa.id
              AS allocation_id,

            a.id
              AS asset_id,

            a.asset_tag,

            a.name,

            a.asset_condition,

            a.location,

            c.name
              AS category_name,

            aa.allocation_date,

            aa.expected_return_date,

            CASE

              WHEN
                aa.expected_return_date
                  IS NOT NULL

                AND
                aa.expected_return_date
                  < CURDATE()

              THEN TRUE

              ELSE FALSE

            END
              AS is_overdue

          FROM asset_allocations aa

          INNER JOIN assets a

            ON
              aa.asset_id =
              a.id

          INNER JOIN asset_categories c

            ON
              a.category_id =
              c.id

          WHERE

            aa.employee_id = ?

            AND

            aa.status =
              'ACTIVE'

          ORDER BY

            aa.allocation_date
              DESC
        `,
                [
                    req.user!.id,
                ],
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
            "Get my assets error:",
            error,
        );

        res.status(500).json({
            success: false,

            message:
                "Unable to retrieve your assets",
        });
    }
};

export const returnAsset = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    const connection =
        await db.getConnection();

    try {
        const allocationId =
            Number(req.params.id);

        const {
            conditionNotes,
            assetCondition,
        } = req.body;


        if (
            !Number.isInteger(
                allocationId,
            )
        ) {
            res.status(400).json({
                success: false,

                message:
                    "Invalid allocation ID",
            });

            return;
        }


        await connection.beginTransaction();


        const [allocationRows] =
            await connection.query<
                RowDataPacket[]
            >(
                `
          SELECT
            aa.id,

            aa.asset_id,

            aa.status,

            a.asset_tag

          FROM asset_allocations aa

          INNER JOIN assets a

            ON
              aa.asset_id =
              a.id

          WHERE
            aa.id = ?

          FOR UPDATE
        `,
                [
                    allocationId,
                ],
            );


        if (
            allocationRows.length === 0
        ) {
            await connection.rollback();

            res.status(404).json({
                success: false,

                message:
                    "Allocation not found",
            });

            return;
        }


        const allocation =
            allocationRows[0];


        if (
            allocation.status !==
            "ACTIVE"
        ) {
            await connection.rollback();

            res.status(409).json({
                success: false,

                message:
                    "This allocation has already been closed",
            });

            return;
        }


        await connection.execute(
            `
        UPDATE asset_allocations

        SET

          status =
            'RETURNED',

          actual_return_date =
            NOW(),

          return_condition_notes =
            ?

        WHERE
          id = ?
      `,
            [
                conditionNotes?.trim()
                || null,

                allocationId,
            ],
        );


        const validConditions = [
            "EXCELLENT",
            "GOOD",
            "FAIR",
            "DAMAGED",
        ];


        const normalizedCondition =
            assetCondition
                ?.toUpperCase();


        if (
            normalizedCondition

            &&

            !validConditions.includes(
                normalizedCondition,
            )
        ) {
            await connection.rollback();

            res.status(400).json({
                success: false,

                message:
                    "Invalid asset condition",
            });

            return;
        }


        await connection.execute(
            `
        UPDATE assets

        SET

          status =
            'AVAILABLE',

          asset_condition =
            COALESCE(
              ?,
              asset_condition
            )

        WHERE
          id = ?
      `,
            [
                normalizedCondition
                || null,

                allocation.asset_id,
            ],
        );


        await connection.commit();


        res.status(200).json({
            success: true,

            message:
                "Asset returned successfully",

            data: {
                allocationId,

                assetId:
                    allocation.asset_id,

                assetTag:
                    allocation.asset_tag,

                assetStatus:
                    "AVAILABLE",

                allocationStatus:
                    "RETURNED",
            },
        });
    } catch (error) {
        await connection.rollback();

        console.error(
            "Return asset error:",
            error,
        );

        res.status(500).json({
            success: false,

            message:
                "Unable to return asset",
        });
    } finally {
        connection.release();
    }
};