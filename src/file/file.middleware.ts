import { Request, Response, NextFunction, RequestHandler } from 'express';
import { imageResizer } from './file.service';
import multer from 'multer';
import Jimp from 'jimp';

/**
 * 创建一个 Multer
 */
const fileUpload = multer({
  dest: 'uploads/',
});

/**
 * 文件拦截器
 */
export const fileInterceptor: RequestHandler = fileUpload.single('file');

/**
 * 文件处理器
 */
export const fileProcessor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { path } = req.file;
  let image: Jimp;
  try {
    image = await Jimp.read(path);
  } catch (error) {
    next(error);
  }
  const { imageSize, tags } = image['_exif'];
  req.fileMetaData = {
    width: imageSize.width,
    height: imageSize.height,
    metadata: JSON.stringify(tags),
  };
  imageResizer(image, req.file);
  next();
};
