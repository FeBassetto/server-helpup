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
  FRIENDSHIP_NOT_ALLOWED: {
    type: 'FRIENDSHIP_NOT_ALLOWED',
    code: 403,
    message: 'Este usuário não pode receber um pedido de amizade.',
  },
  FRIENDSHIP_ALREADY_EXISTS: {
    type: 'FRIENDSHIP_ALREADY_EXISTS',
    code: 403,
    message: 'Uma amizade já existe entre estes usuários.',
  },
  FRIENDSHIP_NOT_ACCEPT: {
    type: 'FRIENDSHIP_NOT_ACCEPT',
    code: 403,
    message:
      'Erro ao mandar um novo pedido de amizade, recarregue a página e tente novamente.',
  },
  FRIENDSHIP_ALREADY_SENT: {
    type: 'FRIENDSHIP_ALREADY_SENT',
    code: 409,
    message:
      'Você já enviou um pedido de amizade para este usuário. Aguarde a resposta antes de enviar outro.',
  },
  FRIENDSHIP_NOT_EXISTS: {
    type: 'FRIENDSHIP_NOT_EXISTS',
    code: 404,
    message:
      'A amizade especificada não foi encontrada. Por favor, verifique e tente novamente.',
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
  FRIENDSHIP_STATUS_ALREADY_UPDATED: {
    type: 'FRIENDSHIP_STATUS_ALREADY_UPDATED',
    code: 400,
    message:
      'O status do pedido de amizade já foi atualizado anteriormente. Não é possível atualizá-lo novamente.',
  },
  ACTION_NOT_ALLOWED_FRIENDSHIP: {
    type: 'ACTION_NOT_ALLOWED_FRIENDSHIP',
    code: 403,
    message:
      'Você não tem permissão para executar esta ação. Verifique suas permissões ou entre em contato com o suporte.',
  },
} as const

export type UserErrorKeys = keyof typeof usersErrorsConstants

export type ErrorInfo = (typeof usersErrorsConstants)[UserErrorKeys]

export type ErrorType = (typeof usersErrorsConstants)[UserErrorKeys]['type']
