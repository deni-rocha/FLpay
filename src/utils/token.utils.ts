import jwt from 'jsonwebtoken';

export const generateVerificationToken = (userId: string): string => {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: '1h', // Token expira em 1 hora
    });
};

export const verifyToken = (token: string): string | null => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        return decoded.userId;
    } catch (error) {
        return null;
    }
};