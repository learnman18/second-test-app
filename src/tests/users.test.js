const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const prisma = require('../../config/prisma');

afterAll(async () => {
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

//here we are not mocking the data but here we are using real data and real databse unlink mocking which uses fake
//function and fake data.

describe('Users API', () => {
  test('GET /users without token should return 500', async () => {
    const response = await request(app).get('/users');

    expect(response.statusCode).toBe(500);
  });

  test('GET /users with valid token should return 200', async () => {
    const email = `users_${Date.now()}@example.com`;
    //here we are creating one record and keeping it in DB to keep the record more than one, or else test cases will fail because the response count
    //will be 0 and we are checking that the response count should be greater than 0.
    await request(app)
      .post('/auth/register')
      .send({
        user_name: 'Test User',
        user_email: email,
        password: 'Password@123'
      });

    const token = jwt.sign(
      {
        user_id: 1,
        user_role: 'admin'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '2h'
      }
    );

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    console.log('response.body', response.body);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    expect(response.body.length).toBeGreaterThan(0);

    response.body.forEach((user) => {
      expect(user).toHaveProperty('user_id');
      expect(user).toHaveProperty('user_name');
      expect(user).toHaveProperty('user_email');
    });
  });

  test('GET /users with invalid token should return 500', async () => {
    const token = 'invalid-token';

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
  });

  test('GET /users with expired token should return 500', async () => {
    const token = jwt.sign(
      {
        user_id: 1,
        user_role: 'admin'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '-1s'
      }
    );

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
  });

  test('GET /users page 1 and page 2 should return different users', async () => {
    const token = jwt.sign(
      {
        user_id: 1,
        user_role: 'admin'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    const page1 = await request(app)
      .get('/users?page=1&limit=3')
      .set('Authorization', `Bearer ${token}`);

    const page2 = await request(app)
      .get('/users?page=2&limit=3')
      .set('Authorization', `Bearer ${token}`);

    expect(page1.statusCode).toBe(200);
    expect(page2.statusCode).toBe(200);

    const page1Ids = page1.body.map(user => user.user_id);
    const page2Ids = page2.body.map(user => user.user_id);

    //checks that page 1 doesn't contain all of the IDs from page 2. means that page 1 and page 2 should have different users.
    // expect(page1Ids).not.toEqual(expect.arrayContaining(page2Ids));

    //Every ID returned on page 2 must NOT exist on page 1. means not even signler ID should be same on page 1 and page 2. 
    page2Ids.forEach((id) => {
      expect(page1Ids).not.toContain(id);
    });
  });

  test('GET /users with page 0 should return 400', async () => {
    const token = jwt.sign(
      {
        user_id: 1,
        user_role: 'admin'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    const response = await request(app)
      .get('/users?page=0&limit=3')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid page or limit parameter');
  });

  test('GET /users with limit 0 should return 400', async () => {
    const token = jwt.sign(
      {
        user_id: 1,
        user_role: 'admin'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    const response = await request(app)
      .get('/users?page=1&limit=0')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid page or limit parameter');
  });

  test('GET /users with invalid sort field should return 400', async () => {
    const token = jwt.sign(
      {
        user_id: 1,
        user_role: 'admin'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    const response = await request(app)
      .get('/users?sortBy=password')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid sort field');
  });

  test('GET /users with invalid order should return 400', async () => {
    const token = jwt.sign(
      {
        user_id: 1,
        user_role: 'admin'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    const response = await request(app)
      .get('/users?sortBy=user_name&order=random')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid order parameter/order');
  });

  test('GET /users should return users sorted by name ascending', async () => {
    const token = jwt.sign(
      {
        user_id: 1,
        user_role: 'admin'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    const response = await request(app)
      .get('/users?sortBy=user_name&order=asc')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    for (let i = 1; i < response.body.length; i++) {
      expect(
        response.body[i].user_name.localeCompare(
          response.body[i - 1].user_name
        )
      ).toBeGreaterThanOrEqual(0);
    }
  });

  test('GET /users should return users sorted by name descending', async () => {
    const token = jwt.sign(
      {
        user_id: 1,
        user_role: 'admin'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    const response = await request(app)
      .get('/users?sortBy=user_name&order=desc')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    for (let i = 1; i < response.body.length; i++) {
      expect(
        response.body[i].user_name.localeCompare(
          response.body[i - 1].user_name
        )
      ).toBeLessThanOrEqual(0);
    }
  });

  test('GET /users with search should return matching users', async () => {
    const token = jwt.sign(
      {
        user_id: 1,
        user_role: 'admin'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    const response = await request(app)
      .get('/users?search=John')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    response.body.forEach((user) => {
      expect(
        user.user_name.toLowerCase()
      ).toContain('manish');
    });
  });

  test('GET /users should return stores and store count', async () => {
    const token = jwt.sign(
      {
        user_id: 1,
        user_role: 'admin'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    response.body.forEach((user) => {
      expect(user).toHaveProperty('stores');
      expect(Array.isArray(user.stores)).toBe(true);

      expect(user).toHaveProperty('_count');
      expect(user._count).toHaveProperty('stores');
      expect(typeof user._count.stores).toBe('number');
    });
  });

});
