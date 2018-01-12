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

    <view-switch [(view)]="view"></view-switch>

    <div class="" [ngSwitch]="view">

    <tabs *ngSwitchCase="'times'"
     (select)="setDay($event)"
    [weekdays]='weekdays'
    [selectedDay]='selectedDay'>

    <hours
        [times]='times'
        (block)="toggle($event, selectedDay)">
      </hours>
      </tabs>

      <div class="" *ngSwitchCase="'days'">



        <pre>{{ selectedDate }}, {{ enable }}</pre>

        <p>{{ selectedDate | date:'yMMMMEEEEd'}}</p>

        <switch (change)="dateToggle()" reverse [checked]="enable"></switch>

        <datepicker [(ngModel)]="selectedDate"></datepicker>

        <datelist [dates]='dates | async' (select)='select($event)'></datelist>


      </div>


    </div>






  </div>
  `,
  styles: [`
  .u-maxWidth1040 {
    max-width: 1040px!important
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
    this.view = 'days';
    this.dates = this.scheduleService.getBlackList();

    this.subscription = this.scheduleService.selectedDay$
       .subscribe(day => {
         this.selectedDay = day;
    });
    this.dateSubscription = this.scheduleService.selectedDate$
    .subscribe(date => {
      this.enable = this.findDate() ? true : false;
      this.selectedDate = date;
    });

    this.dateSub = this.scheduleService.getBlackList().subscribe(dates => {
        this.datesArray = dates.map(date => {
          // console.log(date);
          return new Date(date.$value);
        });
      });
    this.getTimes(this.selectedDay);
    // this.enable = this.isBlocked();
    this.enable = this.findDate() ? true : false;

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

  isBlocked() {
    return this.datesArray.some(d => d === this.selectedDate);
  }

  findDate() { // Since your date is in string
    const d = new Date(this.selectedDate).getTime();
    const dates = this.datesArray.map(_d => new Date(_d).getTime());
    return dates.find(_d => _d === d);
  }



  dateToggle() {
    if (this.findDate()) this.unBlock();
    else this.blackOut();
  }

  blackOut() {
    const date = this.selectedDate.toString()
    this.scheduleService.blockDate(date)
  }

  unBlock() {
    const key = this.selectedDateKey;
    this.scheduleService.openDate(key)
  }




  select(event) {
     this.scheduleService.updateDate(event.$value);
     this.scheduleService.openDate(event.$key);

     console.log(this.selectedDateKey, this.enable)
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
    this.dateSub.unsubscribe();
    this.dateSubscription.unsubscribe();
  }
}
