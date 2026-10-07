const { loginUserController } = require('../controllers/authController');
const { loginUser } = require('../services/authService');

//we are writing the test cases for controller with the help of mock data, here we ae not using the real data
//flow --> Controller --> MOCK loginUser() --> "fake-jwt-token"
//no DB, no bcrypt, no JWT, no real data, just mock data and mock function to test the controller.

//if we write the test cases with real data the flow will be little differnet.
//flow --> Controller --> loginUser() --> Prisma --> PostgreSQL
//and when we go by this flow we will have all the DB, bcrypt, JWT and real data.
jest.mock('../services/authService.js');

beforeEach(() => {
  jest.clearAllMocks();
});

test('loginUserController should return token when login is successful', async () => {
  loginUser.mockResolvedValue('fake-jwt-token');

  const req = {
    body: {
      user_email: 'test@example.com',
      password: 'Password@123'
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await loginUserController(req, res);

  expect(loginUser).toHaveBeenCalledWith({
    user_email: 'test@example.com',
    password: 'Password@123'
  });

  expect(res.status).toHaveBeenCalledWith(200);

  expect(res.json).toHaveBeenCalledWith({
    message: 'User logged in',
    token: 'fake-jwt-token'
  });

});

test('loginUserController should return 400 when login fails', async () => {
  loginUser.mockRejectedValue(new Error('Invalid password'));

  const req = {
    body: {
      user_email: 'test@example.com',
      password: 'WrongPassword'
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await loginUserController(req, res);

  expect(loginUser).toHaveBeenCalledWith({
    user_email: 'test@example.com',
    password: 'WrongPassword'
  });

  expect(res.status).toHaveBeenCalledWith(400);

  expect(res.json).toHaveBeenCalledWith({
    message: 'Error logging in user',
    error: 'Invalid password'
  });
});

test('loginUserController should return 400 when login fails', async () => {
  loginUser.mockRejectedValue(new Error('Invalid password'));

  const req = {
    body: {
      user_email: 'test@example.com',
      password: 'WrongPassword'
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await loginUserController(req, res);

  expect(loginUser).toHaveBeenCalledWith({
    user_email: 'test@example.com',
    password: 'WrongPassword'
  });

  expect(res.status).toHaveBeenCalledWith(400);

  expect(res.json).toHaveBeenCalledWith({
    message: 'Error logging in user',
    error: 'Invalid password'
  });
});