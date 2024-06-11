
import { CreateClientDto } from './create-client.dto';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateClientDto extends PartialType(CreateClientDto) {}
