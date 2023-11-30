import express, { Router } from 'express';
import * as fileController from './file.controller';
import { authGuard } from '../auth/auth.middleware';
import { fileInterceptor } from './file.middleware';

const router: Router = express.Router();

router.post('/files', authGuard, fileInterceptor, fileController.store);

router.get('/files/:fileId/serve', fileController.serve);
export default router;
