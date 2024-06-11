import { CookieOptions, Response } from "express"

export type TCookieParameters = {
  res: Response,
  name: string,
  value: string,
  options?: CookieOptions
}