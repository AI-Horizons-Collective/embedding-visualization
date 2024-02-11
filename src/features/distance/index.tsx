import { FC, useMemo, useState } from 'react';
import { css } from '@emotion/css';
import { Col, InputNumber, Row, Tag, Typography } from 'antd';
import { useAtom } from 'jotai';
import {
  embeddingsAtom,
  embeddingTextsAtom,
  searchEmbeddingsAtom,
  searchEmbeddingTextsAtom,
} from '../../store';
import { PCA } from 'ml-pca';
import {
  cosineSimilarity,
  dotProductSimilarity,
  euclideanDistance,
} from '../../utils';
import { DistanceView } from './components/DistanceView.tsx';
const classes = {
  wrapper: css`
    height: 100vh;
    display: flex;
    flex-direction: column;
  `,
  header: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  content: css`
    flex: 1;
  `,
  contentCol: css`
    height: 100%;
    overflow: hidden;
    position: relative;
  `,
};
const DEFAULT_DIMENSIONS = 3;
const MAX_DIMENSIONS = 50;
const MIN_DIMENSIONS = 2;
export const Distance: FC = () => {
  const [_embeddings] = useAtom(embeddingsAtom);
  const [embeddingTexts] = useAtom(embeddingTextsAtom);

  const [_searchEmbeddings] = useAtom(searchEmbeddingsAtom);
  const [searchEmbeddingTexts] = useAtom(searchEmbeddingTextsAtom);
  const [dimensions, setDimensions] = useState(DEFAULT_DIMENSIONS);
  const embeddings = useMemo(() => {
    const pca = new PCA(_embeddings);
    return pca.predict(_embeddings, { nComponents: dimensions }).toJSON();
  }, [_embeddings, dimensions]);
  const searchEmbeddings = useMemo(() => {
    const pca = new PCA(_embeddings);
    return pca.predict(_searchEmbeddings, { nComponents: dimensions }).toJSON();
  }, [_searchEmbeddings, dimensions]);
  const searchEmbedding = searchEmbeddings[0];
  const searchEmbeddingText = searchEmbeddingTexts[0];
  const euclideanDistances: { name: string; value: number }[] = useMemo(() => {
    return embeddings.map((embedding, index) => {
      return {
        name: embeddingTexts[index],
        value: euclideanDistance(embedding, searchEmbedding),
      };
    });
  }, [embeddings, searchEmbedding, dimensions]);
  const cosineSimilarities: { name: string; value: number }[] = useMemo(() => {
    return embeddings.map((embedding, index) => {
      return {
        name: embeddingTexts[index],
        value: cosineSimilarity(embedding, searchEmbedding),
      };
    });
  }, [embeddings, searchEmbedding, dimensions]);
  const dotProductSimilarities: { name: string; value: number }[] =
    useMemo(() => {
      return embeddings.map((embedding, index) => {
        return {
          name: embeddingTexts[index],
          value: dotProductSimilarity(embedding, searchEmbedding),
        };
      });
    }, [embeddings, searchEmbedding, dimensions]);
  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <div>
          <Typography.Text type="success">当前搜索词为:</Typography.Text>
          <Tag color={'orange'}>{searchEmbeddingText}</Tag>
        </div>
        <InputNumber
          style={{ minWidth: '260px' }}
          prefix={<Typography.Text type="success">维度:</Typography.Text>}
          size={'small'}
          step={1}
          min={MIN_DIMENSIONS}
          max={MAX_DIMENSIONS}
          value={dimensions}
          onChange={(value) => {
            setDimensions(value || DEFAULT_DIMENSIONS);
          }}
        />
      </div>
      <Row className={classes.content}>
        <Col className={classes.contentCol} span={8}>
          <DistanceView
            title="欧几里得距离"
            data={euclideanDistances.sort((a, b) => b.value - a.value)}
          />
        </Col>
        <Col className={classes.contentCol} span={8}>
          <DistanceView
            title="余弦相似度"
            data={cosineSimilarities.sort((a, b) => a.value - b.value)}
          />
        </Col>
        <Col className={classes.contentCol} span={8}>
          <DistanceView
            title="点积相似度"
            data={dotProductSimilarities.sort((a, b) => a.value - b.value)}
          />
        </Col>
      </Row>
    </div>
  );
};
