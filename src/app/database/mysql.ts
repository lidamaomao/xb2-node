import mysql, { ConnectionOptions } from 'mysql2';

import {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_PASSWORD,
} from '../../app/app.config';

/**
 * 创建数据服务连接
 */
const access: ConnectionOptions = {
  host: MYSQL_HOST,
  port: parseInt(MYSQL_PORT, 10),
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
};
export const connection = mysql.createConnection(access);
