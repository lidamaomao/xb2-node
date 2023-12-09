import express, { Router } from 'express';
import * as userController from './user.controller';
import {
  hashPassword,
  validateUserData,
  validateUpdateUserData,
} from './user.middleware';
import { authGuard } from '../auth/auth.middleware';

const router: Router = express.Router();

/**
 * 创建用户
 */
router.post('/users', validateUserData, hashPassword, userController.store);

/**
 * 用户账号
 */
router.get('/users/:userId', userController.show);

/**
 * 更新用户
 */
router.patch(
  '/users',
  authGuard,
  validateUpdateUserData,
  userController.update,
);

export default router;
