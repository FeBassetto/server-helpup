export const eventErrorsConstants = {
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
      'Acesso negado. Você precisa ser amigo do usuário para visualizar seus eventos.',
  },
  NOT_FOUND: {
    type: 'NOT_FOUND',
    code: 404,
    message:
      'O evento especificado não foi encontrado. Por favor, verifique se o ID está correto ou tente novamente mais tarde.',
  },
  EVENT_NOT_EXISTS: {
    type: 'EVENT_NOT_EXISTS',
    code: 404,
    message:
      'O evento solicitado não foi encontrado. Por favor, verifique se o nome do evento está correto e tente novamente.',
  },
  EVENT_ALREADY_EXISTS: {
    type: 'EVENT_ALREADY_EXISTS',
    code: 409,
    message:
      'Já existe um evento com esse nome. Por favor, escolha um nome diferente.',
  },
  USER_ALREADY_EVENT_PARTICIPANT: {
    type: 'USER_ALREADY_EVENT_PARTICIPANT',
    code: 404,
    message:
      'Operação não realizada: O usuário já é um membro ativo deste evento.',
  },
} as const

export type EventErrorKeys = keyof typeof eventErrorsConstants

export type EventErrorInfo = (typeof eventErrorsConstants)[EventErrorKeys]

export type EventErrorType =
  (typeof eventErrorsConstants)[EventErrorKeys]['type']
