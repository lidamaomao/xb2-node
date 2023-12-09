import { Request, Response, NextFunction } from 'express';
import { connection } from '../app/database/mysql';
import { UserModel } from './user.model';
import * as userService from './user.service';
import bcrypt from 'bcrypt';
import _ from 'lodash';

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

/**
 * 验证更新用户数据
 */
export const validateUpdateUserData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { validate, update } = req.body;
  const { id: userId } = req.user;

  try {
    if (!_.has(validate, 'password')) {
      return next(new Error('PASSWORD_IS_REQUIRED'));
    }

    const user = await userService.getUserById(userId, { password: true });

    const matched = await bcrypt.compare(validate.password, user.password);

    if (!matched) {
      return next(new Error('PASSWORD_DOES_NOT_MATCH'));
    }

    if (update.name) {
      const user = await userService.getUserByName(update.name);

      if (user) {
        return next(new Error('USER_ALREADY_EXIST'));
      }
    }

    if (update.password) {
      const matched = await bcrypt.compare(update.password, user.password);
      if (matched) {
        return next(new Error('PASSWORD_IS_THE_SAME'));
      }
      req.body.update.password = await bcrypt.hash(update.password, 10);
    }

    next();
  } catch (error) {
    return next(error);
  }
};
