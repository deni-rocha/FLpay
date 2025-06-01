import express from 'express';
import UserController from '../controller/UserController';
import { requireAdmin } from '../middleware/requireAdmin';

const userRouter = express.Router();

userRouter.delete('/:id', requireAdmin, UserController.deleteUser);
userRouter.get('/', requireAdmin, UserController.getAllUsers);

userRouter.post('/register', UserController.createUser);
userRouter.get('/verify', UserController.verifyEmail);
userRouter.post('/auth', UserController.authenticate);
userRouter.put('/:id', UserController.updateUser);
userRouter.post('/forgot-password', UserController.forgotPassword);
userRouter.post('/reset-password', UserController.resetPassword);
userRouter.get('/reset-password', UserController.getResetPasswordPage);

export default userRouter;
