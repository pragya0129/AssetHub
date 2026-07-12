import type {
    Response,
} from "express";

import type {
    ResultSetHeader,
    RowDataPacket,
} from "mysql2";

import db
    from "../config/db.js";

import type {
    AuthRequest,
} from "../middleware/authMiddleware.js";

export const createBooking = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    const connection =
        await db.getConnection();

    try {
        const {
            assetId,
            startTime,
            endTime,
            purpose,
        } = req.body;

        if (
            !assetId ||
            !startTime ||
            !endTime
        ) {
            res.status(400).json({
                success: false,

                message:
                    "Resource, start time and end time are required",
            });

            return;
        }


        const start =
            new Date(startTime);

        const end =
            new Date(endTime);


        if (
            Number.isNaN(
                start.getTime(),
            ) ||
            Number.isNaN(
                end.getTime(),
            )
        ) {
            res.status(400).json({
                success: false,

                message:
                    "Invalid booking date or time",
            });

            return;
        }


        if (
            start >= end
        ) {
            res.status(400).json({
                success: false,

                message:
                    "End time must be after start time",
            });

            return;
        }


        if (
            start <= new Date()
        ) {
            res.status(400).json({
                success: false,

                message:
                    "Booking must start in the future",
            });

            return;
        }


        await connection
            .beginTransaction();

        const [assetRows] =
            await connection.query<
                RowDataPacket[]
            >(
                `
          SELECT

            id,

            asset_tag,

            name,

            status,

            is_bookable

          FROM assets

          WHERE
            id = ?

          FOR UPDATE
        `,
                [
                    assetId,
                ],
            );


        if (
            assetRows.length === 0
        ) {
            await connection
                .rollback();


            res.status(404).json({
                success: false,

                message:
                    "Resource not found",
            });

            return;
        }


        const asset =
            assetRows[0];


        if (
            !asset.is_bookable
        ) {
            await connection
                .rollback();


            res.status(400).json({
                success: false,

                message:
                    "This asset is not marked as a bookable resource",
            });

            return;
        }


        if (
            [
                "UNDER_MAINTENANCE",
                "LOST",
                "RETIRED",
                "DISPOSED",
            ].includes(
                asset.status,
            )
        ) {
            await connection
                .rollback();


            res.status(409).json({
                success: false,

                message:
                    `Resource cannot be booked because it is ${asset.status
                        .toLowerCase()
                        .replaceAll("_", " ")}`,
            });

            return;
        }

        const [overlappingBookings] =
            await connection.query<
                RowDataPacket[]
            >(
                `
          SELECT

            rb.id,

            rb.start_time,

            rb.end_time,

            u.name
              AS booked_by_name

          FROM
            resource_bookings rb

          INNER JOIN
            users u

          ON

            rb.booked_by =
            u.id

          WHERE

            rb.asset_id = ?

            AND

            rb.status
              IN
              (
                'UPCOMING',
                'ONGOING'
              )

            AND

            rb.start_time < ?

            AND

            rb.end_time > ?

          LIMIT 1
        `,
                [
                    assetId,

                    endTime,

                    startTime,
                ],
            );


        if (
            overlappingBookings.length > 0
        ) {
            await connection
                .rollback();


            const conflict =
                overlappingBookings[0];


            res.status(409).json({
                success: false,

                message:
                    "The resource is already booked during this time slot",

                conflict: {
                    bookingId:
                        conflict.id,

                    bookedBy:
                        conflict.booked_by_name,

                    startTime:
                        conflict.start_time,

                    endTime:
                        conflict.end_time,
                },
            });

            return;
        }

        const [result] =
            await connection.execute<
                ResultSetHeader
            >(
                `
          INSERT INTO
            resource_bookings
          (
            asset_id,

            booked_by,

            start_time,

            end_time,

            purpose,

            status
          )

          VALUES
          (
            ?,

            ?,

            ?,

            ?,

            ?,

            'UPCOMING'
          )
        `,
                [
                    assetId,

                    req.user!.id,

                    startTime,

                    endTime,

                    purpose?.trim()
                    || null,
                ],
            );


        await connection
            .commit();


        res.status(201).json({
            success: true,

            message:
                "Resource booked successfully",

            data: {
                id:
                    result.insertId,

                assetId,

                assetTag:
                    asset.asset_tag,

                resourceName:
                    asset.name,

                startTime,

                endTime,

                purpose:
                    purpose?.trim()
                    || null,

                status:
                    "UPCOMING",
            },
        });
    } catch (error) {
        await connection
            .rollback();


        console.error(
            "Create booking error:",
            error,
        );


        res.status(500).json({
            success: false,

            message:
                "Unable to create resource booking",
        });
    } finally {
        connection.release();
    }
};

