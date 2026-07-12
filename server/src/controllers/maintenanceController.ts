import type { Response } from "express";

import type {
    ResultSetHeader,
    RowDataPacket,
} from "mysql2";

import db from "../config/db.js";

import type {
    AuthRequest,
} from "../middleware/authMiddleware.js";


const validPriorities = [
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
];


const validStatuses = [
    "APPROVED",
    "REJECTED",
    "TECHNICIAN_ASSIGNED",
    "IN_PROGRESS",
    "RESOLVED",
];

export const createMaintenanceRequest = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const {
            assetId,
            issueDescription,
            priority,
        } = req.body;


        if (
            !assetId ||
            !issueDescription?.trim()
        ) {
            res.status(400).json({
                success: false,

                message:
                    "Asset and issue description are required",
            });

            return;
        }


        const normalizedPriority =
            priority?.toUpperCase()
            || "MEDIUM";


        if (
            !validPriorities.includes(
                normalizedPriority,
            )
        ) {
            res.status(400).json({
                success: false,

                message:
                    "Priority must be LOW, MEDIUM, HIGH or CRITICAL",
            });

            return;
        }

        const [assetRows] =
            await db.query<RowDataPacket[]>(
                `
          SELECT
            id,
            asset_tag,
            name,
            status

          FROM assets

          WHERE id = ?
        `,
                [
                    assetId,
                ],
            );


        if (
            assetRows.length === 0
        ) {
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
            [
                "LOST",
                "RETIRED",
                "DISPOSED",
            ].includes(
                asset.status,
            )
        ) {
            res.status(409).json({
                success: false,

                message:
                    `Maintenance cannot be requested because the asset is ${asset.status
                        .toLowerCase()}`,
            });

            return;
        }

        const [existingRequests] =
            await db.query<RowDataPacket[]>(
                `
          SELECT id

          FROM maintenance_requests

          WHERE

            asset_id = ?

            AND status IN
            (
              'PENDING',
              'APPROVED',
              'TECHNICIAN_ASSIGNED',
              'IN_PROGRESS'
            )

          LIMIT 1
        `,
                [
                    assetId,
                ],
            );


        if (
            existingRequests.length > 0
        ) {
            res.status(409).json({
                success: false,

                message:
                    "An active maintenance request already exists for this asset",
            });

            return;
        }


        const [result] =
            await db.execute<ResultSetHeader>(
                `
          INSERT INTO maintenance_requests
          (
            asset_id,
            requested_by,
            issue_description,
            priority,
            status
          )

          VALUES
          (
            ?,
            ?,
            ?,
            ?,
            'PENDING'
          )
        `,
                [
                    assetId,

                    req.user!.id,

                    issueDescription.trim(),

                    normalizedPriority,
                ],
            );


        res.status(201).json({
            success: true,

            message:
                "Maintenance request submitted for approval",

            data: {
                id:
                    result.insertId,

                assetId,

                assetTag:
                    asset.asset_tag,

                assetName:
                    asset.name,

                priority:
                    normalizedPriority,

                status:
                    "PENDING",
            },
        });
    } catch (error) {
        console.error(
            "Create maintenance request error:",
            error,
        );

        res.status(500).json({
            success: false,

            message:
                "Unable to create maintenance request",
        });
    }
};

export const getMaintenanceRequests = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const {
            status,
            priority,
        } = req.query;


        let query = `
      SELECT

        mr.id,

        mr.asset_id,

        a.asset_tag,

        a.name
          AS asset_name,

        a.status
          AS asset_status,

        mr.requested_by,

        u.name
          AS requested_by_name,

        u.email
          AS requested_by_email,

        d.name
          AS department_name,

        mr.issue_description,

        mr.priority,

        mr.status,

        mr.technician_name,

        mr.resolution_notes,

        mr.created_at,

        mr.resolved_at

      FROM maintenance_requests mr

      INNER JOIN assets a

        ON
          mr.asset_id =
          a.id

      INNER JOIN users u

        ON
          mr.requested_by =
          u.id

      LEFT JOIN departments d

        ON
          u.department_id =
          d.id

      WHERE 1 = 1
    `;


        const values: unknown[] = [];


        if (
            status
        ) {
            query +=
                ` AND mr.status = ?`;

            values.push(
                String(status)
                    .toUpperCase(),
            );
        }


        if (
            priority
        ) {
            query +=
                ` AND mr.priority = ?`;

            values.push(
                String(priority)
                    .toUpperCase(),
            );
        }


        query +=
            ` ORDER BY mr.created_at DESC`;


        const [requests] =
            await db.query<RowDataPacket[]>(
                query,
                values,
            );


        res.status(200).json({
            success: true,

            count:
                requests.length,

            data:
                requests,
        });
    } catch (error) {
        console.error(
            "Get maintenance requests error:",
            error,
        );

        res.status(500).json({
            success: false,

            message:
                "Unable to retrieve maintenance requests",
        });
    }
};

export const getMyMaintenanceRequests =
    async (
        req: AuthRequest,
        res: Response,
    ): Promise<void> => {
        try {
            const [requests] =
                await db.query<RowDataPacket[]>(
                    `
          SELECT

            mr.id,

            mr.asset_id,

            a.asset_tag,

            a.name
              AS asset_name,

            mr.issue_description,

            mr.priority,

            mr.status,

            mr.technician_name,

            mr.resolution_notes,

            mr.created_at,

            mr.resolved_at

          FROM maintenance_requests mr

          INNER JOIN assets a

            ON
              mr.asset_id =
              a.id

          WHERE

            mr.requested_by = ?

          ORDER BY

            mr.created_at DESC
        `,
                    [
                        req.user!.id,
                    ],
                );


            res.status(200).json({
                success: true,

                count:
                    requests.length,

                data:
                    requests,
            });
        } catch (error) {
            console.error(
                "Get my maintenance error:",
                error,
            );

            res.status(500).json({
                success: false,

                message:
                    "Unable to retrieve your maintenance requests",
            });
        }
    };

