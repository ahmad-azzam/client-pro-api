import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateProjectDto {
  @Field()
  @IsNotEmpty()
  id: string;

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
  costs: number;

  @Field()
  @IsNotEmpty()
  status: string;

  @Field()
  @IsNotEmpty()
  members: string[];
}
