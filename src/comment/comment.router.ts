import express, { Router } from 'express';
import * as commentController from './comment.controller';
import { authGuard, accessControl } from '../auth/auth.middleware';
import { filter } from './comment.middleware';
import { paginate } from '../post/post.middleware';
import { COMMENTS_PER_PAGE } from '../app/app.config';

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

/**
 * 评论列表
 */
router.get(
  '/comments',
  filter,
  paginate(COMMENTS_PER_PAGE),
  commentController.index,
);

/**
 * 回复列表
 */
router.get('/comments/:commentId/replies', commentController.indexReplies);
export default router;
