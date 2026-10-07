//
//Interview Question - "How would you test a service without hitting the database?"
//Expected answer - Mock Prisma, Mock bcrypt,Mock external dependencies, Test only the business logic
//we are mocking the service file instead of directlyy hitting the DB, in case prisma or service is down we can mock it.

const bcrypt = require('bcrypt');
const prisma = require('../../config/prisma');

const {
  registerUser
} = require('../services/authService');

jest.mock('bcrypt');

jest.mock('../../config/prisma', () => ({
  user: {
    create: jest.fn()
  }
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test('registerUser should hash password and create user', async () => {

  bcrypt.hash.mockResolvedValue('hashed-password');

  prisma.user.create.mockResolvedValue({
    user_id: 1,
    user_name: 'Manish',
    user_email: 'manish@example.com',
    password: 'hashed-password',
    user_role: 'user'
  });

  const result = await registerUser({
    user_name: 'Manish',
    user_email: 'manish@example.com',
    password: 'Password@123'
  });

  expect(bcrypt.hash).toHaveBeenCalledWith(
    'Password@123',
    10
  );

  expect(prisma.user.create).toHaveBeenCalledWith({
    data: {
      user_name: 'Manish',
      user_email: 'manish@example.com',
      password: 'hashed-password',
      user_role: 'user'
    }
  });

  expect(result).toEqual({
    user_id: 1,
    user_name: 'Manish',
    user_email: 'manish@example.com',
    password: 'hashed-password',
    user_role: 'user'
  });

});

test('registerUser should throw error when prisma create fails', async () => {

  bcrypt.hash.mockResolvedValue('hashed-password');

  prisma.user.create.mockRejectedValue(
    new Error('Database error')
  );

  await expect(
    registerUser({
      user_name: 'Manish',
      user_email: 'manish@example.com',
      password: 'Password@123'
    })
  ).rejects.toThrow('Database error');

});