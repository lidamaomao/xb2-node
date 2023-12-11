import { TokenPayload } from 'src/auth/auth.interface';
import { connection } from '../app/database/mysql';
import { PostModel } from './post.model';
import { sqlFragment } from './post.provider';

/**
 * 获取内容列表
 */
export interface GetPostsOptionsFilter {
  name: string;
  sql?: string;
  param?: string;
}

export interface GetPostsOptions {
  sort?: string;
  filter?: GetPostsOptionsFilter;
  pagination?: GetPostsOptionsPagination;
  currentUser?: TokenPayload;
}

export interface GetPostsOptionsPagination {
  limit: number;
  offset: number;
}

export const getPosts = async (options: GetPostsOptions) => {
  const {
    sort,
    filter,
    pagination: { limit, offset },
    currentUser,
  } = options;
  let params: Array<any> = [limit, offset];
  if (filter.param) {
    params = [filter.param, ...params];
  }
  // 当前用户
  const { id: userId } = currentUser;
  const statement = `SELECT post.id, post.title, post.content,
  ${sqlFragment.user},
  ${sqlFragment.totalComments},
  ${sqlFragment.file},
  ${sqlFragment.tags},
  ${sqlFragment.totalLikes},
  (
    SELECT COUNT(user_like_post.postId)
    FROM user_like_post
    WHERE user_like_post.postId = post.id
    && user_like_post.userId = ${userId}
  ) AS liked
  FROM post
  ${sqlFragment.leftJoinUser}
  ${sqlFragment.innerJoinOneFile}
  ${sqlFragment.leftJoinTag}
  ${filter.name == 'userLiked' ? sqlFragment.innerJoinUserLikePost : ''}
  where ${filter.sql}
  GROUP BY post.id
  ORDER BY ${sort}
  LIMIT ?
  OFFSET ?
  `;
  const [data] = await connection.promise().query(statement, params);
  return data;
};

/**
 * 创建内容
 */
export const createPost = async (post: PostModel) => {
  // 准备查询
  const statement = `INSERT INTO post SET ?`;

  const [data] = await connection.promise().query(statement, post);
  return data;
};

/**
 * 更新内容
 */
export const updatePost = async (postId: number, post: PostModel) => {
  const statement = `UPDATE post SET ? WHERE id = ?`;
  const [data] = await connection.promise().query(statement, [post, postId]);
  return data;
};

/**
 * 删除内容
 */
export const deletePost = async (postId: number) => {
  const statement = `DELETE FROM post WHERE id = ?`;
  const [data] = await connection.promise().query(statement, postId);
  return data;
};

/**
 * 保存内容标签
 */
export const createPostTag = async (postId: number, tagId: number) => {
  const statement = `INSERT INTO post_tag (postId, tagId) VALUES (?, ?)`;
  const [data] = await connection.promise().query(statement, [postId, tagId]);
  return data;
};

/**
 * 检查内容标签
 */
export const postHasTag = async (postId: number, tagId: number) => {
  const statement = `SELECT * FROM post_tag where postId=? and tagId=?`;
  const [data] = await connection.promise().query(statement, [postId, tagId]);
  return data[0] ? true : false;
};

/**
 * 移除内容标签
 */
export const deletePostTag = async (postId: number, tagId: number) => {
  const statement = `delete from post_tag where postId=? and tagId=?`;
  const [data] = await connection.promise().query(statement, [postId, tagId]);
  return data;
};

/**
 * 统计内容数量
 */
export const getPostsTotalCount = async (options: GetPostsOptions) => {
  const { filter } = options;
  let params = [filter.param];
  const statement = `
  SELECT COUNT(DISTINCT post.id) AS total
  FROM post
  ${sqlFragment.leftJoinUser}
  ${sqlFragment.innerJoinOneFile}
  ${sqlFragment.leftJoinTag}
  ${filter.name == 'userLiked' ? sqlFragment.innerJoinUserLikePost : ''}
  WHERE ${filter.sql}
  `;
  const [data] = await connection.promise().query(statement, params);
  return data[0].total;
};

/**
 * 按ID调取内容
 */
export interface getPostByIdOptions {
  currentUser?: TokenPayload;
}
export const getPostById = async (
  postId: number,
  options: getPostByIdOptions = {},
) => {
  const {
    currentUser: { id: userId },
  } = options;
  const statement = `
  SELECT
    post.id,
    post.title,
    post.content,
    ${sqlFragment.user},
    ${sqlFragment.totalComments},
    ${sqlFragment.file},
    ${sqlFragment.tags},
    ${sqlFragment.totalLikes},
    (
      SELECT COUNT(user_like_post.postId)
      FROM user_like_post
      WHERE
      user_like_post.postId = post.id
      && user_like_post.userId = ${userId}
    ) as liked
  FROM post
  ${sqlFragment.leftJoinUser}
  ${sqlFragment.leftJoinOneFile}
  ${sqlFragment.leftJoinTag}
  WHERE post.id = ?
  `;
  const [data] = await connection.promise().query(statement, postId);

  if (!data[0].id) {
    throw new Error('NOT_FOUND');
  }

  return data[0];
};
