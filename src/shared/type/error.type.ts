export type TError = {
  message: string | null
  messageCode: string 
  lang?: string
}

export type TErrorGraphql = {
  message: string,
  messageCode: string
  statusCode: number
}