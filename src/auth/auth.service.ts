import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../app/app.config';
import { connection } from '../app/database/mysql';

/**
 * 签发令牌
 */
interface SignTokenOptions {
  payload?: any;
}

export const SignToken = (options: SignTokenOptions) => {
  const { payload } = options;
  const token = jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256' });
  return token;
};

/**
 * 检查用户是否拥有指定资源
 */
interface PossessOptions {
  resourceId: number;
  resourceType: string;
  userId: number;
}

export const possess = async (options: PossessOptions) => {
  const { resourceId, resourceType, userId } = options;
  const statement = `SELECT COUNT(${resourceType}.id) as count
  FROM ${resourceType} WHERE ${resourceType}.id = ? AND userId = ?
  `;
  const [data] = await connection
    .promise()
    .query(statement, [resourceId, userId]);
  return data[0].count ? true : false;
};
