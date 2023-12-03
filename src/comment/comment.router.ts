import express, { Router } from 'express';
import * as commentController from './comment.controller';
import { authGuard, accessControl } from '../auth/auth.middleware';

const router: Router = express.Router();

router.post('/comments', authGuard, commentController.store);

/**
 * 回复评论
 */
router.post('/comments/:commentId/reply', authGuard, commentController.reply);

/**
 * 修改评论
 */
router.patch(
  '/comments/:commentId',
  authGuard,
  accessControl({ possession: true }),
  commentController.update,
);

router.delete(
  '/comments/:commentId',
  authGuard,
  accessControl({ possession: true }),
  commentController.destory,
);
export default router;
