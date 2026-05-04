export enum API状态Type { LOADING, IDLE, FAIL }

export interface API状态 {
  [async名称: string]: API状态Type
}

export type ThemeMode = 'light' | 'dark' | 'system' 
