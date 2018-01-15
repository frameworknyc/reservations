import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'hours',
  template: `
    <nav class="u-flex heading heading--borderedTop u-textAlignCenter">
            <ul class="heading-tabs" style="padding: 2em 0; ">
                <li *ngFor="let time of times; let i = index"
                [style.width] = "'9.09%'"
                    class="heading-tabsItem u-inlineBlock active">
                    <span class="u-flex1">
                      <span [attr.disabled]=' isOn(time)'
                        class="heading-title u-inlineBlock u-fontWeightNormal"
                        >
                          <a (click)='block.emit(time)'
                             [style.color] = "isOn(time) ? '#9DA3AC' : '#36384A'"
                             [style.backgroundColor] = "isOn(time) ? '#E2E9ED' : '#FFF'"
                             [style.borderColor] = "isOn(time) ? '#E2E9ED' : '#d9d9d9'"
                             [ngClass]="{ disabled: isOn(time) }"
                            class="estimate-project__checkbox button button--unstyled is-touched">{{ i + 9 | time }}</a>
                      </span>
                    </span>
                </li>
            </ul>
        </nav>
  `,
  // styleUrls: ['hour.scss']
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
