import { Request, Response, NextFunction, RequestHandler } from 'express';
import { imageResizer } from './file.service';
import multer, { FileFilterCallback } from 'multer';
import Jimp from 'jimp';

/**
 * 文件过滤器
 */
export const fileFilter = (fileTypes: Array<string>) => {
  return (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => {
    // 测试文件类型
    const allowed = fileTypes.some(type => type === file.mimetype);
    if (allowed) {
      callback(null, true);
    } else {
      callback(new Error('FILE_TYPE_NOT_ACCEPT'));
    }
  };
};

const fileUploadFilter = fileFilter(['image/png', 'image/jpg', 'image/jpeg']);
/**
 * 创建一个 Multer
 */
const fileUpload = multer({
  dest: 'uploads/',
  fileFilter: fileUploadFilter,
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
  console.log('文件处理');
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
