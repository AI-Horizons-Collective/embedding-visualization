export enum MenuEnum {
  DataPreparation = 'DataPreparation',
  FullDimensionalHeatMap = 'FullDimensionalHeatMap',
}

export type MenuItem = {
  key: string;
  label: string;
};

export interface EmbeddingItem {
  embedding: number[];
  index: number;
  object: 'embedding';
}
