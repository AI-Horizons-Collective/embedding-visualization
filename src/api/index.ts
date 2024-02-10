import axios from 'axios';
import { EmbeddingItem } from '../types';
class OpenAI {
  private readonly proxyUrl = 'https://api.openai-proxy.com/v1';
  private get request() {
    return axios.create({
      baseURL: this.proxyUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_OPEN_AI_KEY}`,
      },
    });
  }

  readonly embedding = (input: string | string[]) => {
    return this.request.post<{
      data: EmbeddingItem[];
      model: string;
      object: string;
      usage: {
        prompt_tokens: number;
        total_tokens: number;
      };
    }>('/embeddings', {
      input,
      model: 'text-embedding-3-small',
    });
  };
}

export const openAI = new OpenAI();
