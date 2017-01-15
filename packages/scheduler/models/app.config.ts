export interface AppConfig {
  path: string;
  instances?: number;
  env?: { [key: string]: string };
}
