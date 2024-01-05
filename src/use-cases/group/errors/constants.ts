export const groupErrorsConstants = {
  ACTION_NOT_ALLOWED: {
    type: 'ACTION_NOT_ALLOWED',
    code: 403,
    message:
      'Você não tem permissão para executar esta ação. Verifique suas permissões ou entre em contato com o suporte.',
  },
  NOT_FRIENDS: {
    type: 'NOT_FRIENDS',
    code: 403,
    message:
      'Acesso negado. Você precisa ser amigo do usuário para visualizar seus grupos.',
  },
  NOT_FOUND: {
    type: 'NOT_FOUND',
    code: 404,
    message:
      'O grupo especificado não foi encontrado. Por favor, verifique se o ID está correto ou tente novamente mais tarde.',
  },
  GROUP_ALREADY_EXISTS: {
    type: 'GROUP_ALREADY_EXISTS',
    code: 409,
    message:
      'Um grupo com este nome já existe. Por favor, escolha um nome diferente para prosseguir.',
  },
  GROUP_NOT_EXISTS: {
    type: 'GROUP_NOT_EXISTS',
    code: 404,
    message:
      'O grupo solicitado não foi encontrado. Por favor, verifique se o nome do grupo está correto e tente novamente.',
  },
  USER_ALREADY_GROUP_PARTICIPANT: {
    type: 'USER_ALREADY_GROUP_PARTICIPANT',
    code: 404,
    message:
      'Operação não realizada: O usuário já é um membro ativo deste grupo.',
  },
} as const

export type GroupErrorKeys = keyof typeof groupErrorsConstants

export type GroupErrorInfo = (typeof groupErrorsConstants)[GroupErrorKeys]

export type GroupErrorType =
  (typeof groupErrorsConstants)[GroupErrorKeys]['type']
