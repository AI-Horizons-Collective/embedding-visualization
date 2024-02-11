import { FC, useState } from 'react';
import { css } from '@emotion/css';
import { Button, Divider, Form, Input, Tag, Typography } from 'antd';
import ReactJSONView from 'react-json-view';
import { openAI } from '../../../api';
import { useRequest } from 'ahooks';
import { union } from 'lodash';
const classes = {
  wrapper: css`
    height: 100%;
    overflow: hidden;
    border: 1px solid red;
    display: flex;
    flex-direction: column;
  `,
  form: css``,
  view: css`
    flex: 1;
    overflow: auto;
  `,
};

const formatEmbeddingText = (toEmbed: string): string[] => {
  return union(toEmbed.split('\n').filter((item) => !!item.trim()));
};
export const Embedding: FC<{
  embeddings: number[][];
  setEmbeddings: (embeddings: number[][]) => void;
  embeddingTexts: string[];
  setEmbeddingTexts: (embeddingTexts: string[]) => void;
  title: string;
}> = ({
  embeddings,
  setEmbeddings,
  embeddingTexts,
  setEmbeddingTexts,
  title,
}) => {
  const [toEmbed, setToEmbed] = useState<string>('');
  const { run: runEmbedding, loading } = useRequest(openAI.embedding, {
    manual: true,
    onSuccess: (data, [inputs]) => {
      console.log(data, inputs);
      setEmbeddings(data.data.data.map((item) => item.embedding));
      setEmbeddingTexts(inputs as string[]);
    },
  });
  const embedding = async () => {
    if (!toEmbed) return;
    const inputs = union(formatEmbeddingText(toEmbed));
    runEmbedding(inputs);
  };
  return (
    <div className={classes.wrapper}>
      <Form size={'small'} className={classes.form} layout={'vertical'}>
        <Typography.Text type="success">{title}</Typography.Text>
        <Form.Item label="请输入待Embedding的词组，换行符分割">
          {/*<Space.Compact style={{ width: '100%' }}>*/}
          <Input.TextArea
            rows={2}
            value={toEmbed}
            onChange={(e) => {
              setToEmbed(e.target.value);
            }}
            showCount={{
              formatter: ({ value }) =>
                `共${formatEmbeddingText(value).length}个词组`,
            }}
          />
          <Button
            style={{ height: '100%' }}
            type="primary"
            loading={loading}
            onClick={embedding}
          >
            Embedding
          </Button>
          {/*</Space.Compact>*/}
        </Form.Item>
        <Form.Item label="已经embedding的词组">
          {embeddingTexts.map((embeddingText, index) => (
            <Tag color="success" key={embeddingText}>
              {index}.{embeddingText}
            </Tag>
          ))}
        </Form.Item>
      </Form>
      <Divider />
      <div className={classes.view}>
        <ReactJSONView src={embeddings} name={null} displayDataTypes={false} />
      </div>
    </div>
  );
};
