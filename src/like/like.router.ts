import express, { Router } from 'express';
import * as likeController from './like.controller';
import { authGuard } from '../auth/auth.middleware';

const router: Router = express.Router();

/**
 * 点赞内容
 */
router.post('/posts/:postId/like', authGuard, likeController.storeUserLikePost);

/**
 * 取消点赞内容
 */
router.delete(
  '/posts/:postId/like',
  authGuard,
  likeController.destoryUserLikePost,
);

export default router;
