import { Request, Response, NextFunction } from 'express';
import * as userService from '../user/user.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PUBLIC_KEY } from '../app/app.config';
import { TokenPayload } from './auth.interface';
import { possess } from './auth.service';

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
  if (!req.user.id) {
    next(new Error('UNAUTHORIZED'));
  }
  next();
};

/**
 * 访问控制
 */
interface AccessControlOptions {
  possession?: boolean;
}

export const accessControl = (options: AccessControlOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log('访问控制');
    const { possession } = options;
    const { id: userId } = req.user;
    if (userId == 1) return next();
    const resourceIdParam = Object.keys(req.params)[0];
    const resourceType = resourceIdParam.replace('Id', '');
    const resourceId = parseInt(req.params[resourceIdParam], 10);
    if (possession) {
      try {
        const ownResource = await possess({ resourceId, resourceType, userId });
        if (!ownResource) {
          return next(new Error('USER_DOES_NOT_OWN_RESOURCE'));
        }
      } catch (error) {
        next(error);
      }
    }
    next();
  };
};

/**
 * 当前用户
 */
export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let user: TokenPayload = {
    id: null,
    name: 'anonymous',
  };
  try {
    const authorization = req.header('Authorization');
    const token = authorization.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, PUBLIC_KEY, {
        algorithms: ['RS256'],
      });
      user = decoded as TokenPayload;
    }
  } catch (error) {}
  req.user = user;
  next();
};
