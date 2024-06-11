import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/shared/strategy';
import { PassportModule } from '@nestjs/passport';
import { EmployeeService } from '../employee/employee.service';
import { TokenService } from '../token/token.service';
import { UtilsModule } from 'src/shared/utils/utils.module';

@Module({
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    EmployeeService,
    TokenService,
  ],
  imports: [
    UtilsModule,
    JwtModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
  ],
})
export class AuthModule {}
