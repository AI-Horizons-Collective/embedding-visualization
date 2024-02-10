import { FC, useMemo } from 'react';
import * as echarts from 'echarts/core';
// @ts-ignore
import { transform } from 'echarts-stat';
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
export const Scatter2d: FC = () => {
  const [_embeddings] = useAtom(embeddingsAtom);
  const [embeddingTexts] = useAtom(embeddingTextsAtom);

  const [_searchEmbeddings] = useAtom(searchEmbeddingsAtom);
  const [searchEmbeddingTexts] = useAtom(searchEmbeddingTextsAtom);

  const embeddings = useMemo(() => {
    const pca = new PCA([..._embeddings, ..._searchEmbeddings]);
    return pca
      .predict([..._embeddings, ..._searchEmbeddings], { nComponents: 2 })
      .toJSON();
  }, [_embeddings]);
  const flatEmbeddings = embeddings.flat();
  const _max = Math.max(...flatEmbeddings);
  const _min = Math.min(...flatEmbeddings);
  const max = Math.ceil(Math.max(_max, Math.abs(_min)) * 10) / 10;

  const options = useMemo(() => {
    return {
      dataset: [
        {
          source: embeddings,
        },
        {
          transform: {
            type: 'ecStat:clustering',
            // print: true,
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
      grid: {
        top: '10px',
        bottom: '10px',
        left: '100px',
        right: '10px',
        containLabel: true, // 确保标签和轴标题也在网格区域内
      },
      xAxis: {
        type: 'value',
        splitNumber: 0.1,
        max: max,
        min: -max,
      },
      yAxis: {
        type: 'value',
        splitNumber: 0.1,
        max: max,
        min: -max,
      },
      series: {
        type: 'scatter',
        encode: { tooltip: [0, 1] },
        symbolSize: (_: number[], params: { dataIndex: number }) => {
          if (params.dataIndex > _embeddings.length - 1) {
            return 20;
          }
          return 10;
        },
        itemStyle: {
          borderColor: '#555',
        },
        datasetIndex: 1,
        label: {
          position: 'right',
          // Ensure label is configured properly
          show: true,
          fontSize: 8, // 设置字体大小为12
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
