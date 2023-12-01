import express, { Router } from 'express';
import * as fileController from './file.controller';
import { authGuard } from '../auth/auth.middleware';
import { fileInterceptor, fileProcessor } from './file.middleware';

const router: Router = express.Router();

router.post(
  '/files',
  authGuard,
  fileInterceptor,
  fileProcessor,
  fileController.store,
);

router.get('/files/:fileId/serve', fileController.serve);
router.get('/files/:fileId/metadata', fileController.metadata);
export default router;
