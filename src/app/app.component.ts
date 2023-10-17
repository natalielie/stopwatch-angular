import { Component, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { StopWatch } from "./stopwatch.interface";
import { StopwatchService } from "./stopwatch.service";

/**
 * Stopwatch component which uses StopwatchService 
 * for implementing stopwatch functionality
 */
@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnDestroy {
  // a stopwatch property of Stopwatch interface
  public stopwatch!: StopWatch;
  // a subject that emits a truthy value in the ngOnDestroy lifecycle hook
  destroy$: Subject<boolean> = new Subject<boolean>();
  isRunning: boolean = false;

  constructor(private stopwatchService: StopwatchService) {
      this.stopwatchService.stopWatch$.subscribe(
        (val: StopWatch) => (this.stopwatch = val)
      )
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
 * Starts the stopwatch from the initial time or the last stopped count
 */ 
  public handleCount(): void {
    this.stopwatchService.handleCount();
    this.isRunning = this.stopwatchService.isRunning
  }

  /**
 * Resets the stopwatch to 0
 */ 
  public resetStopwatch(): void {
    this.stopwatchService.resetStopwatch();
    this.isRunning = false;
  }

  /**
 * Checks if there were two consecutive clicks within 300ms and stops the time
 * 
 */
  public waitCount(): void {
    this.stopwatchService.waitCount();
    this.isRunning = false;
  }
}
