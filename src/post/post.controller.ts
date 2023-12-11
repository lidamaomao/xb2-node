import { Request, Response, NextFunction } from 'express';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  createPostTag,
  postHasTag,
  deletePostTag,
  getPostsTotalCount,
  getPostById,
} from './post.service';
import { TagModel } from '../tag/tag.model';
import { getTagByName, createTag } from '../tag/tag.service';
import _ from 'lodash';
import { deletePostFiles, getPostFiles } from '../file/file.service';

/**
 * 内容列表
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const totalCount = await getPostsTotalCount({ filter: request.filter });
    response.header('X-Total-Count', totalCount);
  } catch (error) {
    next(error);
  }

  try {
    const posts = await getPosts({
      sort: request.sort,
      filter: request.filter,
      pagination: request.pagination,
      currentUser: request.user,
    });
    response.send(posts);
  } catch (error) {
    next(error);
  }
};

/**
 * 创建内容
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { title, content } = request.body;
  const { id: userId } = request.user;
  try {
    const data = await createPost({ title, content, userId });
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新内容
 */
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { postId } = request.params;
  const post = _.pick(request.body, ['title', 'content']);

  try {
    const data = await updatePost(parseInt(postId, 10), post);
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除内容
 */
export const destory = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { postId } = request.params;
  try {
    const files = await getPostFiles(parseInt(postId, 10));
    if (files.length) {
      await deletePostFiles(files);
    }
    const data = await deletePost(parseInt(postId, 10));
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 添加内容标签
 */
export const storePostTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { postId } = req.params;
  const { name } = req.body;
  let tag: TagModel;
  try {
    tag = await getTagByName(name);
  } catch (error) {
    return next(error);
  }

  if (tag) {
    try {
      const postTag = await postHasTag(parseInt(postId, 10), tag.id);
      if (postTag) return next(new Error('POST_ALREADY_HAS_THIS_TAG'));
    } catch (error) {
      return next(error);
    }
  }

  if (!tag) {
    try {
      const data = await createTag({ name });
      tag = { id: data.insertId };
    } catch (error) {
      return next(error);
    }
  }

  try {
    await createPostTag(parseInt(postId), tag.id);
    res.sendStatus(201);
  } catch (error) {
    return next(error);
  }
};

/**
 * 移除内容标签
 */
export const destroyPostTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { postId } = req.params;
  const { tagId } = req.body;
  try {
    await deletePostTag(parseInt(postId, 10), tagId);
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};

/**
 * 单个内容
 */
export const show = async (req: Request, res: Response, next: NextFunction) => {
  const { postId } = req.params;

  try {
    const post = await getPostById(parseInt(postId, 10), {
      currentUser: req.user,
    });
    res.send(post);
  } catch (error) {
    next(error);
  }
};
