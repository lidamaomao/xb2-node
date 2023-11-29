import { Request, Response, NextFunction } from 'express';
import { connection } from '../app/database/mysql';
import { UserModel } from './user.model';
import * as userService from './user.service';
import bcrypt from 'bcrypt';

/**
 * 验证用户数据
 */
export const validateUserData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('验证用户数据');

  const { name, password } = req.body;
  if (!name) return next(new Error('NAME_IS_REQUIRED'));
  if (!password) return next(new Error('PASSWORD_IS_REQUIRED'));
  // 验证用户名
  const user = await userService.getUserByName(name);
  if (user) return next(new Error('USER_ALREADY_EXIST'));
  next();
};

/**
 * Hash 密码
 */
export const hashPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { password } = req.body;
  req.body.password = await bcrypt.hash(password, 10);
  next();
};
