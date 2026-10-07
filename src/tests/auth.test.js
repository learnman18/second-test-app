const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const prisma = require('../../config/prisma');

afterAll(async () => {
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('Auth Endpoints', () => {
  test('POST /auth/register should register a new user', async () => {
    const email = `test_${Date.now()}@example.com`; // we are using Date.now() to ensure a unique email for each test run.

    const response = await request(app)
      .post('/auth/register')
      .send({
        user_name: 'Test User',
        user_email: email,
        password: 'Password@123'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User registered');

    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('user_id');
    expect(response.body.user.user_name).toBe('Test User');
    expect(response.body.user.user_email).toBe(email);
  });

  test('POST /auth/register with duplicate email should return 400', async () => {
    const email = `duplicate_${Date.now()}@example.com`;

    // First registration
    const firstResponse = await request(app)
      .post('/auth/register')
      .send({
        user_name: 'First User',
        user_email: email,
        password: 'Password@123'
      });

    expect(firstResponse.statusCode).toBe(201);

    // Second registration with the same email
    const secondResponse = await request(app)
      .post('/auth/register')
      .send({
        user_name: 'Second User',
        user_email: email,
        password: 'Password@456'
      });

    expect(secondResponse.statusCode).toBe(400);
    expect(secondResponse.body.message).toBe('Error registering user');
  });

  test('POST /auth/login should login user and return token', async () => {
    const email = `login_${Date.now()}@example.com`;
    const password = 'Password@123';

    // Register user first
    await request(app)
      .post('/auth/register')
      .send({
        user_name: 'Login Test User',
        user_email: email,
        password
      });

    // Login
    const response = await request(app)
      .post('/auth/login')
      .send({
        user_email: email,
        password
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User logged in');

    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
  });

  test('POST /auth/login with invalid email should return 400', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        user_email: `does_not_exist_${Date.now()}@example.com`,
        password: 'Password@123'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Error logging in user');
    expect(response.body.error).toBe('Invalid email');
  });

  test('POST /auth/login with invalid password should return 400', async () => {
    const email = `wrong_password_${Date.now()}@example.com`;

    await request(app)
      .post('/auth/register')
      .send({
        user_name: 'Wrong Password User',
        user_email: email,
        password: 'CorrectPassword@123'
      });

    const response = await request(app)
      .post('/auth/login')
      .send({
        user_email: email,
        password: 'WrongPassword@123'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Error logging in user');
    expect(response.body.error).toBe('Invalid password');
  });
  test('POST /auth/login should return JWT with correct user data', async () => {
    const email = `jwt_${Date.now()}@example.com`;
    const password = 'Password@123';

    const registerResponse = await request(app)
      .post('/auth/register')
      .send({
        user_name: 'JWT Test User',
        user_email: email,
        password
      });

    const userId = registerResponse.body.user.user_id;

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        user_email: email,
        password
      });

    expect(loginResponse.statusCode).toBe(200);

    const token = loginResponse.body.token;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    expect(decoded.userId).toBe(userId);
    expect(decoded.userEmail).toBe(email);
    expect(decoded.userRole).toBe('user');
  });
});