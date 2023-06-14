const ClientError = require('../../exceptions/ClientEroor');

class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._Validator = validator;
  }

  async postExportNotesHandler(request, h) {
    try {
      this._Validator.validateExportNotesPayload(request.payload);
      const message = {
        userId: request.auth.credentials,
        targetEmail: request.payload.targetEmail,
      };

      await this._service.sendMessage('export:notes', JSON.stringify(message));
      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
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
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = ExportsHandler;
