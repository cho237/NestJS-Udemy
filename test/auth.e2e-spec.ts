import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentification system (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const email = 't2est12@test.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '1234' })
      .expect(201)
      .then((result) => {
        const { id, email } = result.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('signup as new user then get the currently logged in user', async () => {
    const email = 't223est@test.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '1234' })
      .expect(201);

    const cookie = res.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
