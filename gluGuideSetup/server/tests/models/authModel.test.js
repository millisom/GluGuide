const User = require('../../models/authModel');
const pool = require('../../config/db');
const argon2 = require('argon2');

// Mock the pool
jest.mock('../../config/db', () => ({
  query: jest.fn(),
}));

// Mock argon2
jest.mock('argon2');

describe('User Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user and return the inserted user', async () => {
      const mockUser = { username: 'hossay', email: 'hossay@example.com', terms_accepted: true };
      const hashedPassword = 'hashedPassword';
      const mockResult = { rows: [mockUser] };

      argon2.hash.mockResolvedValue(hashedPassword);
      pool.query.mockResolvedValue(mockResult);

      const result = await User.createUser('hossay', 'hossay@example.com', 'password123', true);

      expect(argon2.hash).toHaveBeenCalledWith('password123');
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO users (username, email, password_hash, terms_accepted) VALUES ($1, $2, $3, $4) RETURNING *',
        ['hossay', 'hossay@example.com', hashedPassword, true]
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('findUserByEmail', () => {
    it('should return the user found by email', async () => {
      const mockUser = { email: 'hossay@example.com' };
      pool.query.mockResolvedValue({ rows: [mockUser] });

      const result = await User.findUserByEmail('hossay@example.com');
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = $1',
        ['hossay@example.com']
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserByUsername', () => {
    it('should return user by username', async () => {
      const mockResult = { rows: [{ username: 'hossay' }] };
      pool.query.mockResolvedValue(mockResult);

      const result = await User.getUserByUsername('hossay');
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id, username, password_hash FROM users WHERE username = $1',
        ['hossay']
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('forgotPassword', () => {
    it('should return user for password reset', async () => {
      const mockResult = { rows: [{ email: 'hossay@example.com' }] };
      pool.query.mockResolvedValue(mockResult);

      const result = await User.forgotPassword('hossay@example.com');
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = $1',
        ['hossay@example.com']
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('passwordToken', () => {
    it('should update password reset token', async () => {
      const mockResult = { rowCount: 1 };
      pool.query.mockResolvedValue(mockResult);

      const result = await User.passwordToken('sometoken', '2025-04-30', 'hossay@example.com');
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE email = $3',
        ['sometoken', '2025-04-30', 'hossay@example.com']
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('verifyResetToken', () => {
    it('should return user if token is valid and not expired', async () => {
      const mockResult = { rows: [{ username: 'hossay' }] };
      pool.query.mockResolvedValue(mockResult);

      const result = await User.verifyResetToken('validtoken');
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()',
        ['validtoken']
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('updatePassword', () => {
    it('should update password for the given username', async () => {
      const mockResult = { rowCount: 1 };
      pool.query.mockResolvedValue(mockResult);

      const result = await User.updatePassword('hossay', 'newHashedPassword');
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE users SET password_hash = $1 WHERE username = $2',
        ['newHashedPassword', 'hossay']
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('clearResetToken', () => {
    it('should clear password reset token and expiry', async () => {
      const mockResult = { rowCount: 1 };
      pool.query.mockResolvedValue(mockResult);

      const result = await User.clearResetToken('hossay');
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE users SET password_reset_token = NULL, password_reset_expires = NULL WHERE username = $1',
        ['hossay']
      );
      expect(result).toEqual(mockResult);
    });
  });
});
