import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class CreateProjectDto {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  goals: string;

  @Field()
  @IsNotEmpty()
  deadline: Date;

  @Field()
  @IsNotEmpty()
  start_date: Date;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  costs: number;

  @Field()
  @IsNotEmpty()
  status: string;

  @Field()
  @IsOptional()
  client: string;

  @Field()
  @IsNotEmpty()
  members: string[];
}
