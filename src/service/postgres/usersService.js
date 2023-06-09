const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

const bcrypt = require('bcrypt');

class UsersService {
  constructor() {
    this.pool = new Pool();
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username=$1',
      values: [username],
    };

    const result = await this.pool.query(query);
    if (result.rows.length) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }

  // ADD USER
  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO users VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
      values: [id, username, hash, fullname, createdAt, updatedAt],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan user');
    }

    return result.rows[0].id;
  }

  // GET USER
  async getUserById(userId) {
    const query = {
      text: 'SELECT id,username,fullname FROM users WHERE id=$1',
      values: [userId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id,password FROM users WHERE username=$1',
      values: [username],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, password: hashPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashPassword);
    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }
    return id;
  }
}
module.exports = UsersService;
