export const usersErrorsConstants = {
  UNCONFIRMED_EMAIL: {
    type: 'UNCONFIRMED_EMAIL',
    code: 403,
    message: 'Por favor, confirme seu e-mail para acessar sua conta.',
  },
  SEND_EMAIL_FAILED: {
    type: 'SEND_EMAIL_FAILED',
    code: 500,
    message: 'Ocorreu um erro ao enviar o e-mail. Tente novamente mais tarde.',
  },
  DELETED_USER: {
    type: 'DELETED_USER',
    code: 403,
    message:
      'A conta associada foi desativada. Entre em contato com o suporte se isso for um erro.',
  },
  INVALID_CREDENTIALS: {
    type: 'INVALID_CREDENTIALS',
    code: 401,
    message: 'E-mail ou senha inválidos. Por favor, tente novamente.',
  },
  ACCOUNT_NOT_FOUND: {
    type: 'ACCOUNT_NOT_FOUND',
    code: 404,
    message:
      'Conta não encontrada. Verifique as informações fornecidas e tente novamente.',
  },
  ACCOUNT_EMAIL_ALREADY_EXISTS: {
    type: 'ACCOUNT_EMAIL_ALREADY_EXISTS',
    code: 409,
    message: 'O e-mail fornecido já está associado a uma conta existente.',
  },
  ACCOUNT_NICK_ALREADY_EXISTS: {
    type: 'ACCOUNT_NICK_ALREADY_EXISTS',
    code: 409,
    message:
      'O nick escolhido já está em uso. Por favor, escolha um diferente.',
  },
  INVALID_ADDRESS: {
    type: 'INVALID_ADDRESS',
    code: 400,
    message:
      'O endereço fornecido é inválido. Por favor, verifique e tente novamente.',
  },
} as const

export type UserErrorKeys = keyof typeof usersErrorsConstants

export type ErrorInfo = (typeof usersErrorsConstants)[UserErrorKeys]

// Se você precisar de um tipo que inclua o campo 'type', você pode criar um novo tipo:
export type ErrorType = (typeof usersErrorsConstants)[UserErrorKeys]['type']
