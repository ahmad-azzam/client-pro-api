import { Injectable } from '@nestjs/common';
import { TCookieParameters } from '../type';
import { FileUpload } from 'graphql-upload-ts';
import { Pagination } from '../enum';
import * as stream from 'stream';
import { CookieOptions } from 'express';
import { ResponsePagination } from 'src/graphql/graphql';

@Injectable()
export class UtilsService {
  private readonly cookieOptionsDefault: CookieOptions = {
    secure: true,
    httpOnly: true,
    signed: true,
  };

  setCookie({
    name,
    res,
    value,
    options = this.cookieOptionsDefault,
  }: TCookieParameters) {
    res.cookie(name, value, options);
  }

  clearCookie({
    name,
    res,
    options = this.cookieOptionsDefault,
  }: Pick<TCookieParameters, 'res' | 'name' | 'options'>) {
    res.clearCookie(name, options);
  }

  async fileToBufferGraphql(file: FileUpload): Promise<Buffer> {
    return await new Promise((resolve) => {
      let dataFile: Buffer;

      file
        .createReadStream()
        .on('data', (data: Buffer) => {
          dataFile = data;
        })
        .on('error', (error) => {
          console.log(error);
        })
        .on('end', () => {
          resolve(dataFile);
        });
    });
  }

  countPageIndex(page_index: number) {
    if (!page_index || page_index < 1) return 0;

    return page_index - 1;
  }

  generateTakeAndSkip(page_index: number, size: number) {
    return {
      skip: this.countPageIndex(page_index),
      take: size ? size : Pagination.SIZE,
    };
  }

  generatePagination(
    totalData: number,
    page_index: number,
    size: number = 10,
  ): ResponsePagination {
    const totalPages = Math.ceil(totalData / size || 1);

    return {
      currentPage: this.countPageIndex(page_index),
      currentSize: size,
      totalPages,
      totalData,
    };
  }

  stream(file: Buffer) {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file);

    return bufferStream;
  }
}
