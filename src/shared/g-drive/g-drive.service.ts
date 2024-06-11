import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drive_v3, google } from 'googleapis';
import { TCreateFileParameter, TCreateFolderParameter } from './type';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class GDriveService {
  private scopes = ['https://www.googleapis.com/auth/drive'];
  private drive: drive_v3.Drive;
  private parentFolderId: string =
    this.configService.get<string>('GDRIVE_FOLDER_ID');

  constructor(
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {
    this.initiateDrive();
  }

  async initiateDrive() {
    const auth = await this.authorize();
    this.drive = google.drive({ version: 'v3', auth });
  }

  private async authorize() {
    const jwtClient = new google.auth.JWT(
      this.configService.get<string>('GDRIVE_EMAIL'),
      null,
      this.configService
        .get<string>('GDRIVE_KEY')
        .split(String.raw`\n`)
        .join('\n'),
      this.scopes,
    );

    await jwtClient.authorize();
    return jwtClient;
  }

  async createFolder({
    folderName,
    folderId = this.parentFolderId,
  }: TCreateFolderParameter) {
    return await this.drive.files.create({
      supportsAllDrives: true,
      requestBody: {
        name: folderName,
        parents: [folderId],
        mimeType: 'application/vnd.google-apps.folder',
      },
    });
  }

  async createFile({
    file,
    fileName,
    folderId,
    mimeType,
  }: TCreateFileParameter) {
    return await this.drive.files.create({
      media: {
        body: this.utilsService.stream(file),
      },
      requestBody: {
        name: fileName,
        parents: [folderId],
        mimeType,
      },
    });
  }

  async getLinkFileDownload(fileId: string) {
    const file = await this.drive.files.get({
      fileId,
      fields: 'webViewLink, webContentLink',
    });

    return file.data.webContentLink;
  }

  async renameFile(fileId: string, name: string) {
    return await this.drive.files.update({
      fileId,
      requestBody: {
        name,
      },
    });
  }

  async deleteFile(fileId: string) {
    return await this.drive.files.delete({
      fileId,
    });
  }
}
