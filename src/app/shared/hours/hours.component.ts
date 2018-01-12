import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'hours',
  template: `
    <nav class="u-flex heading heading--borderedTop u-textAlignCenter">
            <ul class="heading-tabs" style="padding: 2em 0; ">
                <li *ngFor="let time of times; let i = index"
                    class="heading-tabsItem u-inlineBlock active">
                    <span class="u-flex1">
                      <span [attr.disabled]=' isOn(time)'
                        class="heading-title u-inlineBlock u-fontWeightNormal"
                        (click)='block.emit(time)'>
                          <a [ngClass]="{ disabled: isOn(time) }"
                            class="estimate-project__checkbox button button--unstyled is-touched">{{ i + 9 | time }}</a>
                      </span>
                    </span>
                </li>
            </ul>
        </nav>
  `,
  styleUrls: ['hour.scss']
})
export class HoursComponent {
  @Input() times;
  @Input() availableTimes;
  @Output() block = new EventEmitter<number>();

  constructor() { }

  isOn(time) {
    if (time.$value) {
      return false;
    }
    return true;

  }

}