export const getBookings = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const {
            status,
            assetId,
        } = req.query;


        let query = `
      SELECT

        rb.id,

        rb.asset_id,

        a.asset_tag,

        a.name
          AS resource_name,

        rb.booked_by,

        u.name
          AS booked_by_name,

        u.email
          AS booked_by_email,

        d.name
          AS department_name,

        rb.start_time,

        rb.end_time,

        rb.purpose,

        CASE

          WHEN
            rb.status =
            'CANCELLED'

          THEN
            'CANCELLED'


          WHEN
            NOW()
            <
            rb.start_time

          THEN
            'UPCOMING'


          WHEN
            NOW()
            >=
            rb.start_time

            AND

            NOW()
            <
            rb.end_time

          THEN
            'ONGOING'


          ELSE
            'COMPLETED'

        END
          AS current_status,

        rb.created_at

      FROM
        resource_bookings rb

      INNER JOIN
        assets a

      ON

        rb.asset_id =
        a.id

      INNER JOIN
        users u

      ON

        rb.booked_by =
        u.id

      LEFT JOIN
        departments d

      ON

        u.department_id =
        d.id

      WHERE
        1 = 1
    `;


        const values: unknown[] = [];


        if (
            status
        ) {
            query += `
        AND

        (
          CASE

            WHEN
              rb.status =
              'CANCELLED'

            THEN
              'CANCELLED'


            WHEN
              NOW()
              <
              rb.start_time

            THEN
              'UPCOMING'


            WHEN
              NOW()
              >=
              rb.start_time

              AND

              NOW()
              <
              rb.end_time

            THEN
              'ONGOING'


            ELSE
              'COMPLETED'

          END
        )
        =
        ?
      `;


            values.push(
                String(status)
                    .toUpperCase(),
            );
        }


        if (
            assetId
        ) {
            query +=
                ` AND rb.asset_id = ?`;


            values.push(
                Number(assetId),
            );
        }


        query += `

      ORDER BY

        rb.start_time
          ASC
    `;


        const [bookings] =
            await db.query<
                RowDataPacket[]
            >(
                query,
                values,
            );


        res.status(200).json({
            success: true,

            count:
                bookings.length,

            data:
                bookings,
        });
    } catch (error) {
        console.error(
            "Get bookings error:",
            error,
        );


        res.status(500).json({
            success: false,

            message:
                "Unable to retrieve bookings",
        });
    }
};

export const getMyBookings = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const [bookings] =
            await db.query<
                RowDataPacket[]
            >(
                `
          SELECT

            rb.id,

            rb.asset_id,

            a.asset_tag,

            a.name
              AS resource_name,

            rb.start_time,

            rb.end_time,

            rb.purpose,

            CASE

              WHEN
                rb.status =
                'CANCELLED'

              THEN
                'CANCELLED'


              WHEN
                NOW()
                <
                rb.start_time

              THEN
                'UPCOMING'


              WHEN
                NOW()
                >=
                rb.start_time

                AND

                NOW()
                <
                rb.end_time

              THEN
                'ONGOING'


              ELSE
                'COMPLETED'

            END
              AS current_status,

            rb.created_at

          FROM
            resource_bookings rb

          INNER JOIN
            assets a

          ON

            rb.asset_id =
            a.id

          WHERE

            rb.booked_by = ?

          ORDER BY

            rb.start_time
              DESC
        `,
                [
                    req.user!.id,
                ],
            );


        res.status(200).json({
            success: true,

            count:
                bookings.length,

            data:
                bookings,
        });
    } catch (error) {
        console.error(
            "Get my bookings error:",
            error,
        );


        res.status(500).json({
            success: false,

            message:
                "Unable to retrieve your bookings",
        });
    }
};

