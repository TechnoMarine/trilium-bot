export enum NoteType {
  text = 'text',
  code = 'code',
  render = 'render',
  file = 'file',
  image = 'image',
  search = 'search',
  relationMap = 'relationMap',
  book = 'book',
  noteMap = 'noteMap',
  mermaid = 'mermaid',
  webView = 'webView',
  shortcut = 'shortcut',
  doc = 'doc',
  contentWidget = 'contentWidget',
  launcher = 'launcher',
}

export interface ILibrabyReponse {
  noteId: string;
  title: string;
  type: NoteType;
  mime: string;
  isProtected: boolean;
  blobId: string; // ID of the blob object which effectively serves as a content hash
  attributes: any[];
  parentNoteIds: string[];
  childNoteIds: string[];
  parentBranchIds: string[];
  childBranchIds: string[];
  dateCreated: string;
  dateModified: string;
  utcDateCreated: string;
  utcDateModified: string;
}
