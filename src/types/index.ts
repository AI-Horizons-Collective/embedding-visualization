export enum MenuEnum {
  DataPreparation = 'DataPreparation',
  FullDimensionalHeatMap = 'FullDimensionalHeatMap',
  Scatter2D = 'Scatter2D',
  Scatter3D = 'Scatter3D',
  Distance = 'Distance',
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
