import jwt from "jsonwebtoken";

interface TokenPayload {
    id: number;
    email: string;
    role: string;
}

const generateToken = (payload: TokenPayload): string => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign(payload, secret, {
        expiresIn: "7d",
    });
};

export default generateToken;