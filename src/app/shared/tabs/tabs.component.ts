import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tabs',
  template: `
  <div class="u-sizeFullHeight u-clearfix">
    <div class="">
        <nav class="u-flex heading heading--borderedTop u-textAlignCenter">
            <ul class="heading-tabs">
                <li *ngFor="let day of weekdays" (click)="select.emit(day)" [ngClass]="{'is-active': selectedDay === day}" class="heading-tabsItem u-inlineBlock">
                    <span class="u-flex1">
                        <span class="heading-title u-inlineBlock u-fontWeightNormal">
                              <a class="button button--unstyled is-touched">{{day | capitalize }}</a>
                      </span>
                    </span>
                </li>
            </ul>
        </nav>
        <ng-content></ng-content>
    </div>
</div>`,
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  @Input() weekdays;
  @Input() selectedDay;

  @Input() view: string;

  @Input() viewDate: Date;

  @Input() locale = 'en';

  @Output() viewChange: EventEmitter<string> = new EventEmitter();

  @Output() select = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

}
