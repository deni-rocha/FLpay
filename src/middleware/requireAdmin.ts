// src/middleware/requireAdmin.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Token não fornecido' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== 'admin') {
      res.status(403).json({ error: 'Acesso restrito a administradores' });
      return;
    }

    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
    return;
  }
}
