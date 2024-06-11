import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TError, TResponse, TResponseData, TResponseError } from '../type';

@Injectable()
export class ResponseService {
  private apiVersion: string;

  constructor(private configService: ConfigService) {
    this.apiVersion = this.configService.get<string>('API_VERSION');
  }

  private generateResponse(status: number, success: boolean): TResponse {
    return {
      apiVersion: this.apiVersion,
      success,
      status,
      timestamp: new Date().toString(),
    };
  }

  success(status: number, data: any): TResponseData {
    return {
      ...this.generateResponse(status, true),
      data,
    };
  }

  successWithPagination() {}

  successWithoutData(): TResponse {
    return this.generateResponse(204, true);
  }

  error(status: number, error: TError): TResponseError {
    return {
      ...this.generateResponse(status, false),
      error,
    };
  }
}
