import { Request, Response, NextFunction } from 'express';

/**
 * 过滤器
 */
export const filter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { post, user, action } = req.query;
  req.filter = {
    name: 'default',
    sql: 'comment.parentId IS NULL',
  };

  if (post && !user && !action) {
    req.filter = {
      name: 'postComments',
      sql: 'comment.parentId IS NULL AND comment.postId = ?',
      param: `${post}`,
    };
  }

  // 用户的评论
  if (user && action == 'published' && !post) {
    req.filter = {
      name: 'userPublished',
      sql: 'comment.parentId IS NULL AND comment.userId = ?',
      param: `${user}`,
    };
  }

  // 用户的回复
  if (user && action == 'replied' && !post) {
    req.filter = {
      name: 'userReplied',
      sql: 'comment.parentId IS NOT NULL AND comment.userId = ?',
      param: `${user}`,
    };
  }
  next();
};
