import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

@InputType()
export class DocumentDto {
  @Field()
  @ValidateIf((obj) => obj.access)
  @IsNotEmpty()
  access: string[];

  @Field()
  @ValidateIf((obj) => obj.name)
  @IsNotEmpty()
  name: string;
}
