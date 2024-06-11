import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

@InputType()
export class CreateClientDto {
  @Field()
  @ValidateIf((obj) => obj.full_name)
  @IsNotEmpty()
  full_name: string;

  @Field()
  @ValidateIf((obj) => obj.company_name)
  @IsNotEmpty()
  company_name: string;

  @Field()
  @ValidateIf((obj) => obj.phone_number)
  @IsNotEmpty()
  phone_number: string;

  @Field()
  @ValidateIf((obj) => obj.address)
  @IsNotEmpty()
  address: string;

  @Field()
  @ValidateIf((obj) => obj.email)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @ValidateIf((obj) => obj.nationality)
  @IsNotEmpty()
  nationality: string;

  @Field()
  @ValidateIf((obj) => obj.note)
  @IsString()
  note: string;

  @Field()
  @ValidateIf((obj) => obj.document_name)
  @IsString()
  document_name: string;
}
