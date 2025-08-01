export const AUTH_TOKEN_KEY = "access_token"

export const AUTH_STRATEGIES = {
  EMAIL: 'email',
  GOOGLE: 'google',
}

export const LOGIN_URL = process.env.NEXT_PUBLIC_AUTH_CLIENT_URL as string