export const getResourceBookings =
    async (
        req: AuthRequest,
        res: Response,
    ): Promise<void> => {
        try {
            const assetId =
                Number(
                    req.params.assetId,
                );


            if (
                !Number.isInteger(
                    assetId,
                )
            ) {
                res.status(400).json({
                    success: false,

                    message:
                        "Invalid resource ID",
                });

                return;
            }


            const [bookings] =
                await db.query<
                    RowDataPacket[]
                >(
                    `
          SELECT

            rb.id,

            rb.start_time,

            rb.end_time,

            rb.purpose,

            rb.status,

            u.name
              AS booked_by_name

          FROM
            resource_bookings rb

          INNER JOIN
            users u

          ON

            rb.booked_by =
            u.id

          WHERE

            rb.asset_id = ?

            AND

            rb.status !=
              'CANCELLED'

            AND

            rb.end_time
              >=
            NOW()

          ORDER BY

            rb.start_time
              ASC
        `,
                    [
                        assetId,
                    ],
                );


            res.status(200).json({
                success: true,

                count:
                    bookings.length,

                data:
                    bookings,
            });
        } catch (error) {
            console.error(
                "Get resource bookings error:",
                error,
            );


            res.status(500).json({
                success: false,

                message:
                    "Unable to retrieve resource bookings",
            });
        }
    };

export const cancelBooking = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const bookingId =
            Number(
                req.params.id,
            );


        if (
            !Number.isInteger(
                bookingId,
            )
        ) {
            res.status(400).json({
                success: false,

                message:
                    "Invalid booking ID",
            });

            return;
        }


        const [bookingRows] =
            await db.query<
                RowDataPacket[]
            >(
                `
          SELECT

            id,

            booked_by,

            start_time,

            end_time,

            status

          FROM
            resource_bookings

          WHERE
            id = ?
        `,
                [
                    bookingId,
                ],
            );


        if (
            bookingRows.length === 0
        ) {
            res.status(404).json({
                success: false,

                message:
                    "Booking not found",
            });

            return;
        }


        const booking =
            bookingRows[0];


        const managerRoles = [
            "ADMIN",
            "ASSET_MANAGER",
        ];


        const isOwner =
            booking.booked_by
            ===
            req.user!.id;


        const isManager =
            managerRoles.includes(
                req.user!.role,
            );


        if (
            !isOwner &&
            !isManager
        ) {
            res.status(403).json({
                success: false,

                message:
                    "You cannot cancel another user's booking",
            });

            return;
        }


        if (
            booking.status ===
            "CANCELLED"
        ) {
            res.status(409).json({
                success: false,

                message:
                    "Booking is already cancelled",
            });

            return;
        }


        if (
            new Date(
                booking.end_time,
            )
            <=
            new Date()
        ) {
            res.status(409).json({
                success: false,

                message:
                    "A completed booking cannot be cancelled",
            });

            return;
        }


        const [result] =
            await db.execute<
                ResultSetHeader
            >(
                `
          UPDATE
            resource_bookings

          SET
            status =
            'CANCELLED'

          WHERE
            id = ?
        `,
                [
                    bookingId,
                ],
            );


        if (
            result.affectedRows === 0
        ) {
            res.status(404).json({
                success: false,

                message:
                    "Booking not found",
            });

            return;
        }


        res.status(200).json({
            success: true,

            message:
                "Booking cancelled successfully",

            data: {
                id:
                    bookingId,

                status:
                    "CANCELLED",
            },
        });
    } catch (error) {
        console.error(
            "Cancel booking error:",
            error,
        );


        res.status(500).json({
            success: false,

            message:
                "Unable to cancel booking",
        });
    }
};