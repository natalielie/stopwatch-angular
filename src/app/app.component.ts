import { Component, OnDestroy } from '@angular/core';
import {
  Subject,
  Subscription,
  buffer,
  debounceTime,
  filter,
  fromEvent,
  map,
  takeUntil,
  timer,
} from 'rxjs';

/**
 * Stopwatch component which uses StopwatchService
 * for implementing stopwatch functionality
 */
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  /**
   * a time property represented in creating new current date and time,
   * setting the offset, which is negative,
   * so putting '-' sets the value to the beginning, 00:00:00
   */
  public time: number = -new Date().getTimezoneOffset();
  public isRunning = false;
  private timerSubscription: Subscription = new Subscription();
  /** a subject that emits a truthy value in the ngOnDestroy lifecycle hook */
  private destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * Starts the stopwatch from the initial time or the last stopped count
   */
  public handleCount(): void {
    //if the time is running, stop the count
    if (this.isRunning) {
      this.stopCount();
      return;
    }
    // timer for emitting each value every second
    this.timerSubscription = timer(0, 1000)
      .pipe(
        map(() => (this.time += 1000)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {});

    this.isRunning = true;
  }

  /**
   * Stops the stopwatch on the last count
   */
  public stopCount(): void {
    this.destroy$.next(true);
    this.timerSubscription.unsubscribe();
    this.isRunning = false;
  }

  /**
   * Resets the stopwatch to 0
   */
  public resetStopwatch(): void {
    this.destroy$.next(true);
    this.timerSubscription.unsubscribe();
    this.time = 0;
    this.isRunning = false;
  }

  /**
   * Checks if there were two consecutive clicks within 300ms and stops the time
   *
   * @param mouse$ check if there was a click
   * @param buff$ wait 300ms before emission
   * @param click$ check if there were 2 clicks
   *
   */
  public waitCount(): void {
    const mouse$ = fromEvent(document, 'click');
    const buff$ = mouse$.pipe(debounceTime(300));
    const click$ = mouse$.pipe(
      buffer(buff$),
      map((list) => {
        return list.length;
      }),
      filter((count) => count === 2),
      takeUntil(this.destroy$)
    );
    click$.subscribe(() => this.stopCount());
  }
}
