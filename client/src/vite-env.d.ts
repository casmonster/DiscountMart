/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly MODE: string
  readonly BASE_URL: string
  readonly PROD: boolean
  readonly DEV: boolean
  // Add any custom VITE_ prefixed variables you use
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
