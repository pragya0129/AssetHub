import type {
    Request,
    Response,
    NextFunction,
} from "express";

import jwt from "jsonwebtoken";

interface JwtPayload {
    id: number;
    email: string;
    role: string;
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export const protect = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): void => {
    try {
        const authorizationHeader =
            req.headers.authorization;

        if (
            !authorizationHeader ||
            !authorizationHeader.startsWith("Bearer ")
        ) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });

            return;
        }

        const token =
            authorizationHeader.split(" ")[1];

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error(
                "JWT_SECRET is not configured",
            );
        }

        const decoded = jwt.verify(
            token,
            secret,
        ) as JwtPayload;

        req.user = decoded;

        next();
    } catch {
        res.status(401).json({
            success: false,
            message:
                "Invalid or expired authentication token",
        });
    }
};


export const authorize = (
    ...allowedRoles: string[]
) => {
    return (
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ): void => {
        if (
            !req.user ||
            !allowedRoles.includes(req.user.role)
        ) {
            res.status(403).json({
                success: false,
                message:
                    "You do not have permission to perform this action",
            });

            return;
        }

        next();
    };
};