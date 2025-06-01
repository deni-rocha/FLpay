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

export const refreshToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
      verified: boolean;
    };

    return jwt.sign(
      { id: decoded.id, role: decoded.role, verified: decoded.verified },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1h', // Renova o token por mais 1 hora
      }
    );
  } catch (error) {
    return null;
  }
};
