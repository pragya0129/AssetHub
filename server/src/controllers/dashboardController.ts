import type {
    Response,
} from "express";

import type {
    RowDataPacket,
} from "mysql2";

import db
    from "../config/db.js";

import type {
    AuthRequest,
} from "../middleware/authMiddleware.js";

export const getDashboard = async (
    _req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {

        const [assetStats] =
            await db.query<RowDataPacket[]>(
                `
          SELECT

            COUNT(*)
              AS total_assets,

            SUM(
              CASE

                WHEN
                  status =
                  'AVAILABLE'

                THEN 1

                ELSE 0

              END
            )
              AS available_assets,

            SUM(
              CASE

                WHEN
                  status =
                  'ALLOCATED'

                THEN 1

                ELSE 0

              END
            )
              AS allocated_assets,

            SUM(
              CASE

                WHEN
                  status =
                  'RESERVED'

                THEN 1

                ELSE 0

              END
            )
              AS reserved_assets,

            SUM(
              CASE

                WHEN
                  status =
                  'UNDER_MAINTENANCE'

                THEN 1

                ELSE 0

              END
            )
              AS under_maintenance,

            SUM(
              CASE

                WHEN
                  status =
                  'LOST'

                THEN 1

                ELSE 0

              END
            )
              AS lost_assets

          FROM assets
        `,
            );

        const [maintenanceStats] =
            await db.query<RowDataPacket[]>(
                `
          SELECT

            SUM(
              CASE

                WHEN
                  status =
                  'PENDING'

                THEN 1

                ELSE 0

              END
            )
              AS pending_maintenance,

            SUM(
              CASE

                WHEN
                  status IN
                  (
                    'APPROVED',
                    'TECHNICIAN_ASSIGNED',
                    'IN_PROGRESS'
                  )

                THEN 1

                ELSE 0

              END
            )
              AS active_maintenance,

            SUM(
              CASE

                WHEN
                  DATE(
                    created_at
                  )
                  =
                  CURDATE()

                THEN 1

                ELSE 0

              END
            )
              AS maintenance_today

          FROM
            maintenance_requests
        `,
            );

        const [allocationStats] =
            await db.query<RowDataPacket[]>(
                `
          SELECT

            SUM(
              CASE

                WHEN

                  status =
                  'ACTIVE'

                  AND

                  expected_return_date
                    IS NOT NULL

                  AND

                  expected_return_date
                    <
                  CURDATE()

                THEN 1

                ELSE 0

              END
            )
              AS overdue_returns,


            SUM(
              CASE

                WHEN

                  status =
                  'ACTIVE'

                  AND

                  expected_return_date
                    BETWEEN

                    CURDATE()

                    AND

                    DATE_ADD(
                      CURDATE(),
                      INTERVAL 7 DAY
                    )

                THEN 1

                ELSE 0

              END
            )
              AS upcoming_returns

          FROM
            asset_allocations
        `,
            );

        const [bookingStats] =
            await db.query<RowDataPacket[]>(
                `
          SELECT

            COUNT(*)
              AS active_bookings

          FROM
            resource_bookings

          WHERE

            status IN
            (
              'UPCOMING',
              'ONGOING'
            )

            AND

            end_time
              >=
            NOW()
        `,
            );

        const [recentAssets] =
            await db.query<RowDataPacket[]>(
                `
          SELECT

            a.id,

            a.asset_tag,

            a.name,

            c.name
              AS category_name,

            a.asset_condition,

            a.status,

            a.location,

            a.created_at

          FROM assets a

          INNER JOIN
            asset_categories c

          ON

            a.category_id =
            c.id

          ORDER BY

            a.created_at
              DESC

          LIMIT 5
        `,
            );

        const [recentMaintenance] =
            await db.query<RowDataPacket[]>(
                `
          SELECT

            mr.id,

            a.asset_tag,

            a.name
              AS asset_name,

            u.name
              AS requested_by,

            mr.priority,

            mr.status,

            mr.created_at

          FROM
            maintenance_requests mr

          INNER JOIN
            assets a

          ON

            mr.asset_id =
            a.id

          INNER JOIN
            users u

          ON

            mr.requested_by =
            u.id

          ORDER BY

            mr.created_at
              DESC

          LIMIT 5
        `,
            );

        const [overdueAllocations] =
            await db.query<RowDataPacket[]>(
                `
          SELECT

            aa.id
              AS allocation_id,

            a.id
              AS asset_id,

            a.asset_tag,

            a.name
              AS asset_name,

            u.id
              AS employee_id,

            u.name
              AS employee_name,

            aa.expected_return_date,

            DATEDIFF(
              CURDATE(),
              aa.expected_return_date
            )
              AS days_overdue

          FROM
            asset_allocations aa

          INNER JOIN
            assets a

          ON

            aa.asset_id =
            a.id

          INNER JOIN
            users u

          ON

            aa.employee_id =
            u.id

          WHERE

            aa.status =
              'ACTIVE'

            AND

            aa.expected_return_date
              <
            CURDATE()

          ORDER BY

            days_overdue
              DESC

          LIMIT 5
        `,
            );

        const [assetDistribution] =
            await db.query<RowDataPacket[]>(
                `
          SELECT

            status,

            COUNT(*)
              AS count

          FROM assets

          GROUP BY
            status

          ORDER BY
            count DESC
        `,
            );

        const [categoryDistribution] =
            await db.query<RowDataPacket[]>(
                `
          SELECT

            c.id,

            c.name,

            COUNT(
              a.id
            )
              AS asset_count

          FROM
            asset_categories c

          LEFT JOIN
            assets a

          ON

            c.id =
            a.category_id

          GROUP BY

            c.id,

            c.name

          ORDER BY

            asset_count
              DESC
        `,
            );


        const assets =
            assetStats[0];

        const maintenance =
            maintenanceStats[0];

        const allocations =
            allocationStats[0];

        const bookings =
            bookingStats[0];


        res.status(200).json({

            success: true,


            data: {

                kpis: {

                    totalAssets:
                        Number(
                            assets.total_assets
                        )
                        || 0,


                    availableAssets:
                        Number(
                            assets.available_assets
                        )
                        || 0,


                    allocatedAssets:
                        Number(
                            assets.allocated_assets
                        )
                        || 0,


                    reservedAssets:
                        Number(
                            assets.reserved_assets
                        )
                        || 0,


                    underMaintenance:
                        Number(
                            assets.under_maintenance
                        )
                        || 0,


                    lostAssets:
                        Number(
                            assets.lost_assets
                        )
                        || 0,


                    pendingMaintenance:
                        Number(
                            maintenance
                                .pending_maintenance
                        )
                        || 0,


                    activeMaintenance:
                        Number(
                            maintenance
                                .active_maintenance
                        )
                        || 0,


                    maintenanceToday:
                        Number(
                            maintenance
                                .maintenance_today
                        )
                        || 0,


                    overdueReturns:
                        Number(
                            allocations
                                .overdue_returns
                        )
                        || 0,


                    upcomingReturns:
                        Number(
                            allocations
                                .upcoming_returns
                        )
                        || 0,


                    activeBookings:
                        Number(
                            bookings
                                .active_bookings
                        )
                        || 0,

                },


                recentAssets,


                recentMaintenance,


                overdueAllocations,


                assetDistribution,


                categoryDistribution,

            },

        });

    } catch (error) {

        console.error(
            "Dashboard error:",
            error,
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to retrieve dashboard data",

        });

    }
};