export const successResponse = (message: string, data: any = null, code = 200) => {
  return {
    status: 'success',
    code,
    message,
    data,
  }
}

export const errorResponse = (message: string, code = 500) => {
  return {
    status: 'error',
    code,
    message,
  }
}
