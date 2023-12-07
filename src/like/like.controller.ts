import { Request, Response, NextFunction } from 'express';
import { createUserLikePost, deleteUserLikePost } from './like.service';

/**
 * 点赞内容
 */
export const storeUserLikePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { postId } = req.params;
  const { id: userId } = req.user;

  try {
    const data = await createUserLikePost(userId, parseInt(postId, 10));
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 取消点赞内容
 */
export const destoryUserLikePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { postId } = req.params;
  const { id: userId } = req.user;

  try {
    const data = await deleteUserLikePost(userId, parseInt(postId, 10));
    res.send(data);
  } catch (error) {
    next(error);
  }
};
