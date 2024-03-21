import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ILibrabyReponse } from './trilium.interaces';
import axios from 'axios';
import { AxiosInstance } from 'axios';

type BookId = string;
type BookName = string;
type MapBook = Map<BookId, BookName>;

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
    const booksName = await this.getBooksName();
    return await this.buildBookListMessage(booksName);
  }

  public async getBooksName(): Promise<MapBook> {
    const data: ILibrabyReponse = await this.fetchBooksNode();
    return await this.getBooksNameFromTriliumByIds(data.childNoteIds);
  }

  private async getBooksNameFromTriliumByIds(ids: string[]): Promise<MapBook> {
    const names: Map<BookId, BookName> = new Map<string, string>([]);
    for (const id of ids) {
      const response = await this.triliumPreRequest.get(
        this.notesParam + '/' + id,
        {
          responseType: 'json',
        },
      );
      const data: ILibrabyReponse = response.data;
      names.set(id, data.title);
    }
    return names;
  }

  public async buildBookListMessage(
    booksMap: Map<string, string>,
  ): Promise<string> {
    const msg: string[] = [];
    let i: number = 0;
    for (const key of booksMap.entries()) {
      msg.push(`${i}. ${key[0]}`);
      i++;
    }
    return msg.join('\n');
  }

  private async fetchBooksNode() {
    const response = await this.triliumPreRequest.get(
      this.notesParam + '/' + this.bookStorageId,
      {
        responseType: 'json',
      },
    );
    return response.data;
  }
}
