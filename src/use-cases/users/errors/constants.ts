export const usersErrorsConstants = {
  UNCONFIRMED_EMAIL: {
    type: 'UNCONFIRMED_EMAIL',
    code: 403,
    message: 'Por favor, confirme seu e-mail para acessar sua conta.',
  },
  UPDATE_GEO_MISSED_PARAMS: {
    type: 'UPDATE_GEO_MISSED_PARAMS',
    code: 400,
    message: 'Você deve fornecer todos os quatro parâmetros ou nenhum deles.',
  },
  PASSWORD_NOT_SAME: {
    type: 'PASSWORD_NOT_SAME',
    code: 400,
    message:
      'As senhas não coincidem. Certifique-se de fornecer a mesma senha nos campos de senha e confirmação de senha.',
  },
  SAME_PASSWORD: {
    type: 'SAME_PASSWORD',
    code: 400,
    message: 'A nova senha não pode ser igual à senha atual.',
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
  SAME_NICK: {
    type: 'SAME_NICK',
    code: 400,
    message:
      'O novo nick escolhido é igual ao seu nick atual. Escolha um nick diferente.',
  },
  INVALID_ADDRESS: {
    type: 'INVALID_ADDRESS',
    code: 400,
    message:
      'O endereço fornecido é inválido. Por favor, verifique e tente novamente.',
  },
  MANY_ATTEMPTS: {
    type: 'MANY_ATTEMPTS',
    code: 429,
    message: 'Muitas tentativas. Tente novamente mais tarde.',
  },
  ACCOUNT_ALREADY_IS_CONFIRMED: {
    type: 'ACCOUNT_ALREADY_IS_CONFIRMED',
    code: 409,
    message:
      'Esta conta já foi confirmada. Não é necessário confirmar novamente.',
  },
  ACCOUNT_ALREADY_IS_DELETED: {
    type: 'ACCOUNT_ALREADY_IS_DELETED',
    code: 409,
    message: 'Esta conta já foi deletada.',
  },
  ADMIN_NOT_ALLOWED_ACTION: {
    type: 'ADMIN_NOT_ALLOWED_ACTION',
    code: 403,
    message: 'Ação não permitida para o administrador.',
  },
  GET_SAME_ACCOUNT_DATA: {
    type: 'GET_SAME_ACCOUNT_DATA',
    code: 403,
    message: 'Você está tentando acessar sua própria página.',
  },
  ACTION_NOT_ALLOWED: {
    type: 'ACTION_NOT_ALLOWED',
    code: 403,
    message:
      'Você não tem permissão para executar esta ação. Verifique suas permissões ou entre em contato com o suporte.',
  },
  UNAUTHORIZED: {
    type: 'UNAUTHORIZED',
    code: 401,
    message: 'Unauthorized',
  },
} as const

export type UserErrorKeys = keyof typeof usersErrorsConstants

export type UserErrorInfo = (typeof usersErrorsConstants)[UserErrorKeys]

export type UserErrorType = (typeof usersErrorsConstants)[UserErrorKeys]['type']
