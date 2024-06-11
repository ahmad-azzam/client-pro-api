import { FileUpload } from 'graphql-upload-ts';
import { GaxiosResponse } from 'gaxios';
import { drive_v3 } from 'googleapis';

export type TPayloadDocument = {
  name: string;
  file: FileUpload;
};

type TFileClient = {
  type: 'client';
};

type TFileProject = {
  type: 'project';
  access: string[];
};

export type TAddFile = {
  folderId: string;
  name: string;
  document: FileUpload;
} & (TFileClient | TFileProject);

export type TUpsertFile = {
  folderId: string;
  fileGDrive: GaxiosResponse<drive_v3.Schema$File>;
} & (TFileClient | TFileProject);
