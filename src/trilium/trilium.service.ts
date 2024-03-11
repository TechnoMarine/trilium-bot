import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ILibrabyReponse } from './trilium.interaces';
import axios from 'axios';

@Injectable()
export class TriliumService {
  logger = new Logger('Trillium service');
  private readonly gi: string;
  private readonly bookStorageId: string;
  private readonly notesParam = '/notes';

  constructor(private readonly configService: ConfigService) {
    this.triliumUrl = this.configService.get('TRILIUM_API_URL');
    this.bookStorageId = this.configService.get('BOOK_STORAGE_ID');
  }

  async getBookList() {
    const url = new URL(
      this.notesParam + '/' + this.bookStorageId,
      this.triliumUrl,
    );
    console.log(url.href);
    const response = await axios.get(url.href, { responseType: 'json' });
    const data: ILibrabyReponse = response.data;
    return await this.getBooksNameFromTrilium(data.childNoteIds);
  }

  private async getBooksNameFromTrilium(
    ids: string[],
  ): Promise<Map<string, string>> {
    const names: Map<string, string> = new Map<string, string>([]);
    for (const id of ids) {
      const url = this.triliumUrl + this.notesParam + '/' + id;
      const response = await axios.get(url, {
        responseType: 'json',
      });
      const data: ILibrabyReponse = response.data;
      names.set(data.title, id);
    }
    return names;
  }
}
