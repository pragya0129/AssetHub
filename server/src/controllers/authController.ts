import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import db from "../config/db.js";
import generateToken from "../utils/generateToken.js";

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    department_id: number | null;
    status: string;
}

export const signup = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { name, email, password, departmentId } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });

            return;
        }

        if (password.length < 6) {
            res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters",
            });

            return;
        }

        const normalizedEmail = email.toLowerCase().trim();

        const [existingUsers] = await db.query(
            `
        SELECT id
        FROM users
        WHERE email = ?
      `,
            [normalizedEmail],
        );

        const users = existingUsers as User[];

        if (users.length > 0) {
            res.status(409).json({
                success: false,
                message: "An account with this email already exists",
            });

            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const [result]: any = await db.query(
            `
        INSERT INTO users
        (
          name,
          email,
          password,
          role,
          department_id
        )
        VALUES (?, ?, ?, 'EMPLOYEE', ?)
      `,
            [
                name.trim(),
                normalizedEmail,
                hashedPassword,
                departmentId || null,
            ],
        );

        const userId = result.insertId;

        const token = generateToken({
            id: userId,
            email: normalizedEmail,
            role: "EMPLOYEE",
        });

        res.status(201).json({
            success: true,
            message: "Employee account created successfully",

            data: {
                user: {
                    id: userId,
                    name: name.trim(),
                    email: normalizedEmail,
                    role: "EMPLOYEE",
                    departmentId: departmentId || null,
                },

                token,
            },
        });
    } catch (error) {
        console.error("Signup error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to create account",
        });
    }
};

export const login = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required",
            });

            return;
        }

        const normalizedEmail = email.toLowerCase().trim();

        const [rows] = await db.query(
            `
        SELECT
          id,
          name,
          email,
          password,
          role,
          department_id,
          status
        FROM users
        WHERE email = ?
      `,
            [normalizedEmail],
        );

        const users = rows as User[];

        if (users.length === 0) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });

            return;
        }

        const user = users[0];

        if (user.status === "INACTIVE") {
            res.status(403).json({
                success: false,
                message: "Your account is inactive",
            });

            return;
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password,
        );

        if (!passwordMatches) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });

            return;
        }

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        res.status(200).json({
            success: true,
            message: "Login successful",

            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    departmentId: user.department_id,
                },

                token,
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to log in",
        });
    }
};