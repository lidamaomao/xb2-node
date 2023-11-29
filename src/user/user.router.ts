import express, { Router } from 'express';
import * as userController from './user.controller';
import { hashPassword, validateUserData } from './user.middleware';

const router: Router = express.Router();

/**
 * 创建用户
 */
router.post('/users', validateUserData, hashPassword, userController.store);

export default router;
