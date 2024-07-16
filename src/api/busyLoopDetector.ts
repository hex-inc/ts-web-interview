export class BusyLoopDetector {
  private counter: number;
  private threshold: number;
  private timeWindow: number;
  private startTime: number;

  constructor(threshold: number = 1000, timeWindow: number = 1000) {
    this.counter = 0;
    this.threshold = threshold;
    this.timeWindow = timeWindow;
    this.startTime = Date.now();
  }

  private resetTimer(): void {
    this.startTime = Date.now();
    this.counter = 0;
  }

  public check(): void {
    this.counter++;
    const currentTime = Date.now();
    if (currentTime - this.startTime > this.timeWindow) {
      this.resetTimer();
    } else if (this.counter > this.threshold) {
      this.triggerCrash();
    }
  }

  private triggerCrash(): void {
    console.error("Busy loop detected. Crashing the application.");
    throw new Error("Busy loop detected");
  }
}