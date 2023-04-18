const {formatValidationError} = require('../../utils/mongoose.util');
it('formatValidationError function should correctly format validation errors', () => {
    const err = {
      errors: {
        username: {
          message: 'Sorry but you need to be registered to send a letter to Santa',
          name: 'ValidatorError',
          properties: {
            message: 'Sorry but you need to be registered to send a letter to Santa',
            type: 'required',
            path: 'username'
          },
          kind: 'required',
          path: 'username'
        },
        message: {
          message: 'Path `message` is required.',
          name: 'ValidatorError',
          properties: {
            message: 'Path `message` is required.',
            type: 'required',
            path: 'message'
          },
          kind: 'required',
          path: 'message'
        }
      },
      _message: 'Letter validation failed',
      message: 'Letter validation failed: username: Sorry but you need to be registered to send a letter to Santa, message: Path `message` is required.',
      name: 'ValidationError'
    };
  
    const expectedErrors = {
      username: 'Sorry but you need to be registered to send a letter to Santa',
      message: 'Path `message` is required.'
    };
  
    const actualErrors = formatValidationError(err);
  
    expect(actualErrors).toEqual(expectedErrors);
  });
  