export const notificationErrorsConstants = {
  ACTION_NOT_ALLOWED: {
    type: 'ACTION_NOT_ALLOWED',
    code: 403,
    message:
      'Você não tem permissão para executar esta ação. Verifique suas permissões ou entre em contato com o suporte.',
  },
} as const

export type NotificationErrorKeys = keyof typeof notificationErrorsConstants

export type NotificationErrorInfo =
  (typeof notificationErrorsConstants)[NotificationErrorKeys]

export type NotificationErrorType =
  (typeof notificationErrorsConstants)[NotificationErrorKeys]['type']
