import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: 'time-list',
  template: `
    <section class="estimate-project__questions-section">
      <div class="container">

        <div class="row estimate-project__question-row">

          <div class="col-sm-2 col-md-2 center-block hour"
               *ngFor="let time of times; let i = index">
            <div class="estimate-project__checkbox"
                 (click)="onTimeSelect(time.hour, i); checkedOption = i"
                 [ngClass]="{active: checkedOption === i, disabled: isBooked(time.hour)}">
              <div class="estimate-project__checkbox__icon">
            <span class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_image">

            </span>
              </div>
              <div class="estimate-project__checkbox__text">
                <span class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_text">{{ time.hour | time}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['time-list.scss']
})
export class TimeListComponent implements OnInit {
  @Input() times;
  @Input() availableTimes;
  @Input() showActionButton;
  @Input() showUserInfo;

    step = {
    isActive: false,
    isDisabled: false,
    isComplete: false
  };

  constructor() {
  }

  ngOnInit() {
    console.log(this.times);

  }
  onTimeSelect() {}
  isBooked(time) {
    // const today = isToday(Date.now());
    // const now = getHours(Date.now());
    // console.log(isToday(this.day));
    if (this.availableTimes.indexOf(time) > -1) {
      return true;
    }
    return false;
  }

}
