import express, { Express } from 'express';
import postRouter from '../post/post.router';
import userRouter from '../user/user.router';
import authRouter from '../auth/auth.router';
import fileRouter from '../file/file.router';
import tagRouter from '../tag/tag.router';
import commentRouter from '../comment/comment.router';
import avatarRouter from '../avatar/avatar.router';
import likeRouter from '../like/like.router';
import appRouter from './app.router';
import { currentUser } from '../auth/auth.middleware';
import { defaultErrorHandler } from './app.middleware';
import cors from 'cors';
import { ALLOW_ORIGIN } from './app.config';

/**
 * 创建应用
 */
const app: Express = express();

/**
 * 跨域
 */
app.use(
  cors({
    origin: ALLOW_ORIGIN,
    exposedHeaders: 'X-Total-Count',
  }),
);

/**
 * 处理 JSON
 */
app.use(express.json());

/**
 * 当前用户
 */
app.use(currentUser);

/**
 * 路由
 */
app.use(
  postRouter,
  userRouter,
  authRouter,
  fileRouter,
  tagRouter,
  commentRouter,
  avatarRouter,
  likeRouter,
  appRouter,
);

/**
 * 默认异常处理器
 */
app.use(defaultErrorHandler);

/**
 * 导出应用
 */
export default app;
