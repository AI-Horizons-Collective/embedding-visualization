import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { MenuEnum, MenuItem } from '../types';

export const menusAtom = atom<MenuItem[]>([
  {
    key: MenuEnum.DataPreparation,
    label: '数据准备',
  },
  {
    key: MenuEnum.FullDimensionalHeatMap,
    label: '全维度热力图',
  },
  {
    key: MenuEnum.Scatter2D,
    label: '2D 散点图',
  },
  {
    key: MenuEnum.Scatter3D,
    label: '3D 散点图',
  },
  {
    key: MenuEnum.Distance,
    label: '距离计算',
  },
]);

export const activeMenuAtom = atomWithStorage<MenuEnum>(
  'activeMenuAtom',
  MenuEnum.DataPreparation,
);

export const embeddingsAtom = atomWithStorage<number[][]>('embeddingsAtom', []);
export const embeddingTextsAtom = atomWithStorage<string[]>(
  'embeddingTextsAtom',
  [],
);

export const searchEmbeddingsAtom = atomWithStorage<number[][]>(
  'searchEmbeddingsAtom',
  [],
);
export const searchEmbeddingTextsAtom = atomWithStorage<string[]>(
  'searchEmbeddingTextsAtom',
  [],
);
