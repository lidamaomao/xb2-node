import express, { Router } from 'express';
import * as postController from './post.controller';
import { requestUrl } from '../app/app.middleware';
import { accessControl, authGuard } from '../auth/auth.middleware';
import { sort, filter } from './post.middleware';

const router: Router = express.Router();

/**
 * 内容列表
 */
router.get('/posts', sort, filter, postController.index);

/**
 * 创建内容
 */
router.post('/posts', authGuard, postController.store);

/**
 * 更新内容
 */
router.patch(
  '/posts/:postId',
  authGuard,
  accessControl({ possession: true }),
  postController.update,
);

/**
 * 删除内容
 */
router.delete(
  '/posts/:postId',
  authGuard,
  accessControl({ possession: true }),
  postController.destory,
);

/**
 * 添加内容标签
 */
router.post(
  '/posts/:postId/tag',
  authGuard,
  accessControl({ possession: true }),
  postController.storePostTag,
);

/**
 * 移除内容标签
 */
router.delete(
  '/posts/:postId/tag',
  authGuard,
  accessControl({ possession: true }),
  postController.destroyPostTag,
);

/**
 * 导出路由
 */
export default router;
