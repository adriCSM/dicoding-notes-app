const ClientError = require('../../exceptions/ClientEroor');

class UserHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }

  async postUserHandler(request, h) {
    try {
      this.validator.validateUserPayload(request.payload);
      const { username, password, fullname } = request.payload;
      const userId = await this.service.addUser({ username, password, fullname });
      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Server error',
      });
      response.code(500);
      console.log(`POST USER: ${error.message}`);
      return response;
    }
  }

  async getUserByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const user = await this.service.getUserById(id);
      return {
        status: 'success',
        data: {
          user,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Server error',
      });
      response.code(500);
      console.log(`GET USER BY ID: ${error.message}`);
      return response;
    }
  }
}

module.exports = UserHandler;
