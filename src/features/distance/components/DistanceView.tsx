import { FC } from 'react';
import { css } from '@emotion/css';
import { Typography } from 'antd';

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
  item: css`
    font-size: 12px;
    border-bottom: 1px solid green;
    padding: 0 8px;
  `,
};
export const DistanceView: FC<{
  title: string;
  data: {
    name: string;
    value: number;
  }[];
}> = ({ title, data }) => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <Typography.Text>{title}</Typography.Text>
      </div>
      <div className={classes.content}>
        {data.map(({ name, value }) => {
          return (
            <div key={name + value} className={classes.item}>
              <div>
                <Typography.Text>{name}</Typography.Text>
              </div>
              <div style={{ textAlign: 'right' }}>{value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
