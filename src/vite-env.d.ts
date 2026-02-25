/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DUNE_API_KEY: string
  readonly VITE_DUNE_QUERY_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
