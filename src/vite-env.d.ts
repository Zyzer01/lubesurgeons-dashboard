declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';
declare module '*.jpg';

/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }