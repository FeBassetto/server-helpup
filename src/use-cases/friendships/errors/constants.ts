export const friendshipErrorsConstants = {
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

export type FriendshipErrorKeys = keyof typeof friendshipErrorsConstants

export type FriendshipErrorInfo =
  (typeof friendshipErrorsConstants)[FriendshipErrorKeys]

export type FriendshipErrorType =
  (typeof friendshipErrorsConstants)[FriendshipErrorKeys]['type']
