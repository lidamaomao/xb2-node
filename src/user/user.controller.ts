import { Request, Response, NextFunction } from 'express';
import { UserModel } from './user.model';
import * as userServive from './user.service';

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
