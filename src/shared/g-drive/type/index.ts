export type TCreateFolderParameter = {
  folderName: string;
  folderId?: string;
};

export type TCreateFileParameter = {
  fileName: string
  file: Buffer,
  folderId: string,
  mimeType: string
}
