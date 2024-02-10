import { FC } from 'react';
import { css } from '@emotion/css';
import { Embedding } from './components/Embedding.tsx';
import { Col, Row } from 'antd';
import { useAtom } from 'jotai';
import {
  embeddingsAtom,
  embeddingTextsAtom,
  searchEmbeddingsAtom,
  searchEmbeddingTextsAtom,
} from '../../store';
const classes = {
  wrapper: css`
    height: 100vh;
  `,
  col: css`
    height: 100vh;
  `,
};
export const DataPreparation: FC = () => {
  const [embeddings, setEmbeddings] = useAtom(embeddingsAtom);
  const [embeddingTexts, setEmbeddingTexts] = useAtom(embeddingTextsAtom);
  const [searchEmbeddings, setSearchEmbeddings] = useAtom(searchEmbeddingsAtom);
  const [searchEmbeddingTexts, setSearchEmbeddingTexts] = useAtom(
    searchEmbeddingTextsAtom,
  );
  return (
    <Row className={classes.wrapper}>
      <Col span={12} className={classes.col}>
        <Embedding
          title="知识库数据"
          embeddings={embeddings}
          setEmbeddings={setEmbeddings}
          embeddingTexts={embeddingTexts}
          setEmbeddingTexts={setEmbeddingTexts}
        />
      </Col>
      <Col span={12} className={classes.col}>
        <Embedding
          title="查询数据"
          embeddings={searchEmbeddings}
          setEmbeddings={setSearchEmbeddings}
          embeddingTexts={searchEmbeddingTexts}
          setEmbeddingTexts={setSearchEmbeddingTexts}
        />
      </Col>
    </Row>
  );
};
