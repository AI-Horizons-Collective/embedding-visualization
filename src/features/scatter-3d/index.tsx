import { FC, useMemo } from 'react';
import * as echarts from 'echarts/core';

import 'echarts-gl';
// @ts-ignore
import EChartsReact from 'echarts-for-react';
import { PCA } from 'ml-pca';
import { useAtom } from 'jotai';
import {
  embeddingsAtom,
  embeddingTextsAtom,
  searchEmbeddingsAtom,
  searchEmbeddingTextsAtom,
} from '../../store';
import { css } from '@emotion/css';
// @ts-ignore
import { transform } from 'echarts-stat';
echarts.registerTransform(transform.clustering);

const CLUSTER_COUNT = 6;
const DIENSIION_CLUSTER_INDEX = 2;
const COLOR_ALL = [
  '#37A2DA',
  '#e06343',
  '#37a354',
  '#b55dba',
  '#b5bd48',
  '#8378EA',
  '#96BFFF',
];
const pieces: { value: number; label: string; color: string }[] = [];
for (let i = 0; i < CLUSTER_COUNT; i++) {
  pieces.push({
    value: i,
    label: 'cluster ' + i,
    color: COLOR_ALL[i],
  });
}

const classes = {
  wrapper: css`
    height: 100vh;
  `,
  charts: css`
    height: 100% !important;
  `,
};

export const Scatter3d: FC = () => {
  const [_embeddings] = useAtom(embeddingsAtom);
  const [embeddingTexts] = useAtom(embeddingTextsAtom);
  const [_searchEmbeddings] = useAtom(searchEmbeddingsAtom);
  const [searchEmbeddingTexts] = useAtom(searchEmbeddingTextsAtom);
  const embeddings = useMemo(() => {
    const pca = new PCA(_embeddings);
    return pca
      .predict([..._embeddings, ..._searchEmbeddings], { nComponents: 3 })
      .toJSON();
  }, [_embeddings]);

  const options = useMemo(() => {
    return {
      dataset: [
        {
          source: embeddings,
        },
        {
          transform: {
            type: 'ecStat:clustering',
            config: {
              clusterCount: CLUSTER_COUNT,
              outputType: 'single',
              outputClusterIndexDimension: DIENSIION_CLUSTER_INDEX,
            },
          },
        },
      ],
      visualMap: {
        type: 'piecewise',
        top: 'middle',
        min: 0,
        max: CLUSTER_COUNT,
        left: 10,
        splitNumber: CLUSTER_COUNT,
        dimension: DIENSIION_CLUSTER_INDEX,
        pieces: pieces,
      },
      grid3D: {},
      xAxis3D: {
        type: 'value',
      },
      yAxis3D: {
        type: 'value',
      },
      zAxis3D: {
        type: 'value',
      },
      series: {
        type: 'scatter3D',
        symbolSize: (_: number[], params: { dataIndex: number }) => {
          if (params.dataIndex > _embeddings.length - 1) {
            return 20;
          }
          return 10;
        },
        encode: { tooltip: [0, 1, 2] },
        itemStyle: {
          borderColor: '#555',
        },
        datasetIndex: 1,
        label: {
          position: 'right',
          show: true,
          fontSize: 8,
          formatter: (params: { dataIndex: number }) => {
            return [...embeddingTexts, ...searchEmbeddingTexts][
              params.dataIndex
            ];
          },
        },
      },
    };
  }, [embeddingTexts, embeddings]);

  return (
    <div className={classes.wrapper}>
      <EChartsReact className={classes.charts} option={options} />
    </div>
  );
};
