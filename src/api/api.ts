export interface CellData {
  id: string;
  text: string;
}

export type Subscription = (newCells: CellData[]) => void;

export interface ServerApi {
  getCells(): Promise<CellData[]>;

  updateCells(newCells: CellData[]): Promise<void>;

  subscribe(callback: Subscription): void;

  unsubscribe(callback: Subscription): void;
}
