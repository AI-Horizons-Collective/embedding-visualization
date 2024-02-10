export function euclideanDistance(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have the same dimensionality');
  }

  let sum = 0;
  for (let i = 0; i < vec1.length; i++) {
    sum += Math.pow(vec1[i] - vec2[i], 2);
  }

  return Math.sqrt(sum);
}

export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have the same dimensionality');
  }

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }

  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);

  if (mag1 === 0 || mag2 === 0) {
    throw new Error('One of the vectors has zero magnitude');
  }

  return dotProduct / (mag1 * mag2);
}

export function dotProductSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have the same dimensionality');
  }

  let dotProduct = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
  }

  return dotProduct;
}
