const errorHandler = require('../middleware/errorHandler');

describe('errorHandler', () => {
  let response;
  let consoleError;
  let consoleLog;

  beforeEach(() => {
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
    consoleLog.mockRestore();
  });

  test.each([
    ['JsonWebTokenError', 'Invalid token'],
    ['NotBeforeError', 'Token is not active'],
    ['TokenExpiredError', 'Token has expired'],
  ])('returns 401 for %s', (name, message) => {
    const error = Object.assign(new Error(message), { name });

    errorHandler(error, {}, response, jest.fn());

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({
      status: 'fail',
      message,
    });
  });
});
