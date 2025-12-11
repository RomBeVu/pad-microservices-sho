// auth-service/tests/jwtHelper.test.js
const { generateToken, verifyToken } = require('../utils/jwtHelper');

describe('jwtHelper', () => {
  it('should generate a valid JWT token with correct payload', () => {
    const user = {
      _id: '1234567890',
      username: 'roman',
      email: 'roman@example.com',
    };

    const token = generateToken(user);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const payload = verifyToken(token);

    expect(payload.userId).toBe(user._id);
    expect(payload.username).toBe(user.username);
    expect(payload.email).toBe(user.email);
    // у токена должны быть стандартные поля iat, exp
    expect(payload.iat).toBeDefined();
    expect(payload.exp).toBeDefined();
  });
});
