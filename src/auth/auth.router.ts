import express, { Router } from 'express';
import * as authController from './auth.controller';
import { authGuard, validateLoginData } from './auth.middleware';

const router: Router = express.Router();

router.post('/login', validateLoginData, authController.login);
/**
 * 验证登录
 */
router.post('/auth/validate', authGuard, authController.validate);

export default router;
