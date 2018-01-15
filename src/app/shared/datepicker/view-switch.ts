import { Component, Input, Output, EventEmitter, HostListener, forwardRef } from '@angular/core';



@Component({
  selector: 'view-switch',
  template: `
  <div class="u-flex0">
        <div class="buttonSwitch">
        <button (click)="viewChange.emit('times')"
        [class.active]="view === 'times'"
        class="button button--withChrome u-baseColor--buttonNormal">Times
</button>
<button (click)="viewChange.emit('days')"
        [class.active]="view === 'days'"
        class="button button--withChrome u-baseColor--buttonNormal">Days
</button>
        </div>
      </div>
  `,
  styles: [`


* {
  box-sizing: border-box;
}

.u-flex0 {
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}

.buttonSwitch {
  display: inline-block;
  position: relative;
  height: 40px;
  border: 1px solid rgba(0, 0, 0, .15);
  vertical-align: bottom;
  box-sizing: border-box;
  border-radius: 5px;
}

.list-item {
  list-style: none;
  border-top: 1px solid rgba(255, 255, 255, .2);
  padding: 40px 0 35px;
}

li {
  display: list-item;
  text-align: -webkit-match-parent;
}

.buttonSwitch .button {
  border: 0;
  height: 100%;
  width: auto;
  text-align: center;
  color: rgba(0, 0, 0, .44);
  padding: 0 16px;
  transition: none;
}

.buttonSwitch .button:first-child, .buttonSwitch .button:nth-child(2) {
  /*border-right: 1px solid rgba(0, 0, 0, .15);*/
}

.buttonSwitch .button:first-child {
  border-radius: 5px 0 0 5px;
}

.buttonSwitch .button:nth-child(2) {
  border-radius: 0;
}

.buttonSwitch .button:last-child {
  border-radius: 0 5px 5px 0;
  border-right: 0;
}

.active, .travel {
  opacity: 1;
  color: #FFF !important;
  background-color: #35384C !important;
  border-color: #35384C !important;
  box-shadow: 0 0 0 1px #35384C;
}

.header {
  text-align: center;
  margin: 0 auto;

}


    `]
})
export class ViewSwitchComponent {

  @Input() view;

  @Output() viewChange: EventEmitter<string> = new EventEmitter();


}
