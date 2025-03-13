import { Request, Response } from 'express';
import prisma from '../database/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';


class UserController {
    // POST /users
    async createUser(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            // Verificações básicas
            if (!name || !email || !password) {
                res.status(400).json({ error: 'Todos os campos são obrigatórios' });
                return
            }

            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                res.status(409).json({ error: 'Email já cadastrado' });
                return
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const verificationToken = crypto.randomBytes(32).toString('hex');

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password_hash: hashedPassword,
                    reset_token: verificationToken,
                    reset_expires: new Date(Date.now() + 86400000), // 24h
                },
                select: { id: true, name: true, email: true, created_at: true }
            });

            // Enviar email de verificação (implementar)
            // sendVerificationEmail(email, verificationToken);

            res.status(201).json({
                message: 'Usuário criado com sucesso. Verifique seu email.',
                user
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // GET /verify/:token
    async verifyEmail(req: Request, res: Response) {
        try {
            const { token } = req.params;

            const user = await prisma.user.findFirst({
                where: {
                    reset_token: token,
                    reset_expires: { gt: new Date() },
                },
            });

            if (!user) {
                res.status(400).json({ error: 'Token inválido ou expirado' });
                return
            }

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    verified: true,
                    reset_token: null,
                    reset_expires: null,
                },
            });

            res.status(200).json({ message: 'Email verificado com sucesso!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // POST /auth
    async authenticate(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await prisma.user.findUnique({
                where: { email },
                select: { id: true, password_hash: true, verified: true }
            });

            if (!user) {
                res.status(404).json({ error: 'Usuário não encontrado' });
                return
            }

            const isValid = await bcrypt.compare(password, user.password_hash);
            if (!isValid) {
                res.status(401).json({ error: 'Senha inválida' });
                return
            }

            if (!user.verified) {
                res.status(403).json({ error: 'Email não verificado' });
                return
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
                expiresIn: '1d'
            });

            res.status(200).json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // PUT /users/:id
    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, email, password } = req.body;

            const updateData: any = { name };

            if (email) {
                const existing = await prisma.user.findUnique({ where: { email } });
                if (existing && existing.id !== Number(id)) {
                    res.status(409).json({ error: 'Email já em uso' });
                    return
                }
                updateData.email = email;
                updateData.verified = false; // Requer nova verificação
            }

            if (password) {
                updateData.password_hash = await bcrypt.hash(password, 10);
            }

            const user = await prisma.user.update({
                where: { id: Number(id) },
                data: updateData,
                select: { id: true, name: true, email: true, updated_at: true }
            });

            res.status(200).json({
                message: 'Dados atualizados com sucesso',
                user
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // POST /forgot-password
    async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                res.status(200).json({ message: 'Email enviado' }); // Segurança
                return
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    reset_token: resetToken,
                    reset_expires: new Date(Date.now() + 3600000), // 1h
                },
            });

            // Enviar email de reset (implementar)
            // sendPasswordResetEmail(email, resetToken);

            res.status(200).json({ message: 'Email de recuperação enviado' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // POST /reset-password
    async resetPassword(req: Request, res: Response) {
        try {
            const { token, newPassword } = req.body;

            const user = await prisma.user.findFirst({
                where: {
                    reset_token: token,
                    reset_expires: { gt: new Date() },
                },
            });

            if (!user) {
                res.status(400).json({ error: 'Token inválido ou expirado' });
                return
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    password_hash: hashedPassword,
                    reset_token: null,
                    reset_expires: null,
                },
            });

            res.status(200).json({ message: 'Senha atualizada com sucesso' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // GET /users
    async getAllUsers(_req: Request, res: Response) {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    verified: true,
                    created_at: true,
                    updated_at: true,
                    // Não incluir campos sensíveis como password_hash, reset_token, etc
                }
            });

            res.status(200).json({
                count: users.length,
                users: users.map(user => ({
                    ...user,
                    created_at: user.created_at.toISOString(),
                    updated_at: user.updated_at?.toISOString()
                }))
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao buscar usuários' });
        }
    }
}

export default new UserController();