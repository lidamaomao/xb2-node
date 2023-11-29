import { Request, Response, NextFunction } from 'express';
import { SignToken } from './auth.service';

/**
 * 用户登录
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    user: { id, name },
  } = req.body;
  const payload = { id, name };
  try {
    const token = SignToken({ payload });
    res.send({ id, name, token });
  } catch (error) {
    next(error);
  }
};

/**
 * 验证登录
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.user);
  res.sendStatus(200);
};
