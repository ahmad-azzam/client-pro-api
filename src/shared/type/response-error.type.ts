import { TError } from './error.type';
import { TResponse } from './response.type';

export type TResponseError = TResponse & { error: TError };
