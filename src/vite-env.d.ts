/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly REACT_APP_OS_GOOGLE_OAUTH_CLIENT_ID: string;
  readonly REACT_APP_OS_GOOGLE_OAUTH_REDIRECT_URI: string;
  // more env variables...
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
