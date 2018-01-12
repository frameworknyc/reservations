import {Component, EventEmitter, forwardRef, HostBinding, Input, OnInit, Output} from '@angular/core'
import {FormGroup, NG_VALUE_ACCESSOR} from "@angular/forms";
import {routeFadeStateTrigger} from "../../app.animations";
import {isBefore, getHours, isToday} from 'date-fns';

const TIME_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => HourFormComponent),
  multi: true
};
@Component({
  selector: 'hour-form',
  template: `
    <section class="estimate-project__questions-section">
      <div class="container">



        <div class="row estimate-project__question-row">
          <div class="col-md-3 center-block">
            <div class="estimate-project__question-container">
              <p class="estimate-project__question">
                <span class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_text">What time would you like?</span></p>
              <div class="estimate-project__question-number">
                3<span class="estimate-project__question-number-of">/4</span>
              </div>
            </div>
          </div>
        </div>
        <div class="row estimate-project__question-row" *ngIf="times; else loading">


          <nav class="u-flex heading heading--borderedTop u-textAlignCenter">
            <ul class="heading-tabs" style="padding: 2em 0; ">
                <li *ngFor="let time of times; let i = index"
                [ngClass]="{ active: checkedOption === i, disabled: isOn(time) }"
                    class="heading-tabsItem u-inlineBlock active">
                    <span class="u-flex1">
                      <span [attr.disabled]=' isOn(time)'
                        class="heading-title u-inlineBlock u-fontWeightNormal"
                        (click)='onTimeSelect(time, i); checkedOption = i'>
                          <a [ngClass]="{ active: checkedOption === i, disabled: isOn(time) }"
                              [attr.disabled]=' isOn(time)'
                            class="estimate-project__checkbox button button--unstyled is-touched">{{ i + 9 | time }}</a>
                      </span>
                    </span>
                </li>
            </ul>
          </nav>


        </div>
        <ng-template #loading>
          <div class="loader"></div>
        </ng-template>
      </div>
    </section>
  `,
  animations: [
    routeFadeStateTrigger
  ],
  styleUrls: ['time-form.scss'],
  providers: [TIME_VALUE_ACCESSOR]
})
export class HourFormComponent implements OnInit {
  @Output() action = new EventEmitter<any>();
  @Input() times;
  @Input() bookedTimes;
  @Input() day;
  @Input() parent: FormGroup;
  @HostBinding('@routeFadeState') routeAnimation = true;

  value;

  onModelChange: Function = (_: any) => {
  }

  onModelTouched: Function = () => {
  }

  registerOnTouched(fn) {
    this.onModelTouched = fn;
  }

  registerOnChange(fn) {
    this.onModelChange = fn;
  }

  writeValue(value) {
    this.value = value || 0;
    console.log(value)
  }

  isBooked(time) {
    const now = getHours(Date.now());
    if (this.bookedTimes.indexOf(time) > -1) {
      return true;
    } else if (isToday(this.day) && isBefore(time, now)) {
      return true;
    }
    return false;
  }

  onTimeSelect(event, i) {
    let d=new Date();
    console.log('dayyy', d.getDay());

    let time = parseInt(event.$key)

    console.log('in form', time);
    if (this.value !== time) {
      this.writeValue(time);
      this.onModelChange(this.value);
    }
    this.onModelTouched();
  }

  isOn(time) {
    if (time.$value) {
      return false;
    }
    return true;
  }

  ngOnInit() { }

}
