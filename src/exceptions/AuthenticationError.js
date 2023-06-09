const ClientError = require('./ClientEroor');

class AuthenticationError extends ClientError {
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationsError';
  }
}
module.exports = AuthenticationError;
