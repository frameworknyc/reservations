import { async } from '@angular/core/testing';
import { ScheduleService } from './../core/service/schedule';
import {Component, HostBinding, OnInit, OnDestroy} from "@angular/core";
import {SlimLoadingBarService} from "ng2-slim-loading-bar";
import {routeFadeStateTrigger} from "../app.animations";
import {Router} from "@angular/router";
import {ReservationService} from "../core/service/res";
import { getTime } from 'date-fns';
import {Subscription} from 'rxjs/Subscription';


import { DatepickerOptions } from 'ng2-datepicker';
import * as frLocale from 'date-fns/locale/fr';

import * as _ from 'lodash';

@Component({
  selector: 'times',
  template: `
  <div class='container u-maxWidth1040' style="padding-top: 6em;">

  <header class="hero hero--standalone hero--compact hero--alignLeft u-clearfix u-maxWidth1040 u-flex">
            <h1 class="hero-title u-flex1">Schedule</h1>

            <view-switch class="u-flex0" [(view)]="view"></view-switch>

        </header>


    <div class="" [ngSwitch]="view">

    <tabs *ngSwitchCase="'times'"
     (select)="setDay($event)"
    [weekdays]='weekdays'
    [selectedDay]='selectedDay'>

      <hours [times]='times'
        (block)="toggle($event, selectedDay)">
      </hours>
    </tabs>

      <div class="datepicker-container" *ngSwitchCase="'days'">

        <datepicker class="picker" [(ngModel)]="selectedDate" (ngModelChange)="handleDateChange($event)"></datepicker>
        <div class="block">
        <p>{{ selectedDate | date:'yMMMMEEEEd'}}</p>
        <switch defaultBgColor="#D9D9E4" (change)="dateToggle($event)" [checked]="enable" [date]="selectedDate"></switch>
        <p style="margin-top:30px;">{{ enable? 'date is blocked' : 'date is open' }}</p>

        </div>



        <datelist class="list" [dates]='dates | async' (select)='select($event)'></datelist>

      </div>

    </div>






  </div>
  `,
  styles: [`
  .u-maxWidth1040 {
    max-width: 1040px!important
 }
 .block {
   display: flex;
   align-items: center;
   /* justify-items: flex-start; */
   flex-direction: column;
   height: 275px;
   padding-top: 6em;
 }
  .datepicker-container {
    display: flex;
    justify-content: space-between;
    margin-top: 100px
    justify-content: center

  }

.hero {
  text-align: center;
  height: 500px
}

.hero-title {
  font-family: "GT-Walsheim", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 34px;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -1px;
  color: #35384C;
  margin-bottom: 8px;
  outline: 0;
  word-break: break-word;
  word-wrap: break-word
}

.hero--compact .hero-title {
  float: left
}

.hero--alignLeft {
  text-align: left
}

.hero--standalone {
  padding-top: 100px;
  padding-bottom: 40px;
  height: auto;
  display: flex;
}

@media screen and (max-width:767px) {
  .hero--standalone {
      padding: 0;
      margin-bottom: 10px
  }
  .hero--standalone .hero-title {
      font-size: 18px;
      margin-left: -1.13px;
      height: 44px;
      line-height: 46px;
      margin: 0 -6px 20px;
      padding: 10px 0 10px;
      text-align: left
  }
  .hero--standalone:after {
      display: none
  }
  .hero--compact .hero-title,
  .hero--compact.hero--standalone {
      float: none;
      margin-bottom: 18px;
      margin-left: 0;
  }
}
.u-flex {
  display: -ms-flexbox!important;
  display: flex!important
}

.u-flex1 {
  -ms-flex: 1 1 auto;
  flex: 1 1 auto
}

  `],
  animations: [
    routeFadeStateTrigger
  ]
})
export class TimesComponent implements OnInit {
  @HostBinding('@routeFadeState') routeAnimation = false;
  times;
  enable = true;
  newTimes;
  fbTimes;
  blockedTimes;
  selectedDay;
  selectedDateKey;
  selectedDate;
  view: string;
  day;
  dates;
  datesArray = [];
  dateSub : Subscription;
  error;
  subscription: Subscription;
  dateSubscription: Subscription;
  weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  options: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2030,
    displayFormat: 'MMM D[,] YYYY',
    barTitleFormat: 'MMMM YYYY',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    locale: frLocale,
    minDate: new Date(Date.now()), // Minimal selectable date
    maxDate: new Date(Date.now())  // Maximal selectable date
  };
  constructor(public scheduleService: ScheduleService, private reservationService: ReservationService, private router: Router, private slimLoadingBarService: SlimLoadingBarService) {
  }

  ngOnInit() {
    this.slimLoadingBarService.start();
    this.view = 'times';
    this.dates = this.scheduleService.getBlackList();

    this.subscription = this.scheduleService.selectedDay$
       .subscribe(day => {
         this.selectedDay = day;
    });

    this.dateSubscription = this.scheduleService.selectedDate$
    .subscribe(date => {
      this.enable = this.findDate() ? true : false;
      console.log('youre here')
      this.selectedDate = date;
    });

    this.dateSub = this.scheduleService.getBlackList().subscribe(dates => {
        this.datesArray = dates.map(date => {
          // console.log(date);
          return new Date(date.$value);
        });
      });
    this.getTimes(this.selectedDay);
    this.enable = this.findDate() ? true : false;
    console.log(this.enable)

    this.slimLoadingBarService.complete();
  }

  toggleView(): void {
    this.view = this.view === 'times' ? 'days' : 'times';
  }


  setDay(day): void {
    this.scheduleService.updateDay(day);
    this.getTimes(this.selectedDay);
  }

  getTimes(event) {
    this.scheduleService.getDayTimes(event).subscribe(times => {
      this.times = times;
    });
  }

  toggle(event, day) {
    this.scheduleService.toggle(event, day)
    this.enable = !this.enable
  }


  findDate() { // Since your date is in string
    const d = new Date(this.selectedDate).getTime();
    const dates = this.datesArray.map(_d => new Date(_d).getTime());
    return dates.find(_d => _d === d);
  }

  dateToggle(event) {
    console.log(event)
    this.findDate() ? this.unBlock() : this.blackOut();
  }

  blackOut() {
    const date = this.selectedDate.toString()
    this.scheduleService.blockDate(date);
    this.enable = true;
  }

  unBlock() {
    const key = this.selectedDateKey;
    this.scheduleService.openDate(key);
    this.enable = this.findDate() ? true : false;

  }


  select(event) {
    this.selectedDateKey = event.$key;

    this.scheduleService.updateDate(event.$value);
    this.enable = this.findDate() ? true : false;

    console.log(this.selectedDateKey, this.enable)
  }

  updateDate(date) {
    this.scheduleService.updateDate(date);
  }

  handleDateChange(event) {
    this.enable = this.findDate() ? true : false;
    this.updateDate(event);
    // this.dateToggle(this.enable);
    console.log(this.enable, this.selectedDate, event)
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
    this.dateSub.unsubscribe();
    this.dateSubscription.unsubscribe();
  }
}
