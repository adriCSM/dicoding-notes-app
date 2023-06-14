const ClientError = require('../../exceptions/ClientEroor');

class AuthenticationHandler {
  constructor(authenticationsService, usersService, tokenManger, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManger;
    this._validator = validator;
  }

  async postAuthenticationHandler(request, h) {
    try {
      // validasi payload
      this._validator.validatePostAuthenticationPaylod(request.payload);
      const { username, password } = request.payload;
      // cek apakah user ada didalam database
      const id = await this._usersService.verifyUserCredential(username, password);
      // generate refreshtoken dan accesstoken
      const refreshToken = this._tokenManager.generetRefreshToken({ id });
      const accessToken = this._tokenManager.generetAccessToken({ id });
      // menambahkan refreshToken kedalam database
      await this._authenticationsService.addRefreshToken(refreshToken);
      const response = h.response({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken,
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
        message: 'Maaf, terjadi kegagalan pada server kami',
      });
      response.code(500);
      console.log(`POST AUTH: ${error.message}`);
      return response;
    }
  }

  async putAuthenticationHandler(request, h) {
    try {
      this._validator.validatePutAuthenticationPayload(request.payload);
      const { refreshToken } = request.payload;
      // mengecek apaka refreshToken payload ada di database atau tidak
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      // mengecek apakah refreshtoken memiliki signiture yang sama pada database
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
      // memperbarui access token
      const accessToken = this._tokenManager.generetAccessToken({ id });
      return {
        status: 'success',
        message: 'Access Token berhasil diperbarui',
        data: {
          accessToken,
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
        message: 'Maaf, terjadi kegagalan pada server kami',
      });
      response.code(500);
      console.log(`POST AUTH: ${error.message}`);
      return response;
    }
  }

  async deleteAuthenticationHandler(request, h) {
    try {
      this._validator.validateDeleteAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus',
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
        message: 'Maaf, terjadi kegagalan pada server kami',
      });
      response.code(500);
      console.log(`DELETE AUTH: ${error.message}`);
      return response;
    }
  }
}
module.exports = AuthenticationHandler;
