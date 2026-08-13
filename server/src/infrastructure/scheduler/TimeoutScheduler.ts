import { Scheduler } from "../../application/ports/Scheduler";

export class TimeoutScheduler implements Scheduler {
  private timers = new Map<string, NodeJS.Timeout>();

  schedule(key: string, seconds: number, fn: () => void): void {
    this.cancel(key);
    const timer = setTimeout(fn, seconds * 1000);
    this.timers.set(key, timer);
  }

  cancel(key: string): void {
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }
  }
}
