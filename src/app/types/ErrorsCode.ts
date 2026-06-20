export const ERRORS_CODES = {
  auth: {
    emailAlreadyInUse: 'auth/email-already-in-use',
    userNotFound: 'auth/user-not-found',
    tooManyRequests: 'auth/too-many-requests',
    invalidCredential: 'auth/invalid-credential'
  }
} as const;