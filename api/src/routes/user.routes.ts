import express from 'express';
import UserController from '../controller/UserController';

const userRouter = express.Router();

userRouter.get('/', UserController.getAllUsers)
userRouter.post('/register', UserController.createUser);
userRouter.get('/verify/:token', UserController.verifyEmail);
userRouter.post('/auth', UserController.authenticate);
userRouter.put('/:id', UserController.updateUser);
userRouter.post('/forgot-password', UserController.forgotPassword);
userRouter.post('/reset-password', UserController.resetPassword);

export default userRouter;