export const updateMaintenanceStatus =
    async (
        req: AuthRequest,
        res: Response,
    ): Promise<void> => {
        const connection =
            await db.getConnection();


        try {
            const requestId =
                Number(
                    req.params.id,
                );


            const {
                status,
                technicianName,
                resolutionNotes,
            } = req.body;


            if (
                !Number.isInteger(
                    requestId,
                )
            ) {
                res.status(400).json({
                    success: false,

                    message:
                        "Invalid maintenance request ID",
                });

                return;
            }


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
                        "Invalid maintenance status",
                });

                return;
            }


            await connection
                .beginTransaction();


            const [requestRows] =
                await connection.query<
                    RowDataPacket[]
                >(
                    `
          SELECT

            mr.id,

            mr.asset_id,

            mr.status,

            a.asset_tag,

            a.name
              AS asset_name

          FROM maintenance_requests mr

          INNER JOIN assets a

            ON
              mr.asset_id =
              a.id

          WHERE

            mr.id = ?

          FOR UPDATE
        `,
                    [
                        requestId,
                    ],
                );


            if (
                requestRows.length === 0
            ) {
                await connection
                    .rollback();


                res.status(404).json({
                    success: false,

                    message:
                        "Maintenance request not found",
                });

                return;
            }


            const request =
                requestRows[0];

            const allowedTransitions:
                Record<string, string[]> = {

                PENDING: [
                    "APPROVED",
                    "REJECTED",
                ],

                APPROVED: [
                    "TECHNICIAN_ASSIGNED",
                ],

                TECHNICIAN_ASSIGNED: [
                    "IN_PROGRESS",
                ],

                IN_PROGRESS: [
                    "RESOLVED",
                ],
            };


            const possibleNextStatuses =
                allowedTransitions[
                request.status
                ] || [];


            if (
                !possibleNextStatuses.includes(
                    normalizedStatus,
                )
            ) {
                await connection
                    .rollback();


                res.status(409).json({
                    success: false,

                    message:
                        `Cannot change maintenance status from ${request.status} to ${normalizedStatus}`,
                });

                return;
            }


            if (
                normalizedStatus ===
                "TECHNICIAN_ASSIGNED"

                &&

                !technicianName?.trim()
            ) {
                await connection
                    .rollback();


                res.status(400).json({
                    success: false,

                    message:
                        "Technician name is required",
                });

                return;
            }


            if (
                normalizedStatus ===
                "RESOLVED"

                &&

                !resolutionNotes?.trim()
            ) {
                await connection
                    .rollback();


                res.status(400).json({
                    success: false,

                    message:
                        "Resolution notes are required",
                });

                return;
            }


            await connection.execute(
                `
        UPDATE
          maintenance_requests

        SET

          status = ?,

          technician_name =
            CASE

              WHEN
                ? =
                'TECHNICIAN_ASSIGNED'

              THEN ?

              ELSE
                technician_name

            END,

          resolution_notes =
            CASE

              WHEN
                ? =
                'RESOLVED'

              THEN ?

              ELSE
                resolution_notes

            END,

          resolved_at =
            CASE

              WHEN
                ? =
                'RESOLVED'

              THEN NOW()

              ELSE
                resolved_at

            END

        WHERE

          id = ?
      `,
                [
                    normalizedStatus,

                    normalizedStatus,

                    technicianName?.trim()
                    || null,

                    normalizedStatus,

                    resolutionNotes?.trim()
                    || null,

                    normalizedStatus,

                    requestId,
                ],
            );

            if (
                normalizedStatus ===
                "APPROVED"
            ) {
                await connection.execute(
                    `
          UPDATE assets

          SET status =
            'UNDER_MAINTENANCE'

          WHERE id = ?
        `,
                    [
                        request.asset_id,
                    ],
                );
            }

            if (
                normalizedStatus ===
                "RESOLVED"
            ) {
                await connection.execute(
                    `
          UPDATE assets

          SET status =
            'AVAILABLE'

          WHERE id = ?
        `,
                    [
                        request.asset_id,
                    ],
                );
            }


            await connection
                .commit();


            res.status(200).json({
                success: true,

                message:
                    `Maintenance request changed to ${normalizedStatus
                        .toLowerCase()
                        .replaceAll("_", " ")}`,

                data: {
                    id:
                        requestId,

                    assetId:
                        request.asset_id,

                    assetTag:
                        request.asset_tag,

                    status:
                        normalizedStatus,

                    assetStatus:

                        normalizedStatus ===
                            "APPROVED"

                            ? "UNDER_MAINTENANCE"

                            : normalizedStatus ===
                                "RESOLVED"

                                ? "AVAILABLE"

                                : undefined,
                },
            });
        } catch (error) {
            await connection
                .rollback();


            console.error(
                "Update maintenance error:",
                error,
            );


            res.status(500).json({
                success: false,

                message:
                    "Unable to update maintenance request",
            });
        } finally {
            connection.release();
        }
    };