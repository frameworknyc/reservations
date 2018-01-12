import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  setYear,
  eachDay,
  getDate,
  getMonth,
  getYear,
  isToday,
  isSameDay,
  isSameMonth,
  isSameYear,
  format,
  getDay,
  subDays,
  setDay
} from 'date-fns';
import { ISlimScrollOptions } from 'ngx-slimscroll';

export interface DatepickerOptions {
  minYear?: number; // default: current year - 30
  maxYear?: number; // default: current year + 30
  displayFormat?: string; // default: 'MMM D[,] YYYY'
  barTitleFormat?: string; // default: 'MMMM YYYY'
  firstCalendarDay?: number; // 0 = Sunday (default), 1 = Monday, ..
  locale?: object;
  minDate?: Date;
  maxDate?: Date;
}

/**
 * Internal library helper that helps to check if value is empty
 * @param value
 */
const isNil = (value: Date | DatepickerOptions) => {
  return (typeof value === 'undefined') || (value === null);
};

@Component({
  selector: 'datepicker',
  template: `
  <div class="ngx-datepicker-container">
  <input type="text" *ngIf="!headless" class="ngx-datepicker-input" [(ngModel)]="displayValue" readonly (click)="toggle()">
  <ng-content></ng-content>
  <div class="ngx-datepicker-calendar-container ngx-datepicker-position-{{position}}" *ngIf="isOpened">
    <div class="topbar-container">
      <svg width="7px" height="10px" viewBox="0 0 7 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" (click)="prevMonth()">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g transform="translate(-923.000000, -1882.000000)" fill="#CED0DA">
            <g transform="translate(80.000000, 1361.000000)">
              <g transform="translate(0.000000, 430.000000)">
                <g transform="translate(825.000000, 0.000000)">
                  <g transform="translate(0.000000, 72.000000)">
                    <g transform="translate(18.000000, 15.000000)">
                      <polygon id="Back" points="6.015 4 0 9.013 6.015 14.025"></polygon>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
      <span class="topbar-title" (click)="toggleView()">{{ barTitle }}</span>
      <svg width="7px" height="10px" viewBox="0 0 6 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" (click)="nextMonth()">
        <g id="Source-Sans---UI-Elements-Kit" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="White-Layout" transform="translate(-1182.000000, -1882.000000)" fill="#CED0DA">
            <g id="Dropdowns-&amp;-Selector" transform="translate(80.000000, 1361.000000)">
              <g id="Dropdowns" transform="translate(0.000000, 430.000000)">
                <g id="Calendar" transform="translate(825.000000, 0.000000)">
                  <g transform="translate(0.000000, 72.000000)" id="Top-Bar-Nav">
                    <g transform="translate(18.000000, 15.000000)">
                      <polygon id="Forward" transform="translate(262.007500, 9.012500) scale(-1, 1) translate(-262.007500, -9.012500) " points="265.015 4 259 9.013 265.015 14.025"></polygon>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
    <div class="main-calendar-container" *ngIf="view === 'days'">
      <div class="main-calendar-day-names">
        <span class="day-name-unit" *ngFor="let name of dayNames">{{ name }}</span>
      </div>
      <div class="main-calendar-days">
        <span
          class="day-unit"
          *ngFor="let day of days; let i = index;"
          [ngClass]="{ 'is-prev-month': !day.inThisMonth, 'is-today': day.isToday, 'is-selected': day.isSelected, 'is-disabled': !day.isSelectable }"
          (click)="day.isSelectable && setDate(i)"
        >
          {{ day.day }}
        </span>
      </div>
    </div>
    <div class="main-calendar-container" *ngIf="view === 'years'">
      <div class="main-calendar-years" slimScroll [options]="scrollOptions">
        <span class="year-unit" *ngFor="let year of years; let i = index;" [ngClass]="{ 'is-selected': year.isThisYear }" (click)="setYear(i)">{{ year.year }}</span>
      </div>
    </div>
  </div>
</div>

  `,
  styleUrls: ['datepicker.sass'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatepickerComponent), multi: true }
  ]
})
export class DatepickerComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() options: DatepickerOptions;

  /**
   * Disable datepicker's input
   */
  @Input() headless = true;

  /**
   * Set datepicker's visibility state
   */
  @Input() isOpened = true;

  /**
   * Datepicker dropdown position
   */
  @Input() position = 'bottom-right';

  private positions = ['bottom-left', 'bottom-right', 'top-left', 'top-right'];

  innerValue: Date;
  displayValue: string;
  displayFormat: string;
  date: Date;
  barTitle: string;
  barTitleFormat: string;
  minYear: number;
  maxYear: number;
  firstCalendarDay: number;
  view: string;
  years: { year: number; isThisYear: boolean }[];
  dayNames: string[];
  scrollOptions: ISlimScrollOptions;
  days: {
    date: Date;
    day: number;
    month: number;
    year: number;
    inThisMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isSelectable: boolean;
  }[];
  locale: object;

  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  get value(): Date {
    return this.innerValue;
  }

  set value(val: Date) {
    this.innerValue = val;
    this.onChangeCallback(this.innerValue);
  }

  constructor(private elementRef: ElementRef) {
    this.scrollOptions = {
      barBackground: '#DFE3E9',
      gridBackground: '#FFFFFF',
      barBorderRadius: '3',
      gridBorderRadius: '3',
      barWidth: '6',
      gridWidth: '6',
      barMargin: '0',
      gridMargin: '0'
    };
  }

  ngOnInit() {
    this.view = 'days';
    this.date = new Date();
    this.setOptions();
    this.initDayNames();
    this.initYears();

    // Check if 'position' property is correct
    if (this.positions.indexOf(this.position) === -1) {
      throw new TypeError(`ng-datepicker: invalid position property value '${this.position}' (expected: ${this.positions.join(', ')})`);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('options' in changes) {
      this.setOptions();
      this.initDayNames();
      this.init();
      this.initYears();
    }
  }

  setOptions(): void {
    const today = new Date(); // this const was added because during my tests, I noticed that at this level this.date is undefined
    this.minYear = this.options && this.options.minYear || getYear(today) - 30;
    this.maxYear = this.options && this.options.maxYear || getYear(today) + 30;
    this.displayFormat = this.options && this.options.displayFormat || 'MMM D[,] YYYY';
    this.barTitleFormat = this.options && this.options.barTitleFormat || 'MMMM YYYY';
    this.firstCalendarDay = this.options && this.options.firstCalendarDay || 0;
    this.locale = this.options && { locale: this.options.locale } || {};
  }

  nextMonth(): void {
    this.date = addMonths(this.date, 1);
    this.init();
  }

  prevMonth(): void {
    this.date = subMonths(this.date, 1);
    this.init();
  }

  setDate(i: number): void {
    this.date = this.days[i].date;
    this.value = this.date;
    this.init();
    this.close();
  }

  setYear(i: number): void {
    this.date = setYear(this.date, this.years[i].year);
    this.init();
    this.initYears();
    this.view = 'days';
  }

  /**
   * Checks if specified date is in range of min and max dates
   * @param date
   */
  private isDateSelectable(date: Date): boolean {
    if (isNil(this.options)) {
      return true;
    }

    const minDateSet = !isNil(this.options.minDate);
    const maxDateSet = !isNil(this.options.maxDate);
    const timestamp = date.valueOf();

    if (minDateSet && (timestamp < this.options.minDate.valueOf())) {
      return false;
    }

    if (maxDateSet && (timestamp > this.options.maxDate.valueOf())) {
      return false;
    }

    return true;
  }

  init(): void {
    const start = startOfMonth(this.date);
    const end = endOfMonth(this.date);

    this.days = eachDay(start, end).map(date => {
      return {
        date: date,
        day: getDate(date),
        month: getMonth(date),
        year: getYear(date),
        inThisMonth: true,
        isToday: isToday(date),
        isSelected: isSameDay(date, this.innerValue) && isSameMonth(date, this.innerValue) && isSameYear(date, this.innerValue),
        isSelectable: this.isDateSelectable(date)
      };
    });

    for (let i = 1; i <= getDay(start) - this.firstCalendarDay; i++) {
      const date = subDays(start, i);
      this.days.unshift({
        date: date,
        day: getDate(date),
        month: getMonth(date),
        year: getYear(date),
        inThisMonth: false,
        isToday: isToday(date),
        isSelected: isSameDay(date, this.innerValue) && isSameMonth(date, this.innerValue) && isSameYear(date, this.innerValue),
        isSelectable: this.isDateSelectable(date)
      });
    }

    this.displayValue = this.innerValue ? format(this.innerValue, this.displayFormat, this.locale) : '';
    this.barTitle = format(start, this.barTitleFormat, this.locale);
  }

  initYears(): void {
    const range = this.maxYear - this.minYear;
    this.years = Array.from(new Array(range), (x, i) => i + this.minYear).map(year => {
      return { year: year, isThisYear: year === getYear(this.date) };
    });
  }

  initDayNames(): void {
    this.dayNames = [];
    const start = this.firstCalendarDay;
    for (let i = start; i <= 6 + start; i++) {
      const date = setDay(new Date(), i);
      this.dayNames.push(format(date, 'ddd', this.locale));
    }
  }

  toggleView(): void {
    this.view = this.view === 'days' ? 'years' : 'days';
  }

  toggle(): void {
    this.isOpened = !this.isOpened;
  }

  close(): void {
    // this.isOpened = false;
  }

  writeValue(val: Date) {
    if (val) {
      this.date = val;
      this.innerValue = val;
      this.init();
      this.displayValue = format(this.innerValue, this.displayFormat, this.locale);
      this.barTitle = format(startOfMonth(val), this.barTitleFormat, this.locale);
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  @HostListener('document:click', ['$event']) onBlur(e: MouseEvent) {
    if (!this.isOpened) {
      return;
    }

    const input = this.elementRef.nativeElement.querySelector('.ngx-datepicker-input');

    if (input == null) {
      return;
    }

    if (e.target === input || input.contains(<any>e.target)) {
      return;
    }

    const container = this.elementRef.nativeElement.querySelector('.ngx-datepicker-calendar-container');
    if (container && container !== e.target && !container.contains(<any>e.target) && !(<any>e.target).classList.contains('year-unit')) {
      this.close();
    }
  }
}
