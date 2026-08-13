export interface Scheduler {
  schedule(key: string, seconds: number, fn: () => void): void;
  cancel(key: string): void;
}
