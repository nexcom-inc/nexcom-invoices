export interface UserData {
  id: string
  email: string
  name?: string
  // Ajoutez d'autres propriétés selon vos besoins
}

export interface ApiError {
  statusCode: number
  message: string
  details?: {
    message: string
    statusCode: number
  }
}
