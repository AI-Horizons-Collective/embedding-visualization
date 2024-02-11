import { FC, useMemo } from 'react';
import { css } from '@emotion/css';
import { Typography } from 'antd';
import EChartsReact from 'echarts-for-react';

const classes = {
  wrapper: css`
    position: absolute;
    inset: 0;
    border: 1px solid red;
    display: flex;
    flex-direction: column;
  `,
  header: css`
    text-align: center;
  `,
  content: css`
    border: 1px solid green;
    flex: 1;
    overflow-y: scroll;
  `,
  charts: css`
    height: 100% !important;
  `,
};
function generateColorGradient(numColors: number) {
  const colors = [];
  const startColor = [255, 0, 0]; // Red color in RGB
  const endColor = [0, 0, 255]; // Blue color in RGB

  // Calculate the step for each color channel
  const step = [
    (endColor[0] - startColor[0]) / (numColors - 1),
    (endColor[1] - startColor[1]) / (numColors - 1),
    (endColor[2] - startColor[2]) / (numColors - 1),
  ];

  // Generate colors by interpolating between startColor and endColor
  for (let i = 0; i < numColors; i++) {
    const color = [
      Math.round(startColor[0] + step[0] * i),
      Math.round(startColor[1] + step[1] * i),
      Math.round(startColor[2] + step[2] * i),
    ];
    colors.push(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
  }

  return colors.reverse();
}

export const DistanceView: FC<{
  title: string;
  data: {
    name: string;
    value: number;
  }[];
}> = ({ title, data }) => {
  const options = useMemo(() => {
    const colors = generateColorGradient(data.length);
    return {
      grid: {
        top: '10px',
        bottom: '10px',
        left: '0px',
        right: '10px',
        containLabel: true, // 确保标签和轴标题也在网格区域内
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 8, // 设置 y 轴标签字体大小为 14
        },
      },
      yAxis: {
        type: 'category',
        data: data.map((item) => item.name), // Assuming distances are labeled
        axisLabel: {
          fontSize: 8, // 设置 y 轴标签字体大小为 14
        },
      },
      series: [
        {
          type: 'bar',
          data: data.map((item, index) => {
            return {
              value: item.value,
              itemStyle: {
                borderRadius: item.value > 0 ? [0, 20, 20, 0] : [20, 0, 0, 20],
                color: colors[index],
              },
              label: {
                show: true,
                position: 'right', // Display labels on the right side of the bars
                fontSize: 8, // 设置 y 轴标签字体大小为 14
              },
            };
          }),
        },
      ],
    };
  }, [data]);
  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <Typography.Text>{title}</Typography.Text>
      </div>
      <div className={classes.content}>
        <EChartsReact className={classes.charts} option={options} />
      </div>
    </div>
  );
};
