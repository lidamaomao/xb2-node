import { Request, Response, NextFunction } from 'express';
import * as userService from '../user/user.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PUBLIC_KEY } from '../app/app.config';
import { TokenPayload } from './auth.interface';

/**
 * 验证用户登录数据
 */
export const validateLoginData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('验证用户登录数据');
  const { name, password } = req.body;
  if (!name) return next(new Error('NAME_IS_REQUIRED'));
  if (!password) return next(new Error('PASSWORD_IS_REQUIRED'));
  const user = await userService.getUserByName(name, { password: true });
  if (!user) return next(new Error('USER_DOES_NOT_EXIST'));
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) return next(new Error('PASSWORD_DOES_NOT_MATCH'));
  req.body.user = user;
  next();
};

/**
 * 验证用户身份
 */
export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  console.log('验证用户身份');
  try {
    const authorization = req.header('Authorization');
    if (!authorization) throw new Error();

    const token = authorization.replace('Bearer ', '');
    if (!token) throw new Error();

    const decoded = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256'],
    });

    req.user = decoded as TokenPayload;

    next();
  } catch (error) {
    next(new Error('UNAUTHORIZED'));
  }
};
