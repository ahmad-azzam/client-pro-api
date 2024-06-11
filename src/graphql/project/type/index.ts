import { FileUpload } from 'graphql-upload-ts';
import { CreateProjectDto, DocumentDto } from '../dto';
import { CreateClientDto } from 'src/graphql/client/dto';

export type TParameterDocumentProject = {
  id: string;
  documentNames: string[];
  documents: FileUpload[];
  access: string[][];
};

export type TParameterCreateProject = {
  payload: CreateProjectDto;
  payloadClient?: CreateClientDto | null;
  payloadDocument?: DocumentDto | null;
  document?: FileUpload | null;
};
