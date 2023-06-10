const ClientError = require('./ClientEroor');

class AuthorizationError extends ClientError {
  constructor(mesage) {
    super(mesage, 403);
    this.name = 'AuthorizationError';
  }
}
module.exports = AuthorizationError;
