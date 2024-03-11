import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ILibrabyReponse } from './trilium.interaces';
import axios from 'axios';
import { AxiosInstance } from 'axios';

@Injectable()
export class TriliumService {
  logger = new Logger('Trillium service');
  private readonly bookStorageId: string;
  private readonly notesParam = '/notes';
  private readonly triliumUrl: string;
  private readonly triliumApiKey: string;
  private triliumPreRequest: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.triliumUrl = this.configService.get('TRILIUM_API_URL');
    this.bookStorageId = this.configService.get('BOOK_STORAGE_ID');
    this.triliumApiKey = this.configService.get('TRILIUM_API_KEY');
    this.triliumPreRequest = axios.create({
      baseURL: new URL(this.triliumUrl).href,
      timeout: 2000,
      headers: {
        Authorization: this.triliumApiKey,
      },
    });
  }

  async getBookList() {
    const response = await this.triliumPreRequest.get(
      this.notesParam + '/' + this.bookStorageId,
      { responseType: 'json' },
    );
    const data: ILibrabyReponse = response.data;
    await this.getBooksNameFromTrilium(data.childNoteIds);
  }

  private async getBooksNameFromTrilium(
    ids: string[],
  ): Promise<Map<string, string>> {
    const names: Map<string, string> = new Map<string, string>([]);
    for (const id of ids) {
      const response = await this.triliumPreRequest.get(
        this.notesParam + '/' + id,
        {
          responseType: 'json',
        },
      );
      const data: ILibrabyReponse = response.data;
      names.set(data.title, id);
    }
    return names;
  }
}
