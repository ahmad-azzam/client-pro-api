import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateFormDto {
  @IsNotEmpty({
    message: i18nValidationMessage('validation.fullName_required'),
  })
  @IsString()
  name: string;

  @IsString()
  company_name: string;

  @IsNotEmpty({ message: 'validation.email_required' })
  @IsEmail({}, { message: 'validation.email_invalid' })
  email: string;

  @IsNotEmpty({ message: 'validation.phoneNumber_required' })
  @IsString()
  phone_number: string;

  @IsNotEmpty({ message: 'validation.projectDesc_required' })
  @IsString()
  project_desc: string;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.location_required'),
  })
  @IsString()
  location: string;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.browser_required'),
  })
  @IsString()
  browser: string;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.os_required'),
  })
  @IsString()
  os: string;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.platform_required'),
  })
  @IsString()
  platform: string;
}
