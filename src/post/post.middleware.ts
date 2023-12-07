import { Request, Response, NextFunction } from 'express';
import { POSTS_PER_PAGE } from '../app/app.config';

/**
 * 排序方式
 */
export const sort = async (req: Request, res: Response, next: NextFunction) => {
  const { sort } = req.query;

  let sqlSort: string;

  switch (sort) {
    case 'earliest':
      sqlSort = 'post.id ASC';
      break;
    case 'latest':
      sqlSort = 'post.id DESC';
      break;
    case 'most_comments':
      sqlSort = 'totalComments DESC, post.id DESC';
      break;
    default:
      sqlSort = 'post.id DESC';
      break;
  }

  req.sort = sqlSort;
  next();
};

/**
 * 过滤列表
 */
export const filter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { tag, user, action } = req.query;
  req.filter = {
    name: 'default',
    sql: 'post.id IS NOT NULL',
  };
  // 按标签名过滤
  if (tag && !user && !action) {
    req.filter = {
      name: 'tagName',
      sql: 'tag.name = ?',
      param: `${tag}`,
    };
  }

  // 过滤用户发布的内容
  if (user && action == 'published' && !tag) {
    req.filter = {
      name: 'userPublished',
      sql: 'user.id = ?',
      param: `${user}`,
    };
  }

  // 过滤用户点赞过的内容
  if (user && action == 'liked' && !tag) {
    req.filter = {
      name: 'userLiked',
      sql: 'user_like_post.userId = ?',
      param: `${user}`,
    };
  }
  next();
};

/**
 * 内容分页
 */
export const paginate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { page } = req.query;
  const pageNum = parseInt(page as string, 10) || 1;
  const limit = parseInt(POSTS_PER_PAGE, 10) || 30;
  const offset = limit * (pageNum - 1);
  req.pagination = { limit, offset };
  next();
};
