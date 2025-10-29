
export enum ItemType {
  Quote = 'quote',
  Image = 'image',
  Video = 'video',
}

export interface MotivationItem {
  id: string;
  type: ItemType;
  content: string;
  score: number;
  createdAt: number;
}
