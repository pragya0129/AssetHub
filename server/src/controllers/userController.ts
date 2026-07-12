import type {
    Response,
} from "express";

import type {
    RowDataPacket,
} from "mysql2";

import db from "../config/db.js";

import type {
    AuthRequest,
} from "../middleware/authMiddleware.js";


export const getUsers = async (
    _req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {

        const [users] =
            await db.query<RowDataPacket[]>(
                `
          SELECT

            u.id,

            u.name,

            u.email,

            u.role,

            u.status,

            u.department_id,

            d.name
              AS department_name

          FROM users u

          LEFT JOIN departments d

            ON
              u.department_id =
              d.id

          WHERE

            u.status =
              'ACTIVE'

          ORDER BY

            u.name ASC
        `,
            );


        res.status(200).json({

            success: true,

            count:
                users.length,

            data:
                users,

        });

    } catch (error) {

        console.error(
            "Get users error:",
            error,
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to retrieve users",

        });

    }
};