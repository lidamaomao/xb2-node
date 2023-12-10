import { greet } from './playground/demo';
import request from 'supertest';
import app from '../app';
import { connection } from './database/mysql';

/**
 * 单元测试
 */
describe('演示单元测试', () => {
  // 测试
  test('测试 greet 函数', () => {
    const greeting = greet('李大猫');

    // 断言
    expect(greeting).toBe('你好，李大猫');
  });
});

/**
 * 测试接口
 */
describe('演示接口测试', () => {
  afterAll(async () => {
    // 断开数据服务连接
    connection.end();
  });

  test('测试 GET /', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ title: '小白兔的开发之路' });
  });

  test('测试 POST /echo', async () => {
    const response = await request(app)
      .post('/echo')
      .send({ message: '你好 ~' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: '你好 ~' });
  });
});
