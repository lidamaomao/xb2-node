import express, { Router } from 'express';
import * as authController from './auth.controller';
import { validateLoginData } from './auth.middleware';

const router: Router = express.Router();

router.post('/login', validateLoginData, authController.login);

export default router;
