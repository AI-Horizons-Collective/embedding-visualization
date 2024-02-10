import { FC, useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useAtom } from 'jotai';
import { embeddingsAtom, embeddingTextsAtom } from '../../store';
import { css } from '@emotion/css';
import { Form, Radio } from 'antd';
import { match } from 'ts-pattern';
import { PCA } from 'ml-pca';

const classes = {
  wrapper: css`
    height: 100vh;
    display: flex;
    flex-direction: column;
  `,
  tools: css``,
  charts: css`
    position: relative;
    flex: 1 !important;
    height: 100% !important;
  `,
};

enum DimensionalTypeEnum {
  All,
  One,
  Two,
  Three,
}

export const FullDimensionalHeatMap: FC = () => {
  const [_embeddings] = useAtom(embeddingsAtom);
  const [embeddingTexts] = useAtom(embeddingTextsAtom);
  const [dimensional, setDimensional] = useState<DimensionalTypeEnum>(
    DimensionalTypeEnum.All,
  );
  const embeddings = useMemo(() => {
    const pca = new PCA(_embeddings);
    return match(dimensional)
      .with(DimensionalTypeEnum.All, () => _embeddings)
      .with(DimensionalTypeEnum.One, () =>
        pca.predict(_embeddings, { nComponents: 1 }).toJSON(),
      )
      .with(DimensionalTypeEnum.Two, () =>
        pca.predict(_embeddings, { nComponents: 2 }).toJSON(),
      )
      .with(DimensionalTypeEnum.Three, () =>
        pca.predict(_embeddings, { nComponents: 3 }).toJSON(),
      )
      .run();
  }, [_embeddings, dimensional]);
  const flatEmbeddings = embeddings.flat();
  const max = Math.max(...flatEmbeddings);
  const min = Math.min(...flatEmbeddings);
  const options = useMemo(() => {
    return {
      tooltip: {
        position: 'top',
        formatter: function (params: { data: number[] }) {
          // 获取当前点的列索引和值
          const columnIndex = params.data[1];
          const value = params.data[2];
          // 获取对应的列标题
          const columnName = embeddingTexts[columnIndex];
          return columnName + ': ' + value;
        },
      },
      xAxis: {
        type: 'category',
        data: Array.from(
          { length: embeddings[0].length },
          (_, i) => `维度 ${i + 1}`,
        ),
        splitArea: {
          show: true,
        },
      },
      yAxis: {
        type: 'category',
        data: embeddingTexts,
        axisLabel: {
          fontSize: 8, // 设置 y 轴标签字体大小为 14
        },
        splitArea: {
          show: true,
        },
      },
      grid: {
        top: '10px',
        bottom: '100px',
        left: '10px',
        right: '10px',
        containLabel: true, // 确保标签和轴标题也在网格区域内
      },
      visualMap: {
        min, // 更新为你的数据的最小值
        max, // 更新为你的数据的最大值
        calculable: true,
        precision: 8,
        orient: 'horizontal',
        left: 'center',
        inRange: {
          color: [
            '#f2a2a2', // 浅红色
            '#f97171', // 中等红色
            '#ff4040', // 较深红色
            '#0000ff', // 蓝色（中间的突变）
            '#4040ff', // 较浅蓝色
            '#7070ff', // 中等蓝色
            '#a0a0ff', // 浅蓝色
          ],
        },
        bottom: '40px',
      },
      dataZoom: [
        {
          type: 'slider', // 支持滑动条形式的数据区域缩放
          show: true,
          xAxisIndex: [0],
          filterMode: 'filter',
          start: 0, // 数据窗口范围的起始百分比
          end: dimensional === DimensionalTypeEnum.All ? 1 : 100, // 数据窗口范围的结束百分比
        },
      ],
      series: [
        {
          name: '模拟数据',
          type: 'heatmap',
          data: embeddings
            .map((item, i) => item.map((value, j) => [j, i, value]))
            .flat(),
          label: {
            show: false,
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }, [embeddingTexts, embeddings]);
  return (
    <div className={classes.wrapper}>
      <div className={classes.tools}>
        <Form size={'small'}>
          <Form.Item>
            <Radio.Group
              value={dimensional}
              onChange={(e) => {
                setDimensional(e.target.value);
              }}
            >
              <Radio value={DimensionalTypeEnum.All}>全维度</Radio>
              <Radio value={DimensionalTypeEnum.One}>一维</Radio>
              <Radio value={DimensionalTypeEnum.Two}>二维</Radio>
              <Radio value={DimensionalTypeEnum.Three}>三维维</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </div>
      <ReactECharts className={classes.charts} option={options} />
    </div>
  );
};
