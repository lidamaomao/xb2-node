import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { createFile, findFileById } from './file.service';
import path from 'path';
import fs from 'fs';
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
      ...req.fileMetaData,
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
    const { size } = req.query;
    let filename = file.filename;
    let root = 'uploads';
    let resized = 'resized';
    if (size) {
      const imageSize = ['large', 'medium', 'thumbnail'];
      if (!imageSize.some(item => item == size)) {
        throw new Error('FILE_NOT_FOUND');
      }

      const fileExist = fs.existsSync(
        path.join(root, resized, `${filename}-${size}`),
      );
      if (fileExist) {
        filename = `${filename}-${size}`;
        root = path.join(root, resized);
      }
    }

    res.sendFile(filename, {
      root,
      headers: {
        'Content-type': file.mimetype,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 文件信息
 */
export const metadata = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { fileId } = req.params;
  try {
    const file = await findFileById(parseInt(fileId, 10));
    const data = _.pick(file, ['id', 'size', 'width', 'height', 'metadata']);
    res.send(data);
  } catch (error) {
    next(error);
  }
};
