
export enum ItemType {
  Quote = 'quote',
  Image = 'image',
  Video = 'video',
}

export interface MotivationItem {
  id: number;
  type: ItemType;
  content: string;
  score: number;
  createdAt: number;
}
