import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { fileFilter } from '../file/file.middleware';
import path from 'path';
import Jimp from 'jimp';

/**
 * 头像处理器
 */
export const avatarProcessor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { file } = req;
  const filePath = path.join(file.destination, 'resized', file.filename);
  try {
    const image = await Jimp.read(file.path);

    image
      .cover(256, 256)
      .quality(85)
      .write(`${filePath}-large`);
    image
      .cover(128, 128)
      .quality(85)
      .write(`${filePath}-medium`);
    image
      .cover(64, 64)
      .quality(85)
      .write(`${filePath}-small`);
  } catch (error) {
    next(error);
  }
  next();
};

/**
 * 文件过滤器
 */
export const avatarUploadFilter = fileFilter([
  'image/png',
  'image/jpg',
  'image/jpeg',
]);

/**
 * 创建一个 Multer
 */
export const avatarUpload = multer({
  dest: 'uploads/avatar',
  fileFilter: avatarUploadFilter,
});

/**
 * 文件拦截器
 */
export const avatarInterceptor = avatarUpload.single('avatar');
