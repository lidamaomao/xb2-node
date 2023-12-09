import e, { Request, Response, NextFunction } from 'express';
import { UserModel } from './user.model';
import * as userServive from './user.service';
import _ from 'lodash';

/**
 * 创建用户
 */
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, password } = req.body;
  try {
    const data = await userServive.createUser({ name, password });
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 用户账户
 */
export const show = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  try {
    const user = await userServive.getUserById(parseInt(userId, 10));

    if (!user) {
      return next(new Error('USER_NOT_FOUND'));
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新用户
 */
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.user;
  const userData = _.pick(req.body.update, ['name', 'password']);
  try {
    const data = await userServive.updateUser(id, userData);
    res.send(data);
  } catch (error) {
    next(error);
  }
};
