const routes = require('./routes');
const AuthenticationHandler = require('./handler');

module.exports = {
  name: 'authentications',
  versiom: '1.0.0',
  register: async (server, { authenticationsService, usersService, tokenManager, validator }) => {
    const authenticationsHandler = new AuthenticationHandler(authenticationsService, usersService, tokenManager, validator);
    await server.route(routes(authenticationsHandler));
  },
};
