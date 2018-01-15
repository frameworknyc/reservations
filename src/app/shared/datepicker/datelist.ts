import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, HostListener, forwardRef, Output, EventEmitter } from '@angular/core';
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


@Component({
  selector: 'datelist',
  template: `
  <div class="ngx-datelist-container" >
  <ng-content></ng-content>
  <div class="ngx-datelist-calendar-container ngx-datelist-position-{{position}}" >
    <div class="topbar-container">
      <input class="topbar-search" placeholder="search"/>
    </div>
    <div class="main-calendar-container" >
      <div class="main-calendar-years" slimScroll [options]="scrollOptions" >
        <ul class="year-unit" >
          <li class='date-item' *ngFor="let date of dates; let i = index;"
                 [ngClass]="{'is-selected': checkedOption === i}"
                 (click)=' checkedOption = i; select.emit(date);'>{{ date.$value | date:'yMMMMEEEEd' }}</li>
        </ul>
      </div>
    </div>
  </div>
</div>`,
  styleUrls: ['datelist.sass']
})
export class DatelistComponent implements OnInit {
  @Input() dates = [];

  /**
   * Disable datepicker's input
   */
  @Input() headless = true;

  /**
   * Set datepicker's visibility state
   */
  @Output() select = new EventEmitter<boolean>();

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


  constructor(private elementRef: ElementRef) {
    this.scrollOptions = {
      barBackground: '#DFE3E9',
      gridBackground: 'transparent',
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
    // this.setOptions();


    // Check if 'position' property is correct
    if (this.positions.indexOf(this.position) === -1) {
      throw new TypeError(`ng-datepicker: invalid position property value '${this.position}' (expected: ${this.positions.join(', ')})`);
    }
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if ('options' in changes) {
  //     // this.setOptions();
  //     this.initDayNames();
  //     this.init();
  //     this.initYears();
  //   }
  // }

  // setOptions(): void {
  //   const today = new Date(); // this const was added because during my tests, I noticed that at this level this.date is undefined
  //   this.minYear = this.options && this.options.minYear || getYear(today) - 30;
  //   this.maxYear = this.options && this.options.maxYear || getYear(today) + 30;
  //   this.displayFormat = this.options && this.options.displayFormat || 'MMM D[,] YYYY';
  //   this.barTitleFormat = this.options && this.options.barTitleFormat || 'MMMM YYYY';
  //   this.firstCalendarDay = this.options && this.options.firstCalendarDay || 0;
  //   this.locale = this.options && { locale: this.options.locale } || {};
  // }

  nextMonth(): void {
    this.date = addMonths(this.date, 1);
    this.init();
  }

  prevMonth(): void {
    this.date = subMonths(this.date, 1);
    this.init();
  }

  // setDate(i: number): void {
  //   this.date = this.days[i].date;
  //   this.value = this.date;
  //   this.init();
  //   this.close();
  // }

  setYear(i: number): void {
    this.date = setYear(this.date, this.years[i].year);
    // this.init();
    this.view = 'days';
  }

  /**
   * Checks if specified date is in range of min and max dates
   * @param date
   */
  private isDateSelectable(date: Date): boolean {
    // if (isNil(this.options)) {
    //   return true;
    // }

    // const minDateSet = !isNil(this.options.minDate);
    // const maxDateSet = !isNil(this.options.maxDate);
    const timestamp = date.valueOf();

    // if (minDateSet && (timestamp < this.options.minDate.valueOf())) {
    //   return false;
    // }

    // if (maxDateSet && (timestamp > this.options.maxDate.valueOf())) {
    //   return false;
    // }

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



  toggleView(): void {
    this.view = this.view === 'days' ? 'years' : 'days';
  }

  toggle(): void {
    // this.isOpened = !this.isOpened;
  }

}
