import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { createFile, findFileById } from './file.service';
/**
 * 上传文件
 */
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id: userId } = req.user;
  const { post: postId } = req.query;
  const fileInfo = _.pick(req.file, [
    'originalname',
    'mimetype',
    'filename',
    'size',
  ]);
  try {
    const data = await createFile({
      ...fileInfo,
      userId,
      postId: parseInt(`${postId}`, 10),
    });
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 文件服务
 */
export const serve = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { fileId } = req.params;
  try {
    const file = await findFileById(parseInt(fileId, 10));
    res.sendFile(file.filename, {
      root: 'uploads',
      headers: {
        'Content-type': file.mimetype,
      },
    });
  } catch (error) {
    next(error);
  }
};
