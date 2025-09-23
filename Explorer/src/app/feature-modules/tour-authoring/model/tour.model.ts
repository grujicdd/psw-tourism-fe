// model/tour.model.ts
export interface Tour {
  id: number;
  name: string;
  description: string;
  difficulty: number;
  category: number;
  price: number;
  date: Date;
  state: TourState;
}

export enum TourState {
  DRAFT = 0,
  COMPLETE = 1
}