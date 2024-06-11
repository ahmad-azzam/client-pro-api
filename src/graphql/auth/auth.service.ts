import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDecipheriv, createHmac, scrypt } from 'crypto';
import { promisify } from 'util';
import * as bcrypt from 'bcrypt';
import { TEmployee, TJwtPayload, TLoginPayload } from './type';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { EmployeeService } from '../employee/employee.service';
import { TokenService } from '../token/token.service';
import { UtilsService } from 'src/shared/utils/utils.service';
import { CookieName } from 'src/shared/enum';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private employeeService: EmployeeService,
    private tokenService: TokenService,
    private utilsService: UtilsService,
  ) {}

  async getKey() {
    const key = (await promisify(scrypt)(
      this.configService.get<string>('KEY_PASSWORD'),
      'salt',
      32,
    )) as Buffer;

    return key.toString('base64');
  }

  async decryptedData(value: string, res: Response) {
    const data = JSON.parse(atob(value));
    const signature = await this.createSignature(data.encrypted);
    const isValidSignature = data.signature === signature;

    if (!isValidSignature) throw new ForbiddenException();

    const payload = await this.decodeData(data.encrypted);
    const payloadParsed = JSON.parse(payload) as TLoginPayload;

    const employee = await this.checkEmployee(payloadParsed);

    const { access_token, refresh_token } = await this.checkToken(employee);

    await Promise.all([
      this.tokenService.upsertAccessToken(employee.id, access_token),
      this.tokenService.upsertRefreshToken(employee.id, refresh_token),
    ]);

    this.utilsService.setCookie({
      res,
      name: CookieName.ACCESS_TOKEN,
      value: `Bearer ${access_token}`,
    });
  }

  async logout(id: string, res: Response) {
    await this.tokenService.removeTokens(id);

    this.utilsService.clearCookie({ name: 'access_token', res });
  }

  private async checkEmployee({ password, username }: TLoginPayload) {
    const employee = await this.employeeService.findUnique({ username });

    if (!employee) throw new ForbiddenException();

    const isValidPassword = await bcrypt.compare(password, employee.password);

    if (!isValidPassword) throw new ForbiddenException();

    return employee;
  }

  private async checkToken(employee: TEmployee) {
    const token = await this.tokenService.findUniqueAccessToken({
      where: { employee_id: employee.id },
      include: {
        employee: {
          include: { role: true },
        },
      },
    });

    if (token) throw new ForbiddenException('User still logged in');

    const { id, full_name, role_id } = employee;

    return await this.generateToken({ id, full_name, role_id });
  }

  private async generateToken(payload: TJwtPayload) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('SECRET_JWT'),
        expiresIn: Number(
          this.configService.get<string>('EXPIRED_TIME_SECRET'),
        ),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('SECRET_REFRESH_JWT'),
        expiresIn: Number(
          this.configService.get<number>('EXPIRED_TIME_SECRET_REFRESH'),
        ),
      }),
    ]);

    return { access_token, refresh_token };
  }

  private async createSignature(value: string) {
    const key = await this.getKey();
    return createHmac('SHA256', key).update(value).digest('base64');
  }

  private async decodeData(value: string) {
    const key = await this.getKey();
    const dataBuffer = this.base64ToBuffer(value);
    const iv = dataBuffer.slice(0, 16);
    const cipherText = dataBuffer.slice(16, dataBuffer.length);

    const decipher = createDecipheriv(
      'aes-256-ctr',
      this.base64ToBuffer(key),
      iv,
    );

    const decryptedText = Buffer.concat([
      decipher.update(cipherText),
      decipher.final(),
    ]);

    return decryptedText.toString();
  }

  private base64ToBuffer(value: string) {
    const binaryString = atob(value);
    const buffer = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      buffer[i] = binaryString.charCodeAt(i);
    }

    return buffer;
  }
}
