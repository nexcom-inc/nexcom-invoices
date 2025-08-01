export type ApiErrorResponse = {
    message: string,
    statusCode: number,
    details?: {
      message: string,
      statusCode: number,
    }
}

export type ApiSuccessResponse<T> = {
    message: string,
    statusCode: number,
    data: T
    pagination?: {
      page: number,
      limit: number,
      total: number
    }
}