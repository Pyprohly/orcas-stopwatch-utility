
import { autoBind } from './auto-bind'

export class Stopwatch {
  protected startedTime: number | null = null
  protected elapsedTime: number = 0.0

  public constructor() {
    autoBind(this)
  }

  public get running(): boolean {
    return this.startedTime != null
  }

  protected getClockTime(): number {
    return performance.now()
  }

  public start(): void {
    if (this.running) { return }
    this.startedTime = this.getClockTime()
  }

  public stop(): void {
    if (!this.running) { return }
    if (this.startedTime == null) { throw Error() }
    this.elapsedTime += this.getClockTime() - this.startedTime
    this.startedTime = null
  }

  public reset(): void {
    this.startedTime = null
    this.elapsedTime = 0.0
  }

  public getElapsedTime(): number {
    let e = this.elapsedTime
    if (this.running) {
      if (this.startedTime == null) { throw Error() }
      e += this.getClockTime() - this.startedTime
    }
    return e
  }

  public adjustElapsedTime(delta: number): void {
    this.elapsedTime += delta
  }
}
