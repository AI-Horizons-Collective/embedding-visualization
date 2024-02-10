/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_OPEN_AI_KEY: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
