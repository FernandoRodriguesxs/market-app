// Global types and interfaces

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: {
    id: string
    email: string
  }
}

export interface SessionPayload {
  userId: string
  email: string
}
