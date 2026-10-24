export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: number
  updatedAt: number
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  firstName: string
  lastName: string
  email: string
  password: string
